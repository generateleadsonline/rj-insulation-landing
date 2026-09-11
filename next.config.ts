import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Only public, non-secret deployment settings are embedded into the build.
  env: {
    RJ_SITE_URL: process.env.SITE_URL || process.env.URL || "http://localhost:3000",
    RJ_DEPLOY_CONTEXT: process.env.CONTEXT || "local",
  },
  async headers() {
    return [
      { source: "/:path*", headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "DENY" },
      ] },
      { source: "/thank-you/:path*", headers: [
        { key: "X-Robots-Tag", value: "noindex, nofollow" },
        { key: "Cache-Control", value: "private, no-store" },
      ] },
      { source: "/api/:path*", headers: [
        { key: "X-Robots-Tag", value: "noindex, nofollow" },
        { key: "Cache-Control", value: "no-store" },
      ] },
    ];
  },
};

export default nextConfig;
