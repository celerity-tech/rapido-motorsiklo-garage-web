import type { Metadata } from "next"

import { createListing } from "@/app/(admin)/admin/listings/actions"
import { ListingForm } from "@/components/admin/listing-form"

export const metadata: Metadata = {
  title: "New listing",
}

export default function NewListingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">New listing</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a motorcycle to the public marketplace.
        </p>
      </div>
      <ListingForm action={createListing} submitLabel="Create listing" />
    </div>
  )
}
