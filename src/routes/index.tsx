import { createFileRoute } from "@tanstack/react-router";

import { StructuredData } from "../components/StructuredData";
import { Hero, Nav } from "../components/site/hero";
import { useParallax } from "../components/site/motion";
import { AreaAndContact, Details, Footer, Process, Quote, Reviews, Services, TrustBar } from "../components/site/sections";
import { SITE, BASE } from "../site.config";

const TITLE = "Canyon Underground | Roofing Contractor in Las Vegas, NV";
const DESCRIPTION =
  "Roof replacement, roof repair, metal roofing and gutters for Las Vegas homes. Call (725) 302-8700 or request a free quote.";

// Only facts present on the business's Google listing are included here.
const LOCAL_BUSINESS_JSON = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "RoofingContractor",
  name: SITE.name,
  url: SITE.siteUrl,
  telephone: SITE.phoneE164,
  image: `${SITE.siteUrl}/assets/og.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
  areaServed: SITE.serviceAreas.map((name) => ({ "@type": "City", name })),
  hasMap: SITE.mapsSearchUrl,
  potentialAction: { "@type": "QuoteAction", target: `${SITE.siteUrl}/#quote` },
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE.siteUrl}/` },
      { property: "og:image", content: `${SITE.siteUrl}/assets/og.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "800" },
      { property: "og:image:alt", content: "Canyon Underground, roofing contractor in Las Vegas" },
      { name: "twitter:image", content: `${SITE.siteUrl}/assets/og.jpg` },
      { name: "geo.region", content: "US-NV" },
      { name: "geo.placename", content: "Las Vegas" },
    ],
    links: [
      { rel: "canonical", href: `${SITE.siteUrl}/` },
      { rel: "preload", as: "image", href: `${BASE}assets/hero-poster.jpg`, fetchPriority: "high" },
    ],
  }),
  component: Index,
});

function Index() {
  useParallax();
  return (
    <>
      <StructuredData json={LOCAL_BUSINESS_JSON} />
      <Nav />
      <main id="main">
        <Hero />
        <TrustBar />
        <Services />
        <Details />
        <Process />
        <Reviews />
        <AreaAndContact />
        <Quote />
      </main>
      <Footer />
    </>
  );
}
