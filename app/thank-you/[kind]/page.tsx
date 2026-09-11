import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { getEnquiry, type Enquiry } from "@/lib/enquiry-store";
import { recommendInsulation, recommendBoarding, isAge, isRequirements, money } from "@/lib/calculator-logic";

export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Your consultation request | RJ Insulation",robots:{index:false,follow:false},alternates:{canonical:null}};
export default async function ThankYou({params}:{params:Promise<{kind:string}>}) {
  const {kind}=await params;
  if(kind!=="insulation"&&kind!=="loft-storage")notFound();
  const jar=await cookies();
  const id=jar.get("rj-receipt-"+kind)?.value;
  let receipt:Enquiry|null=null;
  if(id){try{receipt=await getEnquiry(kind,id)}catch{}}
  const insulation=receipt&&kind==="insulation"&&isAge(receipt.selection)?recommendInsulation(receipt.selection):null;
  const storage=receipt&&kind==="loft-storage"&&isRequirements(receipt.selection)?recommendBoarding(receipt.selection):null;
  return <><SiteHeader simple /><main id="main" className="thank-you shell"><div className="thank-you-grid"><div className="thank-you-copy">{receipt?<><div className="success-icon"><Check aria-label="Request received" /></div><p className="eyebrow">{kind==="insulation"?"YOUR INSULATION ENQUIRY":"YOUR LOFT STORAGE ENQUIRY"}</p><h1>Thank you.<br /><em>A good start.</em></h1><p>Your consultation request has been received, together with your calculator choices. Thank you for sharing a little about your home.</p><p className="receipt-reference">Your reference: {receipt.id.slice(0,8).toUpperCase()}</p></>:<><p className="eyebrow">LET’S FIND YOUR FIT</p><h1>Your next step<br /><em>starts here.</em></h1><p>Complete the {kind==="insulation"?"insulation":"loft storage"} calculator and send your details to receive a confirmation of your consultation request.</p></>}<div className="thank-actions"><a className="button button-dark" href="tel:08008044625">Talk to RJ: 0800 804 4625 <ArrowUpRight size={18} /></a><a className="text-link" href={kind==="insulation"?"/#insulation":"/#boarding-calculator"}>Back to the calculator <ArrowUpRight size={16} /></a></div></div><aside className="thank-summary">{insulation?<><p className="eyebrow">YOUR INITIAL GUIDANCE</p><h2>{insulation.name}</h2><p>Property age: {insulation.ageLabel}</p><p style={{marginTop:"1rem"}}>{insulation.description}</p><p className="small-print" style={{marginTop:"1rem"}}>A survey confirms the material and specification.</p></>:storage?<><p className="eyebrow">YOUR LOFT WISH LIST / OPTION {storage.option}</p><h2>{storage.name}</h2><p>Starting from <strong>{money(storage.price)}</strong></p><ul>{storage.included.map(x=><li key={x}>{x}</li>)}</ul><p className="small-print">Guide starting price. The final specification, applicable taxes and quote are confirmed after a survey.</p></>:<><p className="eyebrow">A LITTLE MORE POSSIBILITY</p><h2>Good advice.<br /><em>Made personal.</em></h2><p>Tell us about your home, see a useful starting point and explore the next step.</p></>}<div className="thank-next"><h3>Have a question already?</h3><p>Call our team on <a className="text-link" href="tel:08008044625">0800 804 4625</a> or email <a className="text-link" href="mailto:info@rjinsulation.co.uk">info@rjinsulation.co.uk</a>.</p></div></aside></div></main><SiteFooter /></>;
}
