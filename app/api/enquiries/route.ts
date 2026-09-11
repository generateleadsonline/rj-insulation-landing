import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveEnquiry } from "@/lib/enquiry-store";
import { isAge, isRequirements, recommendInsulation, recommendBoarding } from "@/lib/calculator-logic";

const schema=z.object({
  id:z.string().uuid(),
  kind:z.enum(["insulation","loft-storage"]),
  selection:z.unknown(),
  name:z.string().trim().min(2,"Please enter your full name.").max(100),
  email:z.string().trim().email("Please enter a valid email address.").max(200),
  phone:z.string().trim().max(25).refine(v=>!v||/^[+\d()\s-]{7,25}$/.test(v),"Please check your phone number.").optional(),
  postcode:z.string().trim().toUpperCase().regex(/^(GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/,"Please enter a valid UK postcode."),
  website:z.string().max(0),
});
export async function POST(request:NextRequest) {
  // Next.js may construct request.url with its internal server hostname.
  // The Host header identifies the public destination and cannot be set by a browser script.
  let origin:URL;
  try { origin=new URL(request.headers.get("origin")??""); }
  catch { return NextResponse.json({error:"Please submit your request from this website."},{status:403}); }
  const publicHost=request.headers.get("host")??new URL(request.url).host;
  if(!["http:","https:"].includes(origin.protocol)||origin.host!==publicHost)return NextResponse.json({error:"Please submit your request from this website."},{status:403});
  if(!request.headers.get("content-type")?.includes("application/json"))return NextResponse.json({error:"Invalid request."},{status:415});
  const declaredLength=Number(request.headers.get("content-length")??0);
  if(declaredLength>12000)return NextResponse.json({error:"Request too large."},{status:413});
  let raw:unknown;
  try{const body=await request.text();if(body.length>12000)return NextResponse.json({error:"Request too large."},{status:413});raw=JSON.parse(body)}catch{return NextResponse.json({error:"Please check your details and try again."},{status:400})}
  const parsed=schema.safeParse(raw);
  if(!parsed.success){const errors:Record<string,string>={};for(const issue of parsed.error.issues){const key=String(issue.path[0]);if(["name","email","phone","postcode"].includes(key))errors[key]=issue.message}return NextResponse.json({errors:Object.keys(errors).length?errors:{form:"Please check your details and try again."}},{status:400})}
  const data=parsed.data;
  const valid=data.kind==="insulation"?isAge(data.selection):isRequirements(data.selection);
  if(!valid)return NextResponse.json({errors:{form:"Please complete the calculator before submitting."}},{status:400});
  const recommendation=data.kind==="insulation"&&isAge(data.selection)?recommendInsulation(data.selection):recommendBoarding(data.selection as Parameters<typeof recommendBoarding>[0]);
  try {
    await saveEnquiry({id:data.id,kind:data.kind,name:data.name,email:data.email,phone:data.phone||null,postcode:data.postcode,selection:data.selection,recommendation,createdAt:new Date().toISOString(),privacyVersion:"2026-09-10"});
    const response=NextResponse.json({redirect:"/thank-you/"+data.kind},{headers:{"Cache-Control":"no-store"}});
    response.cookies.set("rj-receipt-"+data.kind,data.id,{httpOnly:true,secure:origin.protocol==="https:",sameSite:"lax",path:"/thank-you/"+data.kind,maxAge:60*60*24});
    return response;
  }catch{return NextResponse.json({error:"We couldn’t save your request. Please try again or call 0800 804 4625."},{status:503})}
}
