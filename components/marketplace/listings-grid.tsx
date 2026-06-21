"use client"

import { IconArrowsSort, IconMotorbike } from "@tabler/icons-react"
import { useMemo, useState } from "react"

import { ListingCard } from "@/components/marketplace/listing-card"
import { FacebookCTA } from "@/components/landing/facebook-cta"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  type Listing,
  type ListingStatus,
  statusLabels,
} from "@/lib/listing-utils"

type SortKey = "newest" | "price-asc" | "price-desc" | "year-desc"
type StatusFilter = ListingStatus | "all"

const sortOptions: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "year-desc", label: "Year: newest" },
]

const sorters: Record<SortKey, (a: Listing, b: Listing) => number> = {
  newest: (a, b) => b.postedAt.localeCompare(a.postedAt),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "year-desc": (a, b) => b.year - a.year,
}

export function ListingsGrid({ listings }: { listings: Listing[] }) {
  const [status, setStatus] = useState<StatusFilter>("all")
  const [brand, setBrand] = useState<string>("all")
  const [sort, setSort] = useState<SortKey>("newest")

  const brands = useMemo(
    () => Array.from(new Set(listings.map((l) => l.brand))).sort(),
    [listings]
  )

  const statuses = useMemo(() => {
    const present = new Set(listings.map((l) => l.status))
    const ordered: ListingStatus[] = ["available", "reserved", "sold"]
    return ordered.filter((s) => present.has(s))
  }, [listings])

  const results = useMemo(() => {
    return listings
      .filter((l) => status === "all" || l.status === status)
      .filter((l) => brand === "all" || l.brand === brand)
      .sort(sorters[sort])
  }, [listings, status, brand, sort])

  const resetFilters = () => {
    setStatus("all")
    setBrand("all")
    setSort("newest")
  }

  const [featured, ...rest] = results

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 border-b border-border/60 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Filter by status"
          className="flex flex-wrap items-center gap-2"
        >
          <FilterPill
            active={status === "all"}
            onSelect={() => setStatus("all")}
          >
            All
            <span className="ml-1.5 text-xs opacity-70">{listings.length}</span>
          </FilterPill>
          {statuses.map((s) => (
            <FilterPill
              key={s}
              active={status === s}
              onSelect={() => setStatus(s)}
            >
              {statusLabels[s]}
            </FilterPill>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={brand}
            onValueChange={(value) => setBrand(value ?? "all")}
            items={[
              { label: "All brands", value: "all" },
              ...brands.map((b) => ({ label: b, value: b })),
            ]}
          >
            <SelectTrigger aria-label="Filter by brand" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All brands</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(value) => setSort(value ?? "newest")}
            items={sortOptions}
          >
            <SelectTrigger aria-label="Sort listings" className="w-52">
              <span className="inline-flex min-w-0 items-center gap-2">
                <IconArrowsSort
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <SelectValue />
              </span>
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-md border border-dashed border-border/70 bg-card/40 px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-sm border border-border/70 bg-background/60 text-muted-foreground">
            <IconMotorbike className="size-6" aria-hidden />
          </span>
          <div>
            <p className="text-base font-semibold">No motorcycles match that.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try clearing the filters, or message us — new units come in often.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="outline" onClick={resetFilters}>
              Clear filters
            </Button>
            <FacebookCTA size="default" label="Ask what's available" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {featured && <ListingCard listing={featured} variant="featured" />}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function FilterPill({
  active,
  onSelect,
  children,
}: {
  active: boolean
  onSelect: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onSelect}
      className={cn(
        "inline-flex items-center rounded-sm border px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary/40 bg-primary/15 text-foreground"
          : "border-border/70 bg-background/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}
