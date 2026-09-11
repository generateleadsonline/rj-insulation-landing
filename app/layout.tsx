import type { Metadata } from "next";
import { siteUrl, isProductionSite } from "@/lib/site-url";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: siteUrl,
  robots: { index: isProductionSite, follow: isProductionSite },
  title: "Sustainable Loft Insulation & Storage | RJ Insulation",
  description: "Find the right loft insulation for your home and explore beautifully finished loft storage. Try RJ Insulation’s property and storage package calculators.",
  alternates: { canonical: "/" },
  openGraph: { title: "A better feeling at home. | RJ Insulation", description: "Sustainable loft insulation. Beautifully finished storage. Thoughtfully installed around you.", type: "website", locale: "en_GB" },
  icons: { icon: "/images/rj-logo.svg" },
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en-GB"><body>{children}</body></html>;
}
