export const siteUrl = new URL(process.env.RJ_SITE_URL ?? "http://localhost:3000");
export const isProductionSite = process.env.RJ_DEPLOY_CONTEXT === "production";
