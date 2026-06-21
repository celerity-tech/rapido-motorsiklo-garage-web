import { ListingStatus } from "@prisma/client"
import {
  IconEdit,
  IconMotorbike,
  IconPhoto,
  IconPlus,
  IconStarFilled,
} from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"

import { DeleteListingDialog } from "@/components/admin/delete-listing-dialog"
import { StatusBadge } from "@/components/admin/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/listing-utils"
import { prisma } from "@/lib/prisma"
import { setListingStatus } from "@/app/(admin)/admin/listings/actions"

const statuses = [
  ListingStatus.AVAILABLE,
  ListingStatus.RESERVED,
  ListingStatus.SOLD,
]

export default async function AdminDashboardPage() {
  const listings = await prisma.listing.findMany({
    orderBy: [{ featured: "desc" }, { postedAt: "desc" }],
    include: {
      images: {
        orderBy: { position: "asc" },
      },
    },
  })

  const availableCount = listings.filter(
    (listing) => listing.status !== ListingStatus.SOLD
  ).length
  const featuredCount = listings.filter((listing) => listing.featured).length

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="accent" className="mb-3">
            <IconMotorbike />
            Marketplace
          </Badge>
          <h1 className="text-3xl font-black tracking-tight">
            Listing control
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create, update, reserve, sell, and delete motorcycles shown on the
            public marketplace.
          </p>
        </div>
        <Button render={<Link href="/admin/listings/new" />} nativeButton={false}>
          <IconPlus />
          New listing
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total listings" value={listings.length} />
        <StatCard label="Available or reserved" value={availableCount} />
        <StatCard label="Featured" value={featuredCount} />
      </div>

      <section className="overflow-hidden rounded-md border border-border/70 bg-card/50">
        {listings.length === 0 ? (
          <div className="grid place-items-center gap-3 px-6 py-16 text-center">
            <span className="grid size-12 place-items-center rounded-sm border border-border/70 bg-background/60 text-muted-foreground">
              <IconPhoto className="size-6" aria-hidden />
            </span>
            <div>
              <p className="font-semibold">No listings yet.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add the first motorcycle to populate the marketplace.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border/70">
            {listings.map((listing) => {
              const primaryImage =
                listing.images[0]?.url ?? "/listings/yamaha-sniper-155.svg"

              return (
                <article
                  key={listing.id}
                  className="grid gap-4 p-4 lg:grid-cols-[96px_1fr_auto]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-border/70 bg-background/60 lg:aspect-square">
                    <Image
                      src={primaryImage}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={listing.status} />
                      {listing.featured && (
                        <span className="inline-flex items-center gap-1 rounded-sm border border-accent/30 bg-accent/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
                          <IconStarFilled className="size-3" aria-hidden />
                          Featured
                        </span>
                      )}
                    </div>
                    <div>
                      <h2 className="truncate text-lg font-semibold tracking-tight">
                        {listing.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {listing.brand} - {listing.year} -{" "}
                        {formatPrice(listing.price)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {statuses.map((status) => (
                        <form
                          key={status}
                          action={setListingStatus.bind(null, listing.id, status)}
                        >
                          <Button
                            type="submit"
                            variant={
                              listing.status === status ? "secondary" : "outline"
                            }
                            size="xs"
                            disabled={listing.status === status}
                          >
                            {status.toLowerCase()}
                          </Button>
                        </form>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-start gap-2 lg:justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      render={
                        <Link href={`/admin/listings/${listing.id}/edit`} />
                      }
                      nativeButton={false}
                    >
                      <IconEdit />
                      Edit
                    </Button>
                    <DeleteListingDialog
                      listingId={listing.id}
                      title={listing.title}
                    />
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border/70 bg-card/50 p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight">{value}</p>
    </div>
  )
}
