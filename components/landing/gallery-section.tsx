import { IconCamera } from "@tabler/icons-react"

import { Reveal } from "@/components/landing/reveal"
import { Section, SectionHeader } from "@/components/landing/section"

const tiles = [
  { label: "Shop interior", aspect: "aspect-[4/5]" },
  { label: "Repair in progress", aspect: "aspect-[4/3]" },
  { label: "Parts wall", aspect: "aspect-square" },
  { label: "Customer ride", aspect: "aspect-[4/3]" },
  { label: "Tune-up bay", aspect: "aspect-square" },
  { label: "Team at work", aspect: "aspect-[4/5]" },
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
        description="Real photos coming soon. Until then, here's how the shop is organized."
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {tiles.map((tile, idx) => (
          <Reveal key={tile.label} delay={idx * 0.05}>
            <figure
              className={`group relative ${tile.aspect} overflow-hidden rounded-md border border-border/70 bg-card/60`}
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"
              />
              <div
                aria-hidden
                className="bg-grid absolute inset-0 opacity-40"
              />
              <div className="absolute inset-0 flex flex-col items-start justify-between p-4 sm:p-5">
                <span className="inline-flex items-center gap-1.5 rounded-sm border border-border/70 bg-background/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground backdrop-blur">
                  <IconCamera className="size-3" aria-hidden /> Photo
                </span>
                <figcaption className="text-sm font-medium text-foreground/90">
                  {tile.label}
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
