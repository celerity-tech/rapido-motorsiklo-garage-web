/**
 * Canonical production origin. Drives metadataBase, canonicals, the sitemap,
 * robots, JSON-LD, and absolute social-preview URLs. Override per environment
 * with `NEXT_PUBLIC_SITE_URL`; defaults to the live custom domain. Trailing
 * slash is stripped so callers can safely append paths.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rapidomotorsiklo.com"
).replace(/\/$/, "")

export const siteConfig = {
  name: "Rapido Motorsiklo Garage",
  shortName: "Rapido",
  url: siteUrl,
  tagline: "Quick. Honest. Reliable.",
  description:
    "Motorcycle parts, services, and repair for daily riders in Lubao, Pampanga.",
  location: {
    // Privacy: only the town/province is shown anywhere the address appears as
    // text. The exact street address is intentionally never rendered.
    display: "Lubao, Pampanga",
    city: "Lubao",
    region: "Pampanga",
    postal: "2005",
    // Exact address used ONLY to anchor the embedded map pin — never shown as text.
    mapQuery:
      "57 St. Dominic Subd. San Roque Arbol Lubao Pampanga, Lubao, Philippines, 2005",
  },
  contact: {
    facebook: "https://www.facebook.com/profile.php?id=61579675523106",
    facebookMessage: "https://www.facebook.com/profile.php?id=61579675523106",
    // Bracketed placeholders show until real values arrive; the UI renders them
    // as plain text and auto-links them (tel:/mailto:) once they're real.
    phone: "[Phone Number]",
    email: "[Email]",
    hours: "Always Open",
    maps: "https://maps.app.goo.gl/CYiRDXfEQDTpUFva6",
  },
} as const

/**
 * Google Maps embed URL (no API key required). Built from the exact `mapQuery`
 * so the live map still pins the shop precisely, even though the address is
 * never shown as text.
 */
export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  siteConfig.location.mapQuery
)}&output=embed`
