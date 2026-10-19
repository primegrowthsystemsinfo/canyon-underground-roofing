// PUBLIC business facts for this client. Safe to ship to the browser.
// Change these per client; nothing here is a secret.
export const SITE = {
  // Canonical production origin (no trailing slash). Update if a custom domain is attached.
  siteUrl: "https://primegrowthsystemsinfo.github.io/canyon-underground-roofing",
  // Where quote requests are emailed. PUBLIC (it ships in the page code); change per client.
  ownerEmail: "gisa37730@gmail.com",
  // Optional, faster delivery: a free Web3Forms access key (web3forms.com, enter the owner email).
  // When set, quote requests go through Web3Forms instead of FormSubmit. The key is public by design.
  web3formsKey: "19f6e3cc-78fa-4b17-aba3-7bdcc3fdd55d",
  name: "Canyon Underground",
  legalName: "Canyon Underground",
  tagline: "Roofing Contractor · Las Vegas, NV",
  phoneDisplay: "(725) 302-8700",
  phoneE164: "+17253028700",
  address: {
    street: "3989 Alto Ave",
    city: "Las Vegas",
    region: "NV",
    postalCode: "89115",
    country: "US",
  },
  plusCode: "6W57+X3 Las Vegas, Nevada",
  mapsSearchUrl:
    "https://www.google.com/maps/search/?api=1&query=Canyon+Underground+3989+Alto+Ave+Las+Vegas+NV+89115",
  mapsDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=3989+Alto+Ave%2C+Las+Vegas%2C+NV+89115",
  // Neighborhoods / cities listed on the service-area section.
  serviceAreas: [
    "Las Vegas",
    "North Las Vegas",
    "Sunrise Manor",
    "Henderson",
    "Summerlin",
    "Spring Valley",
    "Paradise",
    "Boulder City",
  ],
} as const;

/** Deployment base path ("/" at a domain root, "/repo/" on GitHub project pages). */
export const BASE: string = import.meta.env.BASE_URL;
