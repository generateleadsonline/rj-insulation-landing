import type { MetadataRoute } from "next";
import { siteUrl, isProductionSite } from "@/lib/site-url";
export default function sitemap():MetadataRoute.Sitemap {
  return isProductionSite ? [{url:siteUrl.href,lastModified:"2026-09-11",changeFrequency:"monthly",priority:1}] : [];
}
