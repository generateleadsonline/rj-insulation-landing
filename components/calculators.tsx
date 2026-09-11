"use client";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ArrowLeft, ArrowUpRight, Check, LockKeyhole } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { ageOptions, requirements, recommendInsulation, recommendBoarding, isAge, isRequirements, money, type Age, type Requirement } from "@/lib/calculator-logic";
import { registerCalculatorTool } from "@/lib/webmcp";

function makeSubmissionId() {
  const bytes=crypto.getRandomValues(new Uint8Array(16));
  bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
  const hex=Array.from(bytes,b=>b.toString(16).padStart(2,"0")).join("");
  return [hex.slice(0,8),hex.slice(8,12),hex.slice(12,16),hex.slice(16,20),hex.slice(20)].join("-");
}

function EnquiryForm({kind,selection}:{kind:"insulation"|"loft-storage",selection:Age|Requirement[]}) {
  const [pending,setPending]=useState(false);
  const [errors,setErrors]=useState<Record<string,string>>({});
  const submissionId=useRef<string|null>(null);
  const errorRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{if(Object.keys(errors).length)errorRef.current?.focus()},[errors]);
  async function submit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if(pending)return;
    const form=e.currentTarget;
    const data=new FormData(form);
    const next:Record<string,string>={};
    const name=String(data.get("name")??"").trim();
    const email=String(data.get("email")??"").trim();
    const phone=String(data.get("phone")??"").trim();
    const postcode=String(data.get("postcode")??"").trim().toUpperCase();
    if(name.length<2)next.name="Please enter your full name.";
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))next.email="Please enter a valid email address.";
    if(!/^(GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/.test(postcode))next.postcode="Please enter a valid UK postcode.";
    if(phone&&!/^[+\d()\s-]{7,25}$/.test(phone))next.phone="Please check your phone number, or leave it blank.";
    if(Object.keys(next).length){setErrors(next);return}
    setErrors({});setPending(true);
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),20000);
    try {
      submissionId.current??=makeSubmissionId();
      const response=await fetch("/api/enquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:submissionId.current,kind,selection,name,email,phone,postcode,website:data.get("website")??""}),signal:controller.signal});
      const result=await response.json() as {errors?:Record<string,string>;error?:string;redirect:string};
      if(!response.ok){setErrors(result.errors??{form:result.error??"We couldn’t save your request. Please try again or call 0800 804 4625."});return}
      window.location.assign(result.redirect);
    }catch{setErrors({form:"We couldn’t confirm your request. Your details are still here — please try again, or call 0800 804 4625."})}
    finally{clearTimeout(timer);setPending(false)}
  }
  const fields=[
    {name:"name",label:"Full name",type:"text",autoComplete:"name",maxLength:100,wide:true},
    {name:"email",label:"Email address",type:"email",autoComplete:"email",maxLength:200,wide:true},
    {name:"postcode",label:"Property postcode",type:"text",autoComplete:"postal-code",maxLength:10},
    {name:"phone",label:"Phone (optional)",type:"tel",autoComplete:"tel",maxLength:25},
  ];
  return <form className="enquiry-form" onSubmit={submit} noValidate aria-label={kind==="insulation"?"Insulation consultation request":"Loft storage consultation request"}>
    {Object.keys(errors).length>0&&<div className="form-error" role="alert" tabIndex={-1} ref={errorRef}>{errors.form??"Please check the highlighted details below."}</div>}
    <div className="field-grid">{fields.map(f=><div key={f.name} className={"form-field"+(f.wide?" wide":"")}><label htmlFor={kind+"-"+f.name}>{f.label}</label><Input id={kind+"-"+f.name} name={f.name} type={f.type} autoComplete={f.autoComplete} maxLength={f.maxLength} required={f.name!=="phone"} aria-invalid={!!errors[f.name]} aria-describedby={errors[f.name]?kind+"-"+f.name+"-error":undefined} />{errors[f.name]&&<span className="field-error" id={kind+"-"+f.name+"-error"}>{errors[f.name]}</span>}</div>)}</div>
    <div className="honeypot" aria-hidden="true"><label>Leave this empty<input name="website" autoComplete="off" tabIndex={-1} /></label></div>
    <p className="privacy-note">We’ll use these details to respond to your enquiry. Read our <a href="https://rjinsulation.co.uk/privacy-policy/" target="_blank" rel="noreferrer">privacy policy<span className="sr-only"> (opens in a new tab)</span></a>.</p>
    <Button type="submit" className="button button-dark full-button" disabled={pending}>{pending?"Saving your request…":"Request my consultation"}<ArrowUpRight size={19} aria-hidden="true" /></Button>
    <p className="calculator-footnote"><LockKeyhole size={13} aria-hidden="true" /> No obligation. Just a helpful conversation.</p>
  </form>;
}

