import type { MetadataRoute } from "next"

import { getListings } from "@/lib/listings"
import { siteUrl } from "@/lib/site"

// Listing data is request-time (DB-backed), so the sitemap regenerates instead
// of being frozen at build.
export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${siteUrl}/marketplace`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]

  let listingRoutes: MetadataRoute.Sitemap = []

  try {
    const listings = await getListings()
    listingRoutes = listings.map((listing) => {
      const photos = listing.images.filter(
        (url) => url.startsWith("http") && !url.endsWith(".svg")
      )

      return {
        url: `${siteUrl}/marketplace/${listing.id}`,
        lastModified: new Date(listing.postedAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
        ...(photos.length > 0 ? { images: photos } : {}),
      }
    })
  } catch {
    // If the database is unreachable (e.g. at build time) still ship a valid
    // sitemap with the static routes rather than failing the whole route.
    listingRoutes = []
  }

  return [...staticRoutes, ...listingRoutes]
}
