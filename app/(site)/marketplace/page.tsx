import type { Metadata } from "next"
import {
  IconChecks,
  IconFileCheck,
  IconMapPin,
  IconMotorbike,
} from "@tabler/icons-react"

import { FacebookCTA } from "@/components/landing/facebook-cta"
import { Reveal } from "@/components/landing/reveal"
import { Section } from "@/components/landing/section"
import { ListingsGrid } from "@/components/marketplace/listings-grid"
import { JsonLd } from "@/components/seo/json-ld"
import { Badge } from "@/components/ui/badge"
import { getListings } from "@/lib/listings"
import { breadcrumbJsonLd, listingsItemListJsonLd } from "@/lib/seo"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Marketplace — Motorcycles for sale in Lubao, Pampanga",
  description:
    "Browse quality, hand-checked motorcycles for sale at Rapido Motorsiklo Garage in Lubao, Pampanga. Inspected by our mechanics. Message us on Facebook to reserve or ask for more photos.",
  alternates: { canonical: "/marketplace" },
}

const buyerNotes = [
  { icon: IconChecks, label: "Hand-checked by our mechanics" },
  { icon: IconFileCheck, label: "Papers & transfer guidance" },
  { icon: IconMapPin, label: "See it at the shop in Lubao" },
]

export default async function MarketplacePage() {
  const listings = await getListings()
  const availableCount = listings.filter((l) => l.status !== "sold").length

  return (
    <main id="main" className="relative">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Marketplace", path: "/marketplace" },
        ])}
      />
      {listings.length > 0 && (
        <JsonLd data={listingsItemListJsonLd(listings)} />
      )}
      <section className="relative overflow-hidden pt-32 pb-10 sm:pt-36 md:pt-40">
        <div
          aria-hidden
          className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)] opacity-50"
        />
        <div
          aria-hidden
          className="absolute -top-24 right-[-10%] -z-10 h-[420px] w-[420px] rounded-full bg-primary/20 blur-[140px]"
        />
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <Reveal>
            <Badge variant="accent" className="mb-5">
              <IconMotorbike /> Marketplace
            </Badge>
            <h1 className="max-w-3xl text-balance text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">
              Quality motorcycles,{" "}
              <span className="text-primary">ready to ride.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              Every unit here is for sale and inspected by the same mechanics who
              service your motor. Found one you like? Message us on Facebook to
              reserve it, ask for more photos, or set a viewing.
            </p>

            <ul className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <li className="inline-flex items-center gap-2 font-medium text-foreground">
                <span className="size-2 rounded-full bg-emerald-400" aria-hidden />
                {availableCount} available now
              </li>
              {buyerNotes.map(({ icon: Icon, label }) => (
                <li key={label} className="inline-flex items-center gap-2">
                  <Icon className="size-4 text-accent" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <Section className="pt-6">
        <ListingsGrid listings={listings} />
      </Section>

      <Section className="pb-28 pt-0">
        <Reveal>
          <div className="flex flex-col items-center gap-5 rounded-md border border-primary/30 bg-card/60 px-6 py-12 text-center sm:px-10">
            <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
              Don’t see the one you’re looking for?
            </h2>
            <p className="max-w-xl text-pretty text-sm text-muted-foreground sm:text-base">
              New units come in often. Tell us your budget and the model you
              want — we’ll message you when the right ride lands.
            </p>
            <FacebookCTA size="lg" label="Tell us what you're looking for" />
          </div>
        </Reveal>
      </Section>
    </main>
  )
}
