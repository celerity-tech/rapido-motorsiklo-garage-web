import {
  IconArrowRight,
  IconEngine,
  IconManualGearbox,
  IconRoad,
} from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"
import type { ComponentType, SVGProps } from "react"

import { FacebookCTA } from "@/components/landing/facebook-cta"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  type Listing,
  type ListingStatus,
  formatMileage,
  formatPrice,
  statusLabels,
} from "@/lib/listing-utils"

const statusStyles: Record<ListingStatus, string> = {
  available: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
  reserved: "border-amber-500/30 bg-amber-500/15 text-amber-400",
  sold: "border-border/60 bg-background/80 text-muted-foreground",
}

function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider backdrop-blur",
        statusStyles[status]
      )}
    >
      {status !== "sold" && (
        <span className="size-1.5 rounded-full bg-current" aria-hidden />
      )}
      {statusLabels[status]}
    </span>
  )
}

type SpecProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
}

function Spec({ icon: Icon, label }: SpecProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <Icon className="size-4 text-accent" aria-hidden />
      {label}
    </span>
  )
}

function ListingMedia({
  listing,
  sizes,
  className,
}: {
  listing: Listing
  sizes: string
  className?: string
}) {
  const isSold = listing.status === "sold"
  return (
    <div className={cn("relative overflow-hidden bg-background/60", className)}>
      <Image
        src={listing.image}
        alt={`${listing.title} for sale at Rapido Motorsiklo Garage`}
        fill
        sizes={sizes}
        className={cn(
          "object-cover transition-transform duration-500 group-hover:scale-105",
          isSold && "grayscale"
        )}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"
      />
      <div className="absolute left-3 top-3">
        <StatusBadge status={listing.status} />
      </div>
      {isSold && (
        <div className="absolute inset-0 grid place-items-center">
          <span className="rotate-[-8deg] rounded-sm border-2 border-foreground/70 px-4 py-1 text-lg font-black uppercase tracking-widest text-foreground/80">
            Sold
          </span>
        </div>
      )}
    </div>
  )
}

function PriceTag({ listing, large }: { listing: Listing; large?: boolean }) {
  return (
    <div className="flex items-baseline">
      <span
        className={cn(
          "font-bold tracking-tight text-foreground",
          large ? "text-3xl" : "text-2xl"
        )}
      >
        {formatPrice(listing.price)}
      </span>
    </div>
  )
}

function InquireCTA({
  listing,
  className,
}: {
  listing: Listing
  className?: string
}) {
  if (listing.status === "sold") {
    return (
      <Button variant="secondary" className={className} disabled>
        Sold out
      </Button>
    )
  }
  return (
    <FacebookCTA
      size="default"
      className={className}
      label={`Inquire about the ${listing.title}`}
    />
  )
}

function Specs({ listing }: { listing: Listing }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <Spec icon={IconEngine} label={`${listing.engineCc}cc`} />
      <Spec icon={IconRoad} label={formatMileage(listing.mileageKm)} />
      <Spec icon={IconManualGearbox} label={listing.transmission} />
    </div>
  )
}

export function ListingCard({
  listing,
  variant = "default",
}: {
  listing: Listing
  variant?: "default" | "featured"
}) {
  if (variant === "featured") {
    return (
      <article className="group relative grid overflow-hidden rounded-md border border-border/70 bg-card/60 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/40 md:grid-cols-2">
        <ListingMedia
          listing={listing}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="aspect-[16/10] md:aspect-auto md:h-full"
        />
        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-sm border border-accent/30 bg-accent/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
              Featured
            </span>
            <span className="text-xs text-muted-foreground">
              {listing.brand} - {listing.year}
            </span>
          </div>
          <h3 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
            {listing.title}
          </h3>
          <PriceTag listing={listing} large />
          <Specs listing={listing} />
          <ul className="flex flex-col gap-1.5">
            {listing.highlights.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2 text-sm text-foreground/85"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-muted-foreground">
            <span>{listing.location}</span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              render={<Link href={`/marketplace/${listing.id}`} />}
              nativeButton={false}
              className="w-full sm:w-fit"
            >
              View details
              <IconArrowRight />
            </Button>
            <InquireCTA listing={listing} className="w-full sm:w-fit" />
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-md border border-border/70 bg-card/60 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_40px_-22px_oklch(0.65_0.24_25/0.6)]">
      <ListingMedia
        listing={listing}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="aspect-[4/3]"
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs text-muted-foreground">
            {listing.brand} - {listing.year}
          </p>
          <h3 className="text-lg font-semibold leading-tight tracking-tight">
            {listing.title}
          </h3>
        </div>
        <PriceTag listing={listing} />
        <Specs listing={listing} />
        <ul className="flex flex-col gap-1 text-sm text-foreground/80">
          {listing.highlights.slice(0, 2).map((point) => (
            <li key={point} className="flex items-start gap-2">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" aria-hidden />
              {point}
            </li>
          ))}
        </ul>
        <div className="mt-auto grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            render={<Link href={`/marketplace/${listing.id}`} />}
            nativeButton={false}
            className="w-full"
          >
            View details
            <IconArrowRight />
          </Button>
          <InquireCTA listing={listing} className="w-full" />
        </div>
      </div>
    </article>
  )
}
