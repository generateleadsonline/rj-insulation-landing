import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { getStore, setEnvironmentContext } from "@netlify/blobs";
import { BlobsServer } from "@netlify/blobs/server";

let app: ChildProcess;
let blobs: BlobsServer;
let directory: string;
let origin: string;
let context: string;
let output = "";
let blobsStopped = false;

before(async () => {
  directory = await mkdtemp(join(tmpdir(), "rj-enquiries-test-"));
  const token = randomUUID();
  blobs = new BlobsServer({ directory, token, logger: () => {} });
  const { port: blobsPort } = await blobs.start();
  const blobsContext = { siteID: "local-integration-test", token, apiURL: `http://localhost:${blobsPort}` };
  setEnvironmentContext(blobsContext);

  const server = createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert(address && typeof address === "object");
  const port = address.port;
  await new Promise<void>(resolve => server.close(() => resolve()));
  origin = `http://127.0.0.1:${port}`;
  const build = JSON.parse(await readFile(".next/required-server-files.json", "utf8"));
  context = build.config.env.RJ_DEPLOY_CONTEXT;
  app = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", String(port)], {
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", NETLIFY_BLOBS_CONTEXT: Buffer.from(JSON.stringify(blobsContext)).toString("base64") },
    stdio: ["ignore", "pipe", "pipe"],
  });
  app.stdout?.on("data", chunk => { output += chunk; });
  app.stderr?.on("data", chunk => { output += chunk; });
  for (let attempt = 0; attempt < 100; attempt++) {
    if (app.exitCode !== null) throw new Error(`Next.js failed to start: ${output}`);
    try { if ((await fetch(origin)).ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Next.js startup timed out: ${output}`);
});

after(async () => {
  if (app && app.exitCode === null) {
    app.kill("SIGTERM");
    await once(app, "exit");
  }
  if (!blobsStopped) await blobs?.stop();
  if (directory) await rm(directory, { recursive: true, force: true });
});

const details = () => ({ id: randomUUID(), name: "Deployment Test", email: "deployment@example.com", phone: "", postcode: "SW1A 1AA", website: "" });
const submit = (body: unknown, requestOrigin = origin) => fetch(`${origin}/api/enquiries`, {
  method: "POST", headers: { "Content-Type": "application/json", Origin: requestOrigin }, body: JSON.stringify(body),
});

test("the page and its original visual assets are served by the production build", async () => {
  const response = await fetch(origin);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert(html.replace(/<[^>]*>/g, "").includes("We look at the whole picture"));
  assert.match(html, /lang="en-GB"/);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  for (const path of ["/images/rj-logo.svg", "/images/loft-hero-1400.webp", "/robots.txt", "/sitemap.xml"]) {
    assert.equal((await fetch(origin + path)).status, 200, path);
  }
});

for (const [kind, selection, expected] of [
  ["insulation", "pre1920", "Sheep"],
  ["loft-storage", ["windows", "vinyl"], "35,000"],
] as const) {
  test(`${kind}: save to Blobs, retry safely, and render the matching thank-you receipt`, async () => {
    const lead = { ...details(), kind, selection, recommendation: { price: 1 } };
    const response = await submit(lead);
    assert.equal(response.status, 200, await response.clone().text());
    assert.deepEqual(await response.json(), { redirect: `/thank-you/${kind}` });
    const cookie = response.headers.get("set-cookie");
    assert(cookie);
    assert.match(cookie, /HttpOnly/i);
    assert.match(cookie, /SameSite=lax/i);
    assert.match(cookie, new RegExp(`Path=/thank-you/${kind}`));
    const store = getStore({ name: `rj-enquiries-${context}`, consistency: "strong" });
    const saved = await store.get(`${kind}/${lead.id}`, { type: "json" });
    assert.equal(saved.email, lead.email);
    assert.deepEqual(saved.selection, selection);
    if (kind === "loft-storage") assert.equal(saved.recommendation.price, 35000);
    const retry = await submit({ ...lead, email: "changed@example.com" });
    assert.equal(retry.status, 200);
    assert.deepEqual(await store.get(`${kind}/${lead.id}`, { type: "json" }), saved);

    const receipt = await fetch(`${origin}/thank-you/${kind}`, { headers: { Cookie: cookie.split(";")[0] } });
    assert.equal(receipt.status, 200);
    const html = await receipt.text();
    assert.match(html, /Your consultation request has been received/);
    assert.match(html, new RegExp(expected));
    assert(!html.includes(lead.email));
    assert(!html.includes(lead.postcode));
    assert.match(receipt.headers.get("cache-control") ?? "", /no-store/);
    assert.match(receipt.headers.get("x-robots-tag") ?? "", /noindex/);
  });
}

test("invalid submissions and requests from another origin are rejected", async () => {
  const valid = { ...details(), kind: "insulation", selection: "unknown" };
  for (const patch of [{ email: "bad" }, { postcode: "bad" }, { selection: "made-up" }, { website: "bot.example" }]) {
    assert.equal((await submit({ ...valid, ...patch })).status, 400);
  }
  assert.equal((await submit(valid, "https://unrelated.example")).status, 403);
});

test("a thank-you page without a saved receipt cannot claim success", async () => {
  for (const kind of ["insulation", "loft-storage"]) {
    const response = await fetch(`${origin}/thank-you/${kind}`);
    assert.equal(response.status, 200);
    assert(!(await response.text()).includes("Your consultation request has been received"));
  }
  assert.equal((await fetch(`${origin}/thank-you/invalid`)).status, 404);
});

test("a storage outage returns an error without issuing a success receipt", async () => {
  await blobs.stop();
  blobsStopped = true;
  const response = await submit({ ...details(), kind: "insulation", selection: "unknown" });
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("set-cookie"), null);
});
