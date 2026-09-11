import { Archive, ArrowDown, ArrowUpRight, Check, House, Leaf, ShieldCheck, Wind } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { InsulationCalculator, BoardingCalculator, Questions } from "@/components/calculators";

const materials = [
  ["01", "Sheep’s wool", "Naturally breathable", "A natural choice to explore for older and traditionally built homes."],
  ["02", "SupaSoft", "A second life for plastic", "Soft recycled polyester insulation for a comfortable, well-insulated loft."],
  ["03", "SuperFOIL", "A considered use of space", "A multifoil system specified around your roof and the way you use your loft."],
  ["04", "Hemp", "Plant-based comfort", "A natural fibre alternative, selected to suit your home’s construction."],
];
export default function Home() {
  return <>
    <SiteHeader />
    <main id="main">
      <section className="hero shell" aria-labelledby="hero-heading">
        <div className="hero-copy">
          <p className="eyebrow"><span className="small-line" /> INSULATION. SPACE. PEACE OF MIND.</p>
          <h1 id="hero-heading">A better<br />feeling <em>at home.</em></h1>
          <p className="hero-intro">Sustainable loft insulation. Beautifully finished storage. Thoughtfully installed around you.</p>
          <a className="button button-dark" href="#insulation">Find my insulation <ArrowUpRight size={21} /></a>
          <a className="text-link hero-second" href="#loft-storage">Or explore your loft’s potential <ArrowUpRight size={18} /></a>
          <div className="hero-proof"><span className="star-row" aria-label="5 stars">★★★★★</span><span><strong>4.9/5</strong> on <a href="https://trustedtraders.which.co.uk/businesses/r-j-ipswich/" target="_blank" rel="noreferrer">Which? Trusted Traders<span className="sr-only"> (opens in a new tab)</span></a></span></div>
        </div>
        <div className="hero-visual">
          <picture><source media="(max-width: 640px)" srcSet="/images/loft-hero-800.webp" /><img src="/images/loft-hero-1400.webp" alt="An RJ loft storage project with a bright timber-lined ceiling, fitted cupboards and a wood-effect floor" width="1400" height="1050" fetchPriority="high" /></picture>
          <div className="photo-note"><span className="photo-dot" /> REAL HOMES. RJ CRAFTSMANSHIP.</div>
          <a href="#loft-storage" className="photo-caption"><span>Your loft.<br /><strong>More possibility.</strong></span><span className="circle-arrow"><ArrowUpRight aria-hidden="true" /></span></a>
        </div>
        <a className="hero-scroll" href="#difference"><ArrowDown size={16} /> GOOD THINGS START AT THE TOP</a>
      </section>
      <div className="trust-strip"><div className="shell trust-inner"><span><ShieldCheck /> Lifetime insulation guarantee<sup>*</sup></span><span><Leaf /> Thoughtfully chosen materials</span><span><Check /> Independent Which? reviews</span></div></div>
      <section id="difference" className="section shell introduction">
        <p className="eyebrow">SMALL CHANGES ABOVE. A BIG DIFFERENCE BELOW.</p>
        <div className="intro-grid"><h2>Good for your home.<br /><em>Considered for the future.</em></h2><div><p>No two homes are quite the same. From a characterful period property to a modern family house, we help you choose insulation that works with your home.</p><p>Then we take care of the details: the preparation, the ventilation and the careful installation. Or go a little further, with a beautifully finished loft storage room.</p></div></div>
        <div className="materials">{materials.map(([n,name,tag,body]) => <article className="material" key={name}><span className="material-number">{n}</span><h3>{name}</h3><p className="material-tag">{tag}</p><p>{body}</p></article>)}</div>
      </section>
      <section id="insulation" className="insulation-section section" aria-labelledby="insulation-heading">
        <div className="shell calculator-grid">
          <div className="calculator-intro">
            <p className="eyebrow">01 / FIND YOUR INSULATION</p>
            <h2 id="insulation-heading">Every home<br />has a history.<br /><em>Let’s start there.</em></h2>
            <p>Your home’s age gives us a useful starting point. Discover a material to discuss with our team in just a few clicks.</p>
          </div>
          <InsulationCalculator />
          <aside className="assessment-panel" aria-labelledby="assessment-heading">
            <h3 id="assessment-heading">We look at <em>the whole picture.</em></h3>
            <p>A survey brings these details together.</p>
            <ul className="assessment-list">
              <li><House size={22} strokeWidth={1.5} aria-hidden="true" /><span>Your roof and construction</span></li>
              <li><Wind size={22} strokeWidth={1.5} aria-hidden="true" /><span>Ventilation and existing insulation</span></li>
              <li><Archive size={22} strokeWidth={1.5} aria-hidden="true" /><span>How you use your loft</span></li>
            </ul>
          </aside>
        </div>
      </section>
      <section id="loft-storage" className="section shell storage-section" aria-labelledby="storage-heading">
        <div className="section-top"><div><p className="eyebrow">02 / MAKE ROOM FOR MORE</p><h2 id="storage-heading">A little imagination.<br /><em>A lot more space.</em></h2></div><p>A considered place for everything. Explore our insulated loft storage rooms, from practical boarding to a fully finished space with fitted cupboards.</p></div>
        <div className="storage-image"><img src="/images/loft-cumbria-1400.webp" alt="Completed RJ loft storage room in Cumbria with white walls, fitted storage and a warm wood-effect floor" width="1400" height="1050" loading="lazy" /><span className="image-label">A REAL RJ TRANSFORMATION / CUMBRIA</span><span className="image-headline">The space was<br />there <em>all along.</em></span></div>
        <BoardingCalculator />
      </section>
      <section className="testimonial-section"><div className="shell testimonial-inner"><div className="review-label"><span className="star-row" aria-label="5 stars">★★★★★</span><p>THE DIFFERENCE IS IN THE DETAILS.</p></div><figure><blockquote>“Whole process very professional from start to finish, took time to explain options and didn’t feel pressured into anything.”</blockquote><figcaption>Joanna Janus <span>— RJ Insulation customer</span></figcaption></figure></div></section>
      <section className="section shell process"><div className="section-top"><div><p className="eyebrow">GOOD PEOPLE. A CLEAR PROCESS.</p><h2>From first hello<br /><em>to a job well done.</em></h2></div><p>Clear advice, a properly considered specification and a team that treats your home with care.</p></div><div className="process-steps">{[
        ["01", "Let’s talk", "Tell us about your home and what you have in mind. We’ll help you explore the options."],
        ["02", "A closer look", "A survey checks the space, construction and ventilation before we confirm your specification and quote."],
        ["03", "Leave it with us", "Our team prepares the loft, installs your chosen solution and leaves the space ready for you."],
      ].map(([n,h,p])=><article key={n}><span>{n}</span><h3>{h}</h3><p>{p}</p></article>)}</div></section>
      <section className="faq-section section"><div className="shell faq-grid"><div><p className="eyebrow">A FEW THINGS YOU MIGHT BE WONDERING</p><h2>Good questions.<br /><em>Straight answers.</em></h2><p>Prefer a conversation?</p><a className="text-link" href="tel:08008044625">0800 804 4625 <ArrowUpRight size={20} /></a></div><Questions /></div></section>
      <section className="closing shell"><p className="eyebrow">YOUR HOME HAS MORE TO GIVE.</p><h2>Let’s bring out<br /><em>the best in it.</em></h2><div><a className="button button-dark" href="#insulation">Find my insulation <ArrowUpRight size={21} /></a><a className="button button-outline" href="#boarding-calculator">Plan my loft storage <ArrowUpRight size={21} /></a></div><p className="small-print">*Lifetime insulation guarantee and a separate five-year IWA insurance-backed warranty. Ask our team about coverage and terms.</p></section>
    </main>
    <SiteFooter />
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context":"https://schema.org","@type":"HomeAndConstructionBusiness",name:"RJ Insulation",url:"https://rjinsulation.co.uk/",telephone:"+448008044625",email:"info@rjinsulation.co.uk",address:{"@type":"PostalAddress",streetAddress:"Units 3 & 4, Handford Business Park, Handford Cut",addressLocality:"Ipswich",postalCode:"IP1 2HD",addressCountry:"GB"},description:"Sustainable loft insulation and finished loft storage rooms, including sheep’s wool, SupaSoft, SuperFOIL and hemp insulation.",sameAs:["https://trustedtraders.which.co.uk/businesses/r-j-ipswich/"]})}} />
  </>;
}