export function InsulationCalculator() {
  const [age,setAge]=useState<Age|undefined>();
  const [showResult,setShowResult]=useState(false);
  const [error,setError]=useState(false);
  const resultHeading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{if(showResult)resultHeading.current?.focus()},[showResult]);
  useEffect(()=>registerCalculatorTool({
    name:"configure_insulation_guidance",
    title:"Find insulation guidance",
    description:"Set a property age and show RJ’s provisional insulation guidance in the visible calculator. Does not submit an enquiry.",
    inputSchema:{type:"object",properties:{age:{type:"string",enum:ageOptions.map(a=>a.value)}},required:["age"],additionalProperties:false},
    execute(input){const a=(input as {age?:unknown})?.age;if(!isAge(a))throw new Error("Choose a valid property age.");flushSync(()=>{setAge(a);setShowResult(true);setError(false)});return recommendInsulation(a)}
  }),[]);
  const result=age?recommendInsulation(age):null;
  return <div className="calculator-card">
    <div className="calculator-step"><span>{showResult?"YOUR STARTING POINT":"A LITTLE ABOUT YOUR HOME"}</span><span className="step-marks" aria-label={showResult?"Step 2 of 2":"Step 1 of 2"}><span className="active" /><span className={showResult?"active":""} /></span></div>
    {!showResult?<><h3 id="age-question">When was your home built?</h3><p className="calculator-subtitle">An approximate age is absolutely fine.</p><RadioGroup value={age??""} onValueChange={v=>{if(isAge(v)){setAge(v);setError(false)}}} className="age-options" aria-labelledby="age-question" aria-describedby={error?"age-error":undefined}>{ageOptions.map(a=><label key={a.value} className="age-choice" data-selected={age===a.value} htmlFor={"age-"+a.value}><RadioGroupItem value={a.value} id={"age-"+a.value} className="choice-radio" /><span><strong>{a.label}</strong><small>{a.detail}</small></span></label>)}</RadioGroup>{error&&<p id="age-error" className="field-error" role="alert">Choose an age, or select “I’m not sure”.</p>}<Button className="button button-dark full-button" onClick={()=>age?setShowResult(true):setError(true)}>See my suggestion <ArrowUpRight size={19} /></Button><p className="calculator-footnote"><LockKeyhole size={13} aria-hidden="true" /> See your suggestion before sharing any details.</p><noscript><p className="no-js-note">Please enable JavaScript to use this calculator, or call 0800 804 4625 for guidance.</p></noscript></>:result&&<>
      <button className="back-button" type="button" onClick={()=>setShowResult(false)}><ArrowLeft size={15} /> Change property age</button>
      <div className="result-panel"><p className="eyebrow">{result.ageLabel} / A MATERIAL TO EXPLORE</p><h4 ref={resultHeading} tabIndex={-1}>{result.name}</h4><p>{result.description}</p><p className="result-alt">{result.alternative}</p></div>
      <h3 className="form-heading">Make it right for your home.</h3><p className="form-intro">Share a few details and let’s talk through your options. This suggestion is a starting point, not a confirmed specification.</p><EnquiryForm kind="insulation" selection={age!} />
    </>}
  </div>;
}

