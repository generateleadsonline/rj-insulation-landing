import type { MetadataRoute } from "next";
import { siteUrl, isProductionSite } from "@/lib/site-url";
export default function robots():MetadataRoute.Robots {
  return isProductionSite
    ? {rules:{userAgent:"*",allow:"/",disallow:["/thank-you/","/api/"]},sitemap:new URL("/sitemap.xml",siteUrl).href}
    : {rules:{userAgent:"*",disallow:"/"}};
}
