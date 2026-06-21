import {
  IconClock,
  IconMail,
  IconMapPin,
  IconPhone,
  IconRoute,
} from "@tabler/icons-react"
import type { ComponentType, SVGProps } from "react"

import { FacebookCTA } from "@/components/landing/facebook-cta"
import { Reveal } from "@/components/landing/reveal"
import { Section, SectionHeader } from "@/components/landing/section"
import { Button } from "@/components/ui/button"
import { mapsEmbedUrl, siteConfig } from "@/lib/site"

type DetailItem = {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  value: string
  href?: string
}

const details: DetailItem[] = [
  {
    icon: IconMapPin,
    label: "Address",
    value: siteConfig.location.full,
  },
  {
    icon: IconClock,
    label: "Opening hours",
    value: siteConfig.contact.hours,
  },
  // Hidden until provided in siteConfig.
  ...(siteConfig.contact.phone
    ? [
        {
          icon: IconPhone,
          label: "Phone",
          value: siteConfig.contact.phone,
          href: `tel:${siteConfig.contact.phone}`,
        },
      ]
    : []),
  ...(siteConfig.contact.email
    ? [
        {
          icon: IconMail,
          label: "Email",
          value: siteConfig.contact.email,
          href: `mailto:${siteConfig.contact.email}`,
        },
      ]
    : []),
]

export function LocationSection() {
  return (
    <Section id="location">
      <SectionHeader
        eyebrow="Find us"
        title={
          <>
            Drop by the shop in{" "}
            <span className="text-primary">Lubao, Pampanga.</span>
          </>
        }
        description="Walk-ins welcome. Or message us first so we can prepare the parts and tools you need."
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-5">
        <Reveal className="md:col-span-2">
          <div className="flex h-full flex-col gap-5 rounded-md border border-border/70 bg-card/60 p-7">
            <ul className="flex flex-col gap-5">
              {details.map(({ icon: Icon, label, value, href }) => {
                // Only link real values — bracketed placeholders stay plain text.
                const linkable = href && !value.includes("[")
                return (
                <li key={label} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-sm border border-border/70 bg-background/60 text-primary">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {label}
                    </span>
                    {linkable ? (
                      <a
                        href={href}
                        className="text-sm font-medium text-foreground/90 transition-colors hover:text-primary"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm font-medium leading-relaxed text-foreground/90">
                        {value}
                      </span>
                    )}
                  </div>
                </li>
                )
              })}
            </ul>

            <div className="mt-auto flex flex-col gap-3 border-t border-border/60 pt-5">
              <FacebookCTA size="lg" className="w-full" />
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                nativeButton={false}
                render={
                  <a
                    href={siteConfig.contact.maps}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <IconRoute />
                Get directions
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="md:col-span-3">
          <div className="group relative h-full min-h-[360px] overflow-hidden rounded-md border border-border/70 bg-card/40">
            <iframe
              title={`Map showing ${siteConfig.name} in Lubao, Pampanga`}
              src={mapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full grayscale-[35%] transition-[filter] duration-500 group-hover:grayscale-0"
            />
            <div className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-sm border border-border/70 bg-background/85 px-3 py-1.5 text-xs font-medium backdrop-blur">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Live location
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
