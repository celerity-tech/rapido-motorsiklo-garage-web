import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { updateListing } from "@/app/(admin)/admin/listings/actions"
import {
  ListingForm,
  type AdminListingFormValue,
} from "@/components/admin/listing-form"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Edit listing",
}

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { position: "asc" },
      },
    },
  })

  if (!listing) {
    notFound()
  }

  const formValue: AdminListingFormValue = {
    title: listing.title,
    brand: listing.brand,
    year: listing.year,
    price: listing.price,
    mileageKm: listing.mileageKm,
    engineCc: listing.engineCc,
    transmission: listing.transmission as AdminListingFormValue["transmission"],
    status: listing.status,
    location: listing.location,
    highlights: listing.highlights,
    featured: listing.featured,
    postedAt: listing.postedAt.toISOString().slice(0, 10),
    images: listing.images.map((image) => ({
      id: image.id,
      url: image.url,
      position: image.position,
    })),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Edit listing</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update details, status, gallery order, and marketplace visibility.
        </p>
      </div>
      <ListingForm
        action={updateListing.bind(null, id)}
        listing={formValue}
        submitLabel="Save changes"
      />
    </div>
  )
}
