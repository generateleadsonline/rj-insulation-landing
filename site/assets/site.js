/* RJ Insulation landing page — behaviour
   No dependencies. Edit the CONFIG block to change tracking, pricing or recommendations. */
(function () {
  "use strict";

  var CONFIG = {
    // Google Tag Manager container. Leave empty to disable. Loaded after first interaction / page load so it never blocks rendering.
    gtmId: "GTM-PQV9P7T",
    // Hosts where forms really submit to Netlify Forms. Anywhere else (previews) the forms run in demo mode and still show the thank-you page.
    liveHosts: [/\.netlify\.app$/i, /rjinsulation\.co\.uk$/i, /generateleads/i],
    // Insulation finder: property age -> recommendation shown on the thank-you page.
    recommendations: {
      "Before 1920": {
        material: "Sheep’s wool",
        alt: "Hemp",
        teaser: "Homes like yours (built before 1920) usually suit a natural, breathable material.",
        why: "Older and period homes were built to breathe. Sheep’s wool manages moisture naturally, protecting the timbers in your roof while keeping the heat in. Prefer a plant-based option? Hemp offers the same benefits.",
        next: "On your free phone consultation we’ll check the roof construction, ventilation and any existing insulation, then confirm the material and depth for your home."
      },
      "1920s to 1960s": {
        material: "SuperFOIL multifoil",
        alt: "Sheep’s wool or SupaSoft, depending on the roof",
        teaser: "Homes like yours (1920s to 1960s) often suit a slim, reflective multifoil system.",
        why: "Interwar and post-war homes usually have cut roofs with good access to the rafters. A multifoil system fitted there keeps the whole loft warm in winter and cool in summer, and it takes up very little space.",
        next: "On your free phone consultation we’ll check whether to insulate at rafter or loft-floor level and confirm the right specification for your home."
      },
      "After the 1960s": {
        material: "SupaSoft recycled plastic",
        alt: "SuperFOIL, if you want a usable storage room",
        teaser: "Homes like yours (built after the 1960s) usually suit a soft, recycled insulation laid across the loft floor.",
        why: "Modern homes often have trussed roofs where floor-level insulation makes the most sense. SupaSoft is soft, itch-free and made from around 12,000 recycled bottles per loft, giving you excellent depth without the irritation of fibreglass.",
        next: "On your free phone consultation we’ll check your existing insulation, the depth available and ventilation, then confirm the right specification."
      },
      "Not sure": {
        material: "Let’s find your fit together",
        alt: "Sheep’s wool, hemp, SupaSoft or SuperFOIL",
        teaser: "No problem at all. Our team will identify your home’s construction and recommend from all four materials.",
        why: "You don’t need to know the exact year your home was built. A few simple questions about the roof, the loft and how you use it usually tell us everything we need.",
        next: "On your free phone consultation we’ll work out your home’s construction with you and recommend the best material, with an indicative cost."
      }
    },
    // Storage room planner packages. Prices are guide starting prices set by RJ.
    packages: {
      1: { name: "Insulation & boarding", price: 10000, includes: ["SuperFOIL multifoil insulation", "Boarding on a fitted subframe", "Fitted loft ladder and hatch"] },
      2: { name: "Plasterboard & vinyl floor", price: 20000, includes: ["Everything in Option 1", "Internal plasterboard", "Luxury vinyl flooring"] },
      3: { name: "Premium bespoke finish", price: 35000, includes: ["Everything in Option 2", "Handmade fitted cupboards", "VELUX roof windows", "Electrics and lighting", "Final decoration"] }
    },
    allFeatures: ["Internal plasterboard", "Luxury vinyl flooring", "Handmade fitted cupboards", "VELUX roof windows", "Electrics and lighting", "Final decoration"]
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var money = function (n) { return "£" + n.toLocaleString("en-GB"); };
  window.dataLayer = window.dataLayer || [];
  var track = function (event, data) { var o = { event: event }; if (data) for (var k in data) o[k] = data[k]; window.dataLayer.push(o); };
  var isLive = CONFIG.liveHosts.some(function (re) { return re.test(location.hostname); });

  /* ---------- Tag Manager (deferred) ---------- */
  function loadGTM() {
    if (!CONFIG.gtmId || window.__rjGtm) return;
    window.__rjGtm = true;
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(CONFIG.gtmId);
    document.head.appendChild(s);
  }
  if (CONFIG.gtmId) {
    var kick = function () { loadGTM(); ["pointerdown", "keydown", "touchstart", "scroll"].forEach(function (e) { window.removeEventListener(e, kick); }); };
    ["pointerdown", "keydown", "touchstart", "scroll"].forEach(function (e) { window.addEventListener(e, kick, { passive: true, once: true }); });
    window.addEventListener("load", function () { setTimeout(loadGTM, 2500); });
  }

  /* ---------- Campaign parameters ---------- */
  var params = new URLSearchParams(location.search);
  var campaign = {};
  ["gclid", "utm_source", "utm_medium", "utm_campaign", "utm_term"].forEach(function (k) {
    var v = params.get(k);
    try { if (v) sessionStorage.setItem("rj_" + k, v); else v = sessionStorage.getItem("rj_" + k); } catch (e) {}
    campaign[k] = v || "";
  });
  $$("form").forEach(function (f) {
    Object.keys(campaign).forEach(function (k) { var i = f.elements[k]; if (i) i.value = campaign[k]; });
    var lp = f.elements.landing_page; if (lp) lp.value = location.origin + location.pathname;
  });

  /* ---------- Header, reveal, sticky CTA ---------- */
  var header = $(".site-header");
  var sticky = $("#sticky-cta");
  var onScroll = function () {
    var y = window.scrollY || 0;
    if (header) header.classList.toggle("is-stuck", y > 8);
    if (sticky) sticky.classList.toggle("show", y > 520 && !document.body.classList.contains("form-focused"));
  };
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  document.addEventListener("focusin", function (e) { if (e.target.closest && e.target.closest("form")) { document.body.classList.add("form-focused"); onScroll(); } });
  document.addEventListener("focusout", function () { setTimeout(function () { if (!document.activeElement || !document.activeElement.closest("form")) { document.body.classList.remove("form-focused"); onScroll(); } }, 50); });

  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
    // Safety net: anything already scrolled past (fast scrolls, anchor jumps) is shown immediately.
    var sweep = function () { reveals.forEach(function (el) { if (!el.classList.contains("in") && el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in"); }); };
    window.addEventListener("scroll", sweep, { passive: true });
    window.addEventListener("hashchange", function () { setTimeout(sweep, 50); });
  } else { reveals.forEach(function (el) { el.classList.add("in"); }); }

  $$("[data-track]").forEach(function (el) { el.addEventListener("click", function () { track(el.getAttribute("data-track"), { link_url: el.getAttribute("href") }); }); });
  /* FAQ accordion: opening one answer closes the others in the same section */
  $$(".faq details").forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (!d.open) return;
      var scope = d.closest(".faq") || document;
      $$("details", scope).forEach(function (o) { if (o !== d && o.open) o.open = false; });
    });
  });
  var yr = $("[data-year]"); if (yr) yr.textContent = String(new Date().getFullYear());
  var toggle = $(".nav-toggle"), nav = $("#site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () { var open = nav.classList.toggle("open"); toggle.setAttribute("aria-expanded", String(open)); });
    nav.addEventListener("click", function (e) { if (e.target.tagName === "A") { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); } });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); toggle.focus(); } });
  }

  /* ---------- Shared calculator helpers ---------- */
  function setStep(card, step, label) {
    $$("[data-panel]", card).forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== String(step); });
    $$(".progress span", card).forEach(function (s, i) { s.classList.toggle("on", i < step); });
    var l = $("[data-step-label]", card); if (l && label) l.textContent = label;
    if (step === 2) { var f = $("[data-focus]", card); if (f) f.focus({ preventScroll: true }); }
    var top = card.getBoundingClientRect().top + window.scrollY - 96;
    if (Math.abs(window.scrollY - top) > 40) window.scrollTo({ top: top, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  function validate(form) {
    var errors = {};
    var v = function (n) { return (form.elements[n] && form.elements[n].value || "").trim(); };
    if (v("name").length < 2) errors.name = "Please enter your full name.";
    if (!/^[+\d()\s-]{9,25}$/.test(v("phone"))) errors.phone = "Please enter a phone number we can call you on.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v("email"))) errors.email = "Please enter a valid email address.";
    if (!/^(GIR\s?0AA|[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2})$/i.test(v("postcode"))) errors.postcode = "Please enter a valid UK postcode.";
    ["name", "phone", "email", "postcode"].forEach(function (n) {
      var input = form.elements[n]; if (!input) return;
      var field = input.closest(".field");
      var err = field.querySelector(".field-error");
      if (errors[n]) {
        if (!err) { err = document.createElement("p"); err.className = "field-error"; err.id = input.id + "-error"; field.appendChild(err); }
        err.textContent = errors[n]; input.setAttribute("aria-invalid", "true"); input.setAttribute("aria-describedby", err.id);
      } else { if (err) err.remove(); input.removeAttribute("aria-invalid"); input.removeAttribute("aria-describedby"); }
    });
    return errors;
  }

  function wireForm(form, buildSummary) {
    var alert = $(".form-alert", form);
    var button = $("button[type=submit]", form);
    var busy = false;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return;
      if ((form.elements.company && form.elements.company.value) || false) return; // honeypot
      var errors = validate(form);
      if (Object.keys(errors).length) {
        alert.hidden = false; alert.textContent = "Please check the highlighted details below.";
        var first = form.querySelector("[aria-invalid=true]"); if (first) first.focus();
        return;
      }
      alert.hidden = true;
      var summary = buildSummary(form);
      busy = true; button.disabled = true;
      var label = button.innerHTML; button.textContent = "Sending…";
      var body = new URLSearchParams(new FormData(form)).toString();
      var finish = function () {
        try { sessionStorage.setItem("rj_enquiry", JSON.stringify(summary)); } catch (err) {}
        track("generate_lead", { form_name: form.getAttribute("name"), service: summary.service, package_option: summary.option || "", property_age: summary.age || "" });
        location.assign(form.getAttribute("action"));
      };
      var fail = function () {
        busy = false; button.disabled = false; button.innerHTML = label;
        alert.hidden = false; alert.textContent = "We couldn’t send your details just now. Please try again, or call us free on 0800 804 4625.";
      };
      if (!isLive) { setTimeout(finish, 500); return; } // preview / demo mode
      var ctrl = "AbortController" in window ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 20000);
      fetch(location.pathname, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body, signal: ctrl ? ctrl.signal : undefined })
        .then(function (r) { clearTimeout(timer); if (r.ok) finish(); else fail(); })
        .catch(function () { clearTimeout(timer); fail(); });
    });
  }

  /* ---------- Insulation finder ---------- */
  var insCard = $("#ins-calc");
  if (insCard) {
    var insForm = $("form", insCard);
    var ageError = $("#ins-age-error", insCard);
    var chosen = function () { var r = insCard.querySelector("input[name=property_age]:checked"); return r ? r.value : ""; };
    $$("input[name=property_age]", insCard).forEach(function (r) { r.addEventListener("change", function () { ageError.hidden = true; }); });
    $("[data-next]", insCard).addEventListener("click", function () {
      var age = chosen();
      if (!age) { ageError.hidden = false; return; }
      var rec = CONFIG.recommendations[age];
      $("[data-teaser]", insCard).textContent = rec.teaser;
      insForm.elements.property_age.value = age;
      insForm.elements.recommendation.value = rec.material;
      setStep(insCard, 2, "Step 2 of 2 · Your details");
      track("calculator_step", { calculator: "insulation", step: 2, property_age: age });
    });
    $("[data-back]", insCard).addEventListener("click", function () { setStep(insCard, 1, "Step 1 of 2 · About your home"); });
    wireForm(insForm, function (form) {
      var age = form.elements.property_age.value; var rec = CONFIG.recommendations[age] || {};
      return { kind: "insulation", service: "Loft insulation", age: age, material: rec.material, alt: rec.alt, why: rec.why, next: rec.next, name: form.elements.name.value.trim().split(" ")[0] };
    });
  }

  /* ---------- Storage room planner ---------- */
  var storCard = $("#stor-calc");
  if (storCard) {
    var storForm = $("form", storCard);
    var boxes = $$("input[name=features]", storCard);
    var current = function () {
      var selected = boxes.filter(function (b) { return b.checked; });
      var level = selected.reduce(function (m, b) { return Math.max(m, Number(b.getAttribute("data-level"))); }, 1);
      return { option: level, selected: selected.map(function (b) { return b.value; }), pkg: CONFIG.packages[level] };
    };
    var render = function () {
      var c = current();
      $("[data-r-eyebrow]", storCard).textContent = "Your match · Option " + c.option;
      $("[data-r-name]", storCard).textContent = c.pkg.name;
      $("[data-r-price]", storCard).textContent = money(c.pkg.price);
      var list = $("[data-r-list]", storCard); list.innerHTML = "";
      var base = ["SuperFOIL multifoil insulation", "Boarding on a fitted subframe", "Fitted loft ladder and hatch"];
      var included = base.concat(c.option >= 2 ? ["Internal plasterboard", "Luxury vinyl flooring"] : [], c.option === 3 ? ["Handmade fitted cupboards", "VELUX roof windows", "Electrics and lighting", "Final decoration"] : []);
      included.forEach(function (item) {
        var li = document.createElement("li");
        li.innerHTML = '<svg aria-hidden="true"><use href="#i-check"/></svg>' + item;
        list.appendChild(li);
      });
      $("[data-summary]", storCard).textContent = "Option " + c.option + " · " + c.pkg.name + " · from " + money(c.pkg.price) + ".";
      storForm.elements.features.value = c.selected.join(", ") || "None selected (insulation & boarding only)";
      storForm.elements.package_option.value = "Option " + c.option;
      storForm.elements.package_name.value = c.pkg.name;
      storForm.elements.package_price.value = "From " + money(c.pkg.price);
    };
    boxes.forEach(function (b) { b.addEventListener("change", function () { render(); track("calculator_change", { calculator: "storage", option: current().option }); }); });
    render();
    $("[data-next]", storCard).addEventListener("click", function () { setStep(storCard, 2, "Step 2 of 2 · Your details"); track("calculator_step", { calculator: "storage", step: 2, option: current().option }); });
    $("[data-back]", storCard).addEventListener("click", function () { setStep(storCard, 1, "Your loft wish list"); });
    wireForm(storForm, function (form) {
      var c = current();
      return { kind: "storage", service: "Loft storage room", option: c.option, packageName: c.pkg.name, price: money(c.pkg.price), includes: c.pkg.includes, selected: c.selected, name: form.elements.name.value.trim().split(" ")[0] };
    });
  }

  /* ---------- Thank-you pages ---------- */
  var thanks = $("[data-thank-you]");
  if (thanks) {
    var data = null;
    try { data = JSON.parse(sessionStorage.getItem("rj_enquiry") || "null"); } catch (e) {}
    var kind = thanks.getAttribute("data-thank-you");
    if (data && data.kind === kind) {
      thanks.classList.add("has-data");
      $$("[data-fill]", thanks).forEach(function (el) {
        var key = el.getAttribute("data-fill"); var val = data[key];
        if (Array.isArray(val)) { el.innerHTML = ""; val.forEach(function (x) { var li = document.createElement("li"); li.innerHTML = '<svg aria-hidden="true"><use href="#i-check"/></svg>' + x; el.appendChild(li); }); }
        else if (val) el.textContent = val;
      });
      $$("[data-if-data]", thanks).forEach(function (el) { el.hidden = false; });
      $$("[data-if-empty]", thanks).forEach(function (el) { el.hidden = true; });
      if (!sessionStorage.getItem("rj_conv_" + kind)) {
        track("conversion_thank_you", { form_name: kind === "insulation" ? "insulation-enquiry" : "storage-room-enquiry", service: data.service, package_option: data.option || "", property_age: data.age || "" });
        try { sessionStorage.setItem("rj_conv_" + kind, "1"); } catch (e) {}
      }
    } else {
      $$("[data-if-data]", thanks).forEach(function (el) { el.hidden = true; });
      $$("[data-if-empty]", thanks).forEach(function (el) { el.hidden = false; });
    }
  }
})();
