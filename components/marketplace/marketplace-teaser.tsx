import { IconArrowRight, IconMotorbike } from "@tabler/icons-react"
import Link from "next/link"

import { ListingCard } from "@/components/marketplace/listing-card"
import { Reveal } from "@/components/landing/reveal"
import { Section, SectionHeader } from "@/components/landing/section"
import { Button } from "@/components/ui/button"
import { type Listing } from "@/lib/listing-utils"

export function MarketplaceTeaser({ listings }: { listings: Listing[] }) {
  // Surface up-to-3 still-available units, newest first.
  const featuredListings = listings
    .filter((l) => l.status !== "sold")
    .sort((a, b) => b.postedAt.localeCompare(a.postedAt))
    .slice(0, 3)

  if (featuredListings.length === 0) return null

  return (
    <Section id="marketplace">
      <SectionHeader
        eyebrow="Marketplace"
        title={
          <>
            Looking for your next ride?{" "}
            <span className="text-primary">Browse our motorcycles.</span>
          </>
        }
        description="Hand-checked motorcycles for sale — inspected by the same mechanics who'd service them. Message us to reserve a unit or ask for more photos."
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featuredListings.map((listing, idx) => (
          <Reveal key={listing.id} delay={idx * 0.05}>
            <ListingCard listing={listing} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15} className="mt-12 flex justify-center">
        <Button
          size="lg"
          render={<Link href="/marketplace" />}
          nativeButton={false}
        >
          <IconMotorbike />
          View all motorcycles for sale
          <IconArrowRight />
        </Button>
      </Reveal>
    </Section>
  )
}
