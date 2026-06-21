import {
  IconHeartHandshake,
  IconMapPin,
  IconClock,
  IconTools,
} from "@tabler/icons-react"
import Image from "next/image"

import brandLogo from "@/app/assets/brand-logo.png"
import { FacebookCTA } from "@/components/landing/facebook-cta"
import { Reveal } from "@/components/landing/reveal"
import { Section } from "@/components/landing/section"
import { Badge } from "@/components/ui/badge"
import { siteConfig } from "@/lib/site"

const quickFacts = [
  { icon: IconMapPin, label: "Based in", value: "Lubao, Pampanga" },
  { icon: IconClock, label: "Open", value: siteConfig.contact.hours },
  { icon: IconTools, label: "We do", value: "Repair · Parts · Trade" },
]

export function AboutIntro() {
  return (
    <Section id="about" className="pt-32 sm:pt-36 md:pt-40">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <Badge variant="accent" className="mb-5">
            <IconHeartHandshake /> About Rapido
          </Badge>
          <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
            The neighborhood garage daily riders{" "}
            <span className="text-primary">actually trust.</span>
          </h1>
          <div className="mt-6 flex flex-col gap-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              Rapido Motorsiklo Garage started with a simple idea: riders in
              Lubao deserve a motor shop that’s fast, fair, and easy to talk to.
              No panakot na presyo, no guesswork — just honest work from
              mechanics who treat your motor like their own.
            </p>
            <p>
              Today we’re more than a repair shop. We handle maintenance,
              stock genuine parts and accessories, help with motor trade — and
              now connect riders with quality, hand-checked motorcycles for
              sale. Whether you commute, deliver, or ride for the love of it,
              we’re here to keep you moving.
            </p>
          </div>

          <div className="mt-8">
            <FacebookCTA size="lg" label="Message the shop" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-4 -z-10 rounded-md bg-gradient-to-br from-primary/25 via-accent/10 to-transparent blur-2xl"
            />
            <div className="overflow-hidden rounded-md border border-border/70 bg-card/70 p-3">
              <Image
                src={brandLogo}
                alt="Rapido Motorsiklo Garage official logo"
                priority
                sizes="(max-width: 1024px) 90vw, 520px"
                className="w-full rounded-sm"
              />
              <div className="mt-3 grid grid-cols-3 gap-2">
                {quickFacts.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex flex-col gap-1 rounded-sm border border-border/60 bg-background/50 p-3"
                  >
                    <Icon className="size-4 text-accent" aria-hidden />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {label}
                    </span>
                    <span className="text-xs font-medium text-foreground/90">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
