import { SITE, BASE } from "../../site.config";
import { QuoteForm } from "./quote-form";

type Pic = { base: string; alt: string };
const pic = (base: string, alt: string): Pic => ({ base, alt });

function Img({ p, className = "", priority = false, depth }: { p: Pic; className?: string; priority?: boolean; depth?: number }) {
  return (
    <img
      src={`${BASE}assets/${p.base}.webp`}
      srcSet={`${BASE}assets/${p.base}-sm.webp 700w, /assets/${p.base}.webp 1400w`}
      sizes="(min-width: 1024px) 40vw, 100vw"
      alt={p.alt}
      width={1400}
      height={933}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
      data-parallax={depth}
    />
  );
}

const SERVICES = [
  {
    title: "Roof replacement",
    body: "Full tear-off, fresh underlayment, new drip edge and flashing, finished in architectural shingle, tile or metal. Built to take 115° summers and monsoon downpours.",
    img: pic("shingles", "Newly installed charcoal architectural shingle roof on a Las Vegas home with mountains behind"),
  },
  {
    title: "Roof repair and leak diagnosis",
    body: "We trace the leak to its real source, whether that is missing drip edge, failed flashing or a cracked pipe boot, and fix the cause, not the stain.",
    img: pic("flashing", "Roofer installing metal step flashing around a dormer window"),
  },
  {
    title: "Metal roofing",
    body: "Standing-seam metal for homeowners who want decades of service, reflective performance in desert heat and a sharp modern profile.",
    img: pic("metal", "Copper-toned standing seam metal roof against desert hills"),
  },
  {
    title: "Gutters and drip edge",
    body: "Seamless gutters, downspouts and drip edge sized for flash-flood rain, so water leaves the roof instead of finding its way behind the fascia.",
    img: pic("gutters", "New seamless gutters and downspout on a stucco home in a Las Vegas suburb"),
  },
  {
    title: "Roof inspections",
    body: "Documented findings with photos for buyers, sellers and anyone who just had a storm roll through. You get a straight answer on what needs attention now and what can wait.",
    img: pic("inspection", "Roof inspector in a harness reviewing shingles on a tablet above a Las Vegas neighborhood"),
  },
  {
    title: "Insurance claim support",
    body: "Storm or wind damage? We document it properly and walk you through the claim process so the paperwork does not hold up your roof.",
    img: pic("replacement", "Crew laying underlayment on a roof deck during a replacement"),
  },
];

