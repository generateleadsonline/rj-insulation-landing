export const ageOptions = [
  {value:"pre1920",label:"Before 1920",detail:"Period & traditional homes"},
  {value:"1920to1965",label:"1920–1965",detail:"Early & mid-century homes"},
  {value:"1966onwards",label:"1966 onwards",detail:"Later & modern homes"},
  {value:"unknown",label:"I’m not sure",detail:"We can help you find out"},
] as const;
export type Age = typeof ageOptions[number]["value"];
export const requirements = [
  {id:"plasterboard",label:"Internal plasterboard",option:2},
  {id:"vinyl",label:"Luxury vinyl flooring",option:2},
  {id:"cupboards",label:"Handmade fitted cupboards",option:3},
  {id:"windows",label:"VELUX roof windows",option:3},
  {id:"electrics",label:"Electrics",option:3},
  {id:"decoration",label:"Final decoration",option:3},
] as const;
export type Requirement = typeof requirements[number]["id"];
export function isAge(value:unknown):value is Age {return ageOptions.some(x=>x.value===value)}
export function isRequirements(value:unknown):value is Requirement[]{return Array.isArray(value)&&value.length<=6&&value.every(x=>requirements.some(r=>r.id===x))&&new Set(value).size===value.length}
export function recommendInsulation(age:Age) {
  const results = {
    pre1920:{name:"Sheep’s wool",description:"A breathable natural material is a useful starting point for a traditionally built home. Sheep’s wool is worth discussing alongside your roof’s moisture and ventilation needs.",alternative:"Prefer a plant-based fibre? Hemp may also be suitable, subject to a survey."},
    "1920to1965":{name:"SuperFOIL",description:"A multifoil system may suit your roof and the space you want to create. Its suitability depends on the roof build-up, ventilation and whether you are insulating at roof or loft-floor level.",alternative:"Other materials may be a better fit. We’ll check the construction before specifying a system."},
    "1966onwards":{name:"SupaSoft",description:"Recycled polyester insulation is a useful starting point for a later-built home. We’ll check the existing insulation, available depth and ventilation to design the right loft-floor specification.",alternative:"The age of your home alone doesn’t determine the material. A survey confirms the best option."},
    unknown:{name:"Let’s find your fit",description:"You don’t need to know the exact year. Our team can help identify your property’s construction and discuss sheep’s wool, SupaSoft, SuperFOIL or hemp.",alternative:"Tell us what you know about the property. We’ll take it from there."}
  };
  return {...results[age],age,ageLabel:ageOptions.find(x=>x.value===age)!.label};
}
export function recommendBoarding(selected:Requirement[]) {
  const option = selected.some(id=>requirements.find(r=>r.id===id)!.option===3)?3:selected.length?2:1;
  const names = ["","The practical foundation","The finished space","The complete transformation"];
  const prices = [0,10000,20000,35000];
  const included = ["SuperFOIL insulation","Loft boarding"];
  if(option>=2)included.push("Internal plasterboard","Luxury vinyl flooring");
  if(option===3)included.push("Handmade fitted cupboards","VELUX roof windows","Electrics","Final decoration");
  return {option,name:names[option],price:prices[option],included,selected};
}
export const money=(n:number)=>new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP",maximumFractionDigits:0}).format(n);
