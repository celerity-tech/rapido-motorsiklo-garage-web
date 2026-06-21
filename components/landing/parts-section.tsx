import {
  IconArrowRight,
  IconBuildingStore,
  IconCheck,
} from "@tabler/icons-react"
import Image, { type StaticImageData } from "next/image"

import accessories from "@/app/assets/parts/accessories.png"
import batteries from "@/app/assets/parts/batteries.png"
import brakePads from "@/app/assets/parts/brake-pads.png"
import chains from "@/app/assets/parts/chains.png"
import oil from "@/app/assets/parts/oil.png"
import tire from "@/app/assets/parts/tire.png"
import { FacebookCTA } from "@/components/landing/facebook-cta"
import { Reveal } from "@/components/landing/reveal"
import { Section } from "@/components/landing/section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const partsFeatures = [
  "Genuine OEM-quality parts for popular local models",
  "Tires, batteries, chains, sprockets, and brake pads",
  "Oils, lubricants, and essential maintenance supplies",
  "Accessories: helmets, mirrors, lights, and upgrades",
]

type PartTile = {
  label: string
  image: StaticImageData
}

const partTiles: PartTile[] = [
  { label: "Tires", image: tire },
  { label: "Batteries", image: batteries },
  { label: "Chains & sprockets", image: chains },
  { label: "Brake pads", image: brakePads },
  { label: "Oils & lubricants", image: oil },
  { label: "Accessories", image: accessories },
]

export function PartsSection() {
  return (
    <Section id="parts">
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
        <Reveal>
          <Badge variant="accent" className="mb-5">
            <IconBuildingStore /> Parts & motor trade
          </Badge>
          <h2 className="text-balance text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
            More than a repair shop —{" "}
            <span className="text-primary">your local motor hub.</span>
          </h2>
          <p className="mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            Need parts, accessories, or help choosing the right upgrade? Walk
            into our shop or message us — we’ll guide you with honest advice and
            fair pricing, the same way we’d help a friend.
          </p>

          <ul className="mt-7 flex flex-col gap-3">
            {partsFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm leading-relaxed text-foreground/90"
              >
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-sm bg-primary/15 text-primary">
                  <IconCheck className="size-3.5" aria-hidden />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <FacebookCTA size="lg" label="Ask about parts" />
            <Button
              size="lg"
              variant="outline"
              render={<a href="#location" />}
              nativeButton={false}
            >
              Visit our shop
              <IconArrowRight />
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-3 -z-10 rounded-md bg-gradient-to-br from-primary/20 via-accent/10 to-transparent blur-2xl"
            />
            <div className="relative overflow-hidden rounded-md border border-border/70 bg-card/70 p-2">
              <div className="grid grid-cols-2 gap-2">
                {partTiles.map((tile) => (
                  <figure
                    key={tile.label}
                    className="group relative aspect-[4/3] overflow-hidden rounded-sm border border-border/60 bg-background/60"
                  >
                    <Image
                      src={tile.image}
                      alt={`${tile.label} available at Rapido Motorsiklo Garage`}
                      fill
                      sizes="(max-width: 768px) 45vw, 22vw"
                      placeholder="blur"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 p-3 text-xs font-semibold text-foreground/90">
                      {tile.label}
                    </figcaption>
                  </figure>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between rounded-sm border border-border/70 bg-background/80 px-4 py-3 text-xs backdrop-blur">
                <span className="font-semibold text-foreground">
                  In-stock parts
                </span>
                <span className="text-muted-foreground">Ask before you ride</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