export function BoardingCalculator() {
  const [selected,setSelected]=useState<Requirement[]>([]);
  const [enquire,setEnquire]=useState(false);
  const enquiryHeading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{if(enquire)enquiryHeading.current?.focus()},[enquire]);
  useEffect(()=>registerCalculatorTool({
    name:"configure_loft_storage",
    title:"Configure loft storage",
    description:"Set the requested loft features and update the visible recommended package and starting price. Does not submit an enquiry.",
    inputSchema:{type:"object",properties:{requirements:{type:"array",items:{type:"string",enum:requirements.map(r=>r.id)},uniqueItems:true,maxItems:6}},required:["requirements"],additionalProperties:false},
    execute(input){const r=(input as {requirements?:unknown})?.requirements;if(!isRequirements(r))throw new Error("Choose valid, unique loft features.");flushSync(()=>setSelected(r));return recommendBoarding(r)}
  }),[]);
  const result=recommendBoarding(selected);
  return <div id="boarding-calculator" className="boarding-calculator">
    <div className="boarding-heading"><div><h3>Build your loft wish list.</h3><p>Tick the features you’d love. We’ll find your package.</p></div><p>These are insulated storage-room packages, starting at £10,000. They are not quotations for boarding alone.</p></div>
    <div className="boarding-columns">
      <fieldset className="checkbox-group"><legend>What would you like in your loft?</legend><div className="included-row"><Check aria-hidden="true" /> SuperFOIL insulation &amp; boarding <span>ALWAYS INCLUDED</span></div>{requirements.map(r=><label key={r.id} className="requirement-row" htmlFor={"requirement-"+r.id}><Checkbox id={"requirement-"+r.id} className="choice-check" checked={selected.includes(r.id)} onCheckedChange={v=>setSelected(old=>v===true?[...old.filter(x=>x!==r.id),r.id]:old.filter(x=>x!==r.id))} /><span>{r.label}</span></label>)}
        <div className="package-compare" aria-label="All package starting prices">{[["1","Practical foundation","£10,000"],["2","Finished space","£20,000"],["3","Complete transformation","£35,000"]].map(([n,title,price])=><div className={"package-mini"+(String(result.option)===n?" active":"")} key={n}><span>OPTION {n}</span><p>{title}</p><strong>From {price}</strong></div>)}</div>
      </fieldset>
      <div className="package-summary"><div aria-live="polite" aria-atomic="true"><p className="eyebrow">YOUR MATCH / OPTION {result.option}</p><h4>{result.name}</h4><div className="package-price"><span>Starting from</span>{money(result.price)}</div><p>Your recommended package includes:</p><ul className="package-includes">{result.included.map(x=><li key={x}><Check aria-hidden="true" />{x}</li>)}</ul></div><p className="small-print">The highest-level feature you choose determines your package, which includes the features listed above. Guide starting prices only; size, access, specification and tax treatment are confirmed in your written quote after a survey.</p><Button className="button button-gold" onClick={()=>setEnquire(true)} aria-expanded={enquire} aria-controls="boarding-enquiry">Let’s discuss my loft <ArrowUpRight size={19} /></Button></div>
    </div>
    {enquire&&<div className="boarding-enquiry" id="boarding-enquiry"><h4 tabIndex={-1} ref={enquiryHeading}>Your space. Your next step.</h4><p className="form-intro">You’re exploring Option {result.option}, from {money(result.price)}. Tell us a little about yourself to request a consultation.</p><EnquiryForm kind="loft-storage" selection={selected} /></div>}
    <noscript><p className="no-js-note">Please enable JavaScript to configure a package. Options start at £10,000, £20,000 and £35,000. Call 0800 804 4625 to discuss your loft.</p></noscript>
  </div>;
}
const faqs=[
  ["Can you recommend insulation from my property’s age alone?","The calculator gives an initial direction using RJ’s property-age guidance. Construction, roof condition, moisture, ventilation, existing insulation and intended use all matter. A survey confirms the material and installation specification."],
  ["What is included in the loft storage packages?","Option 1 starts with SuperFOIL insulation and boarding. Option 2 adds internal plasterboard and luxury vinyl flooring. Option 3 adds handmade cupboards, VELUX roof windows, electrics and final decoration. The calculator shows the full package your chosen features require."],
  ["Is a loft storage room the same as a loft conversion?","These packages are for loft storage. Creating a habitable room, such as a bedroom, involves a different scope and may require structural work, planning permission and Building Regulations approval. Tell us how you want to use the space so we can advise."],
  ["Are the calculator prices a fixed quote?","They are starting prices for the three storage packages, not a personalised quotation. Your loft’s size, access, condition and chosen specification affect the final price. Any applicable taxes and inclusions will be set out in the written quote after a survey."],
  ["What guarantees are available?","RJ offers a lifetime insulation guarantee and a separate five-year IWA insurance-backed warranty. These are different forms of cover. Ask the team for the applicable coverage and terms for your installation."],
  ["Do you work in my area?","RJ is based in Ipswich and carries out installations across the UK. Share your property’s postcode and the team can confirm current availability for your area and project."],
];
export function Questions(){return <Accordion type="single" collapsible className="faq-accordion">{faqs.map(([q,a],i)=><AccordionItem value={String(i)} key={q} className="faq-item"><AccordionTrigger className="faq-trigger">{q}</AccordionTrigger><AccordionContent className="faq-content">{a}</AccordionContent></AccordionItem>)}</Accordion>}
