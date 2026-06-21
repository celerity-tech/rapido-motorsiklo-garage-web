import type { Listing as ListingModel, ListingImage } from "@prisma/client"

import {
  FALLBACK_LISTING_IMAGE,
  type Listing,
  type ListingStatus,
  type ListingTransmission,
} from "@/lib/listing-utils"
import { prisma } from "@/lib/prisma"

export type { Listing, ListingStatus, ListingTransmission }

type ListingRecord = ListingModel & {
  images: ListingImage[]
}

function mapListing(listing: ListingRecord): Listing {
  const images = listing.images.map((image) => image.url)

  return {
    id: listing.id,
    title: listing.title,
    brand: listing.brand,
    year: listing.year,
    price: listing.price,
    mileageKm: listing.mileageKm,
    engineCc: listing.engineCc,
    transmission: listing.transmission as ListingTransmission,
    status: listing.status.toLowerCase() as ListingStatus,
    location: listing.location,
    highlights: listing.highlights,
    images,
    image: images[0] ?? FALLBACK_LISTING_IMAGE,
    postedAt: listing.postedAt.toISOString(),
    featured: listing.featured,
  }
}

export async function getListings(): Promise<Listing[]> {
  const listings = await prisma.listing.findMany({
    orderBy: [{ featured: "desc" }, { postedAt: "desc" }],
    include: {
      images: {
        orderBy: { position: "asc" },
      },
    },
  })

  return listings.map(mapListing)
}

export async function getListingById(id: string): Promise<Listing | null> {
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { position: "asc" },
      },
    },
  })

  return listing ? mapListing(listing) : null
}
