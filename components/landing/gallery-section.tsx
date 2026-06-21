import { IconAperture, IconCamera } from "@tabler/icons-react"
import Image, { type StaticImageData } from "next/image"

import partsCounter from "@/app/assets/gallery/parts-counter.png"
import partsWall from "@/app/assets/gallery/parts-wall.png"
import serviceBay from "@/app/assets/gallery/service-bay.png"
import storefront from "@/app/assets/gallery/storefront.png"
import { Reveal } from "@/components/landing/reveal"
import { Section, SectionHeader } from "@/components/landing/section"

/**
 * One tile in the shop gallery. `photo` tiles render a real image; tiles without
 * one are upcoming shots — they show a labelled placeholder plus a `hint` that
 * tells us what to capture so it's easy to swap in later.
 */
type GalleryTile = {
  tag: string
  caption: string
  span: string
  photo?: StaticImageData
  alt?: string
  hint?: string
}

const tiles: GalleryTile[] = [
  {
    tag: "Storefront",
    caption: "Our shopfront on the strip",
    photo: storefront,
    alt: "Lit Rapido Motorsiklo Garage storefront at dusk with a mechanic working on a motorcycle",
    span: "col-span-2 row-span-2",
  },
  {
    tag: "Inventory",
    caption: "Parts counter",
    photo: partsCounter,
    alt: "Parts counter backed by shelves stocked with motorcycle parts and accessories",
    span: "col-span-1 row-span-1",
  },
  {
    tag: "Inventory",
    caption: "Parts wall",
    photo: partsWall,
    alt: "Pegboard wall lined with packaged motorcycle parts and accessories",
    span: "col-span-1 row-span-1",
  },
  {
    tag: "Service",
    caption: "The service bay",
    photo: serviceBay,
    alt: "Open-air Rapido service bay at golden hour with motorcycles parked under the canopy",
    span: "col-span-2 row-span-1 md:col-span-1",
  },
  {
    tag: "Planned shot",
    caption: "Repair in progress",
    hint: "Close-up: a mechanic's hands on the engine, motorcycle on the stand",
    span: "col-span-1 row-span-1",
  },
  {
    tag: "Planned shot",
    caption: "The crew",
    hint: "Group shot of the team out front of the shop",
    span: "col-span-1 row-span-1",
  },
]

export function GallerySection() {
  return (
    <Section id="gallery">
      <SectionHeader
        eyebrow="Inside the shop"
        title={
          <>
            A peek into{" "}
            <span className="text-primary">where the work happens.</span>
          </>
        }
        description="Real shots straight from the garage in Lubao — a few more are on the way."
      />

      <div className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:gap-4 md:auto-rows-[210px] md:grid-cols-3">
        {tiles.map((tile, idx) => (
          <Reveal key={tile.caption} delay={idx * 0.05} className={tile.span}>
            <figure className="group relative h-full overflow-hidden rounded-md border border-border/70 bg-card/60">
              {tile.photo ? (
                <Image
                  src={tile.photo}
                  alt={tile.alt ?? tile.caption}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  placeholder="blur"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <>
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"
                  />
                  <div
                    aria-hidden
                    className="bg-grid absolute inset-0 opacity-40"
                  />
                  <div className="absolute inset-0 grid place-items-center">
                    <IconAperture
                      className="size-8 text-muted-foreground/40"
                      aria-hidden
                    />
                  </div>
                </>
              )}

              {/* Bottom scrim keeps captions legible over photos and placeholders alike. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/15 to-transparent"
              />

              <div className="absolute inset-0 flex flex-col items-start justify-between p-4 sm:p-5">
                <span className="inline-flex items-center gap-1.5 rounded-sm border border-border/70 bg-background/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground backdrop-blur">
                  {tile.photo ? (
                    <IconCamera className="size-3" aria-hidden />
                  ) : (
                    <IconAperture className="size-3" aria-hidden />
                  )}
                  {tile.tag}
                </span>
                <figcaption className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground/95">
                    {tile.caption}
                  </span>
                  {tile.hint && (
                    <span className="text-xs leading-snug text-muted-foreground">
                      {tile.hint}
                    </span>
                  )}
                </figcaption>
              </div>

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-4 bottom-4 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