export function TrustBar() {
  const items = [
    ["Local", `Based at ${SITE.address.street}, ${SITE.address.city}`],
    ["Free", "On-site quotes, no obligation"],
    ["Direct", `One number: ${SITE.phoneDisplay}`],
  ];
  return (
    <section aria-label="At a glance" style={{ background: "var(--ink)", color: "var(--bone)" }}>
      <div className="wrap grid grid-cols-2 gap-x-6 gap-y-6 py-8 md:grid-cols-3 md:py-10" style={{ borderTop: "1px solid rgba(244,239,230,0.12)" }}>
        {items.map(([k, v]) => (
          <div key={k}>
            <div className="font-display text-3xl md:text-4xl">{k}</div>
            <div className="mt-1 text-sm text-[var(--bone-2)] opacity-80">{v}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="services" className="py-20 md:py-28">
      <div className="wrap">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow">Services</p>
            <h2 className="font-display mt-3 text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.98] text-balance">
              Every layer of the roof, done the way the desert demands.
            </h2>
          </div>
          <p className="text-lg leading-relaxed md:col-span-5" style={{ color: "var(--mute)" }}>
            From a single leak to a full replacement, the same crew handles your project from the first visit to the final debris haul.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <article
              key={s.title}
              className="group flex flex-col overflow-hidden rounded-2xl"
              style={{ background: "#fff", border: "1px solid var(--line)" }}
            >
              <div className="relative aspect-[3/2] overflow-hidden" style={{ background: "var(--bone-2)" }}>
                <Img p={s.img} priority={i < 2} depth={0.06} className="absolute inset-0 h-[112%] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-3xl leading-none">{s.title}</h3>
                <p className="mt-3 flex-1 text-[0.98rem] leading-relaxed" style={{ color: "var(--mute)" }}>{s.body}</p>
                <a href="#quote" className="btn-call mt-5 self-start text-sm">Quote this project</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Details() {
  const points = [
    ["Drip edge on every eave and rake", "The small metal piece most leaks trace back to. We install it as standard, never as an upsell."],
    ["Flashing rebuilt, not caulked over", "Chimneys, walls, dormers and pipe penetrations get new metal, not a bead of sealant that fails by next summer."],
    ["Underlayment rated for heat", "Synthetic underlayment that will not cook and crack under a Las Vegas attic."],
    ["Clean site, every day", "Magnet sweeps for nails, debris hauled, and your driveway the way we found it."],
  ];
  return (
    <section className="py-20 md:py-28" style={{ background: "var(--bone-2)" }}>
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="relative lg:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[3/2] lg:aspect-[4/5]" style={{ background: "var(--bone-3)" }}>
            <Img p={pic("flashing", "Close-up of new step flashing being installed on a roof")} depth={0.1} className="absolute inset-0 h-[115%] w-full object-cover" />
          </div>
          <div
            data-parallax="-0.05"
            className="absolute -bottom-6 right-4 rounded-2xl px-5 py-4 shadow-xl sm:right-8"
            style={{ background: "var(--ink)", color: "var(--bone)" }}
          >
            <div className="font-display text-3xl">The details decide</div>
            <div className="text-xs uppercase tracking-[0.2em] opacity-70">how long a roof lasts</div>
          </div>
        </div>
        <div className="lg:col-span-6 lg:pl-6">
          <p className="eyebrow">Why homeowners pick us</p>
          <h2 className="font-display mt-3 text-[clamp(2.4rem,5vw,4rem)] leading-[0.98] text-balance">
            Roofs fail at the edges. We obsess over the edges.
          </h2>
          <ul className="mt-10 grid gap-7">
            {points.map(([t, b], i) => (
              <li key={t} className="grid grid-cols-[2.5rem_1fr] gap-4">
                <span className="font-display text-3xl leading-none" style={{ color: "var(--red)" }}>0{i + 1}</span>
                <div>
                  <h3 className="text-lg font-bold">{t}</h3>
                  <p className="mt-1 leading-relaxed" style={{ color: "var(--mute)" }}>{b}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Process() {
  const steps = [
    ["Tell us what's going on", "Use the form or call. Share what you've noticed, when it started and what the roof is made of, if you know."],
    ["We get on the roof", "A real on-site look, not a driveway estimate. Photos of what we find, explained in plain language."],
    ["A clear written quote", "Scope, materials and price in writing. If insurance is involved, we help you line up the paperwork."],
    ["Build, clean, walk through", "The crew does the work, hauls the debris and walks the finished roof with you before we call it done."],
  ];
  return (
    <section id="process" className="py-20 md:py-28">
      <div className="wrap">
        <div className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="font-display mt-3 text-[clamp(2.4rem,5vw,4rem)] leading-[0.98]">Four steps from first call to finished roof.</h2>
        </div>
        <ol className="mt-14 grid gap-px overflow-hidden rounded-2xl md:grid-cols-4" style={{ background: "var(--line)" }}>
          {steps.map(([t, b], i) => (
            <li key={t} className="flex flex-col gap-4 p-7" style={{ background: "var(--bone)" }}>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold" style={{ background: "var(--ink)", color: "var(--bone)" }}>
                {i + 1}
              </span>
              <h3 className="font-display text-2xl leading-tight">{t}</h3>
              <p className="text-[0.95rem] leading-relaxed" style={{ color: "var(--mute)" }}>{b}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const REVIEWS = [
  {
    name: "K W Kent",
    when: "Google review",
    text: "We spent a lot of time researching before choosing a roofer for our roof replacement and gutter work. We picked this team because they went above standard requirements and had strong certifications, which gave us confidence in their roofing …",
  },
  {
    name: "Angelina H",
    when: "Google review",
    text: "We hired Canyon Underground for a roof replacement, and the service was unmatched. We had several roofing companies come by, but none of them compared. They walked us through the entire insurance claim process, explained how the old …",
  },
  {
    name: "K Rivera",
    when: "Google review",
    text: "We've hired this team for two home projects so far and are already getting ready for a third. The first job was solving leaks around our front windows, and it turned out the problem was tied to missing drip edge and flashing work that …",
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="py-20 md:py-28" style={{ background: "var(--ink)", color: "var(--bone)" }}>
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow" style={{ color: "var(--gold)" }}>Reviews</p>
            <h2 className="font-display mt-3 text-[clamp(2.4rem,5vw,4rem)] leading-[0.98]">
              What customers say on Google.
            </h2>
          </div>
          <a href={SITE.mapsSearchUrl} target="_blank" rel="noopener noreferrer" className="btn-call">
            Read every review on Google
          </a>
        </div>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <li key={r.name} className="flex flex-col rounded-2xl p-7" style={{ background: "var(--ink-2)", border: "1px solid rgba(244,239,230,0.1)" }}>
              <blockquote className="flex-1 text-[1.02rem] leading-relaxed text-[var(--bone-2)]">{r.text}</blockquote>
              <footer className="mt-5 text-sm">
                <span className="font-bold">{r.name}</span>
                <span className="opacity-60"> · {r.when}</span>
              </footer>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs opacity-60">Excerpts shown as they appear on the Google Business Profile.</p>
      </div>
    </section>
  );
}

export function AreaAndContact() {
  return (
    <section id="area" className="py-20 md:py-28" style={{ background: "var(--bone-2)" }}>
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">Service area</p>
          <h2 className="font-display mt-3 text-[clamp(2.4rem,5vw,4rem)] leading-[0.98]">Based in northeast Las Vegas. On roofs across the valley.</h2>
          <p className="mt-5 leading-relaxed" style={{ color: "var(--mute)" }}>
            Our shop is on Alto Avenue, minutes from the 15 and the 215. Call to confirm scheduling for your neighborhood.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Areas served">
            {SITE.serviceAreas.map((a) => (
              <li key={a} className="rounded-full px-4 py-2 text-sm font-semibold" style={{ background: "#fff", border: "1px solid var(--line)" }}>{a}</li>
            ))}
          </ul>
        </div>
        <div id="contact" className="lg:col-span-7">
          <div className="grid gap-px overflow-hidden rounded-2xl sm:grid-cols-2" style={{ background: "var(--line)" }}>
            <div className="p-7" style={{ background: "#fff" }}>
              <h3 className="eyebrow">Visit or mail</h3>
              <address className="mt-3 text-lg not-italic leading-relaxed">
                {SITE.name}<br />
                {SITE.address.street}<br />
                {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
              </address>
              <p className="mt-2 text-sm" style={{ color: "var(--mute)" }}>Plus code {SITE.plusCode}</p>
              <a href={SITE.mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="btn-call mt-4 text-sm">Get directions on Google Maps</a>
            </div>
            <div className="p-7" style={{ background: "#fff" }}>
              <h3 className="eyebrow">Call or text</h3>
              <a href={`tel:${SITE.phoneE164}`} className="font-display mt-3 block text-4xl leading-none hover:underline">{SITE.phoneDisplay}</a>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--mute)" }}>Call for current hours. Leave a message after hours and we return it the next business day.</p>
              <a href="#quote" className="btn-call mt-4 text-sm">Or request a quote online</a>
            </div>
            <div className="sm:col-span-2" style={{ background: "#fff" }}>
              <a href={SITE.mapsSearchUrl} target="_blank" rel="noopener noreferrer" className="group block p-7">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold">Canyon Underground on Google Maps</div>
                    <div className="text-sm" style={{ color: "var(--mute)" }}>Reviews, photos and directions in one place</div>
                  </div>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full transition-transform group-hover:translate-x-1" style={{ background: "var(--ink)", color: "var(--bone)" }} aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Quote() {
  return (
    <section id="quote" className="scroll-mt-20 py-20 md:py-28">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">Free quote</p>
          <h2 id="quote-heading" className="font-display mt-3 text-[clamp(2.4rem,5vw,4rem)] leading-[0.98]">Tell us about your roof. We'll take it from there.</h2>
          <p className="mt-5 leading-relaxed" style={{ color: "var(--mute)" }}>
            Takes about a minute. We'll follow up by phone, text or email, whichever you prefer, to set a time to look at the roof.
          </p>
          <div className="relative mt-10 hidden aspect-[4/3] overflow-hidden rounded-[2rem] lg:block" style={{ background: "var(--bone-2)" }}>
            <Img p={pic("inspection", "Roof inspector reviewing a Las Vegas home's shingles")} depth={0.08} className="absolute inset-0 h-[115%] w-full object-cover" />
          </div>
        </div>
        <div className="lg:col-span-7">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "var(--ink)", color: "var(--bone)" }}>
      <div className="wrap grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M10 30 24 14l14 16" fill="none" stroke="var(--red)" strokeWidth="4.5" strokeLinecap="square" />
              <path d="M8 34h32" stroke="var(--red)" strokeWidth="3" />
            </svg>
            <span className="font-display text-2xl">Canyon Underground</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed opacity-75">
            Roofing contractor serving Las Vegas, Nevada. Replacement, repair, metal roofing, gutters and inspections.
          </p>
        </div>
        <div className="md:col-span-3">
          <h3 className="eyebrow" style={{ color: "var(--gold)" }}>Contact</h3>
          <ul className="mt-3 grid gap-2 text-sm">
            <li><a href={`tel:${SITE.phoneE164}`} className="hover:underline">{SITE.phoneDisplay}</a></li>
            <li><a href={SITE.mapsDirectionsUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{SITE.address.street}, {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}</a></li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <h3 className="eyebrow" style={{ color: "var(--gold)" }}>On this page</h3>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
            {[["#services", "Services"], ["#process", "How it works"], ["#reviews", "Reviews"], ["#area", "Service area"], ["#contact", "Contact"], ["#quote", "Free quote"]].map(([h, l]) => (
              <li key={h}><a href={h} className="hover:underline">{l}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wrap flex flex-wrap items-center justify-between gap-3 py-6 text-xs opacity-60" style={{ borderTop: "1px solid rgba(244,239,230,0.12)" }}>
        <span>© {year} {SITE.legalName}. All rights reserved.</span>
        <a href="#top" className="hover:underline">Back to top</a>
      </div>
    </footer>
  );
}
