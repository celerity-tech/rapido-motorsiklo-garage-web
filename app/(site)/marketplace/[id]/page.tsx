import type { Metadata } from "next"
import {
  IconArrowLeft,
  IconCalendar,
  IconEngine,
  IconManualGearbox,
  IconMapPin,
  IconRoad,
  IconShieldCheck,
} from "@tabler/icons-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { FacebookCTA } from "@/components/landing/facebook-cta"
import { Reveal } from "@/components/landing/reveal"
import { Section } from "@/components/landing/section"
import { ListingGallery } from "@/components/marketplace/listing-gallery"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FALLBACK_LISTING_IMAGE,
  formatMileage,
  formatPrice,
  statusLabels,
} from "@/lib/listing-utils"
import { getListingById } from "@/lib/listings"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

const statusStyles = {
  available: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
  reserved: "border-amber-500/30 bg-amber-500/15 text-amber-400",
  sold: "border-border/60 bg-background/80 text-muted-foreground",
}

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const listing = await getListingById(id)

  if (!listing) {
    return {
      title: "Listing not found",
    }
  }

  return {
    title: `${listing.title} - ${formatPrice(listing.price)}`,
    description: `${listing.year} ${listing.title} for sale at Rapido Motorsiklo Garage in ${listing.location}.`,
    alternates: {
      canonical: `/marketplace/${listing.id}`,
    },
    openGraph: {
      title: `${listing.title} - ${formatPrice(listing.price)}`,
      description: `${listing.year} ${listing.title} for sale at Rapido Motorsiklo Garage.`,
      images: [{ url: listing.image }],
    },
  }
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params
  const listing = await getListingById(id)

  if (!listing) {
    notFound()
  }

  const isSold = listing.status === "sold"
  const images =
    listing.images.length > 0 ? listing.images : [FALLBACK_LISTING_IMAGE]

  return (
    <main id="main" className="relative">
      <section className="relative overflow-hidden pt-28 pb-8 sm:pt-32">
        <div
          aria-hidden
          className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_18%,transparent_72%)] opacity-45"
        />
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/marketplace" />}
            nativeButton={false}
            className="mb-6"
          >
            <IconArrowLeft />
            Back to marketplace
          </Button>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)] lg:items-start">
            <Reveal>
              <ListingGallery
                title={listing.title}
                images={images}
                sold={isSold}
              />
            </Reveal>

            <Reveal delay={0.05}>
              <aside className="sticky top-24 space-y-5 rounded-md border border-border/70 bg-card/70 p-5 shadow-xl shadow-black/25 backdrop-blur-md">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
                      statusStyles[listing.status]
                    )}
                  >
                    {listing.status !== "sold" && (
                      <span
                        className="size-1.5 rounded-full bg-current"
                        aria-hidden
                      />
                    )}
                    {statusLabels[listing.status]}
                  </span>
                  {listing.featured && (
                    <Badge variant="accent">Featured</Badge>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    {listing.brand} - {listing.year}
                  </p>
                  <h1 className="mt-2 text-balance text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                    {listing.title}
                  </h1>
                  <p className="mt-4 text-4xl font-black tracking-tight text-primary">
                    {formatPrice(listing.price)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Spec
                    icon={<IconEngine />}
                    label="Engine"
                    value={`${listing.engineCc}cc`}
                  />
                  <Spec
                    icon={<IconRoad />}
                    label="Mileage"
                    value={formatMileage(listing.mileageKm)}
                  />
                  <Spec
                    icon={<IconManualGearbox />}
                    label="Transmission"
                    value={listing.transmission}
                  />
                  <Spec
                    icon={<IconCalendar />}
                    label="Year"
                    value={String(listing.year)}
                  />
                </div>

                <div className="flex items-start gap-2 rounded-sm border border-border/70 bg-background/45 p-3 text-sm text-muted-foreground">
                  <IconMapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                  <span>{listing.location}</span>
                </div>

                {isSold ? (
                  <Button variant="secondary" className="w-full" disabled>
                    Sold out
                  </Button>
                ) : (
                  <FacebookCTA
                    size="lg"
                    className="w-full"
                    label={`Inquire about the ${listing.title}`}
                  />
                )}
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      <Section className="pt-8 pb-24">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Reveal>
            <section className="rounded-md border border-border/70 bg-card/50 p-6">
              <div className="mb-5 flex items-center gap-2">
                <IconShieldCheck className="size-5 text-accent" aria-hidden />
                <h2 className="text-xl font-bold tracking-tight">
                  Listing highlights
                </h2>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {listing.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-3 rounded-sm border border-border/60 bg-background/35 p-3 text-sm text-foreground/85"
                  >
                    <span
                      className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden
                    />
                    {highlight}
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal delay={0.05}>
            <section className="rounded-md border border-primary/30 bg-primary/10 p-6">
              <h2 className="text-lg font-bold tracking-tight">
                Want to view it at the shop?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Message Rapido Motorsiklo Garage to confirm availability, ask for
                more photos, or schedule a viewing in Lubao.
              </p>
              <FacebookCTA
                size="default"
                className="mt-5 w-full"
                label={`Ask about ${listing.title}`}
              />
            </section>
          </Reveal>
        </div>
      </Section>
    </main>
  )
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-sm border border-border/70 bg-background/45 p-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <span className="[&_svg]:size-4 [&_svg]:text-accent">{icon}</span>
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}
