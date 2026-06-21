import { faqs } from "@/lib/faq-data"
import type { Listing, ListingStatus } from "@/lib/listing-utils"
import { siteConfig, siteUrl } from "@/lib/site"

/** Join a root-relative path onto the canonical origin (passes through absolute URLs). */
export const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`

/** Stable absolute URL for the site-wide branded social/share image. */
export const ogImageUrl = `${siteUrl}/opengraph-image`

/** True for hostable raster photos (real Cloudinary uploads), false for the local SVG placeholders. */
const isRasterUrl = (url: string) => url.startsWith("http") && !url.endsWith(".svg")

/**
 * Real listing photos when present, otherwise the stable branded site image.
 * (The per-listing generated card is still used as the og:image for social
 * sharing via the file convention, but its URL is hashed/internal, so JSON-LD —
 * which needs a durable, resolvable URL — falls back to the root OG image.)
 */
const listingImageUrls = (listing: Listing): string[] => {
  const photos = listing.images.filter(isRasterUrl)
  return photos.length > 0 ? photos : [ogImageUrl]
}

const availabilityFor: Record<ListingStatus, string> = {
  available: "https://schema.org/InStock",
  reserved: "https://schema.org/LimitedAvailability",
  sold: "https://schema.org/SoldOut",
}

const ID_BUSINESS = `${siteUrl}/#business`
const ID_WEBSITE = `${siteUrl}/#website`

/**
 * The shop itself — the anchor entity for local SEO. AutoRepair is a
 * LocalBusiness subtype, so this powers Google Business / map-pack signals
 * (name, address, hours, area served). Phone/email are intentionally omitted
 * until real values replace the placeholders in `siteConfig`.
 */
export const localBusinessJsonLd = (): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  "@id": ID_BUSINESS,
  name: siteConfig.name,
  url: siteUrl,
  image: ogImageUrl,
  logo: ogImageUrl,
  description: siteConfig.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: "57 St. Dominic Subd. San Roque Arbol",
    addressLocality: "Lubao",
    addressRegion: "Pampanga",
    postalCode: siteConfig.location.postal,
    addressCountry: "PH",
  },
  areaServed: [
    { "@type": "City", name: "Lubao" },
    { "@type": "AdministrativeArea", name: "Pampanga" },
  ],
  hasMap: siteConfig.contact.maps,
  priceRange: "₱₱",
  currenciesAccepted: "PHP",
  sameAs: [siteConfig.contact.facebook],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  ],
})

/** The website entity, linked to the business as publisher. */
export const websiteJsonLd = (): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": ID_WEBSITE,
  name: siteConfig.name,
  url: siteUrl,
  inLanguage: "en-PH",
  publisher: { "@id": ID_BUSINESS },
})

/** Breadcrumb trail for a page. Pass crumbs from home → current, in order. */
export const breadcrumbJsonLd = (
  crumbs: { name: string; path: string }[]
): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: absoluteUrl(crumb.path),
  })),
})

/** FAQPage from the shared FAQ data (must mirror the visible accordion). */
export const faqJsonLd = (): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
})

/**
 * A single used motorcycle as a Vehicle (a Product subtype) with an Offer, so
 * it's eligible for product/price rich results and vehicle-listing features.
 */
export const vehicleJsonLd = (listing: Listing): Record<string, unknown> => {
  const url = absoluteUrl(`/marketplace/${listing.id}`)

  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${listing.year} ${listing.title}`,
    description: `${listing.year} ${listing.title} for sale at ${siteConfig.name} in ${listing.location}.`,
    brand: { "@type": "Brand", name: listing.brand },
    image: listingImageUrls(listing),
    url,
    vehicleModelDate: String(listing.year),
    vehicleTransmission: listing.transmission,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: listing.mileageKm,
      unitCode: "KMT",
    },
    vehicleEngine: {
      "@type": "EngineSpecification",
      engineDisplacement: {
        "@type": "QuantitativeValue",
        value: listing.engineCc,
        unitCode: "CMQ",
      },
    },
    itemCondition: "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      price: String(listing.price),
      priceCurrency: "PHP",
      availability: availabilityFor[listing.status],
      itemCondition: "https://schema.org/UsedCondition",
      url,
      seller: { "@id": ID_BUSINESS },
    },
  }
}

/** ItemList of listings for the marketplace index — strengthens crawl/discovery. */
export const listingsItemListJsonLd = (
  listings: Listing[]
): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: listings.map((listing, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: absoluteUrl(`/marketplace/${listing.id}`),
    name: `${listing.year} ${listing.title}`,
  })),
})
