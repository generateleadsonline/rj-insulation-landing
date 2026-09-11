import { getStore } from "@netlify/blobs";

export type EnquiryKind = "insulation" | "loft-storage";
export type Enquiry = {
  id: string;
  kind: EnquiryKind;
  name: string;
  email: string;
  phone: string | null;
  postcode: string;
  selection: unknown;
  recommendation: unknown;
  createdAt: string;
  privacyVersion: string;
};

function store() {
  // Site-wide storage survives new deploys. Preview submissions stay separate.
  const context = process.env.RJ_DEPLOY_CONTEXT ?? "local";
  return getStore({ name: `rj-enquiries-${context}`, consistency: "strong" });
}

export async function saveEnquiry(enquiry: Enquiry) {
  // A timed-out submission can be retried without overwriting an existing lead.
  await store().setJSON(`${enquiry.kind}/${enquiry.id}`, enquiry, { onlyIfNew: true });
}

export async function getEnquiry(kind: EnquiryKind, id: string): Promise<Enquiry | null> {
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id)) return null;
  const result = await store().get(`${kind}/${id}`, { type: "json" }) as Enquiry | null;
  return result?.id === id && result.kind === kind ? result : null;
}
