import { IconClock, IconMapPin, IconUserCheck } from "@tabler/icons-react"

import { FacebookCTA } from "@/components/landing/facebook-cta"
import { Reveal } from "@/components/landing/reveal"
import { Section } from "@/components/landing/section"
import { Badge } from "@/components/ui/badge"
import { siteConfig } from "@/lib/site"

const reassurances = [
  { icon: IconUserCheck, label: "Honest mechanics" },
  { icon: IconClock, label: "Quick response" },
  { icon: IconMapPin, label: "Lubao, Pampanga" },
]

export function FinalCtaSection() {
  return (
    <Section id="cta" className="pb-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-md border border-primary/30 bg-card/70 px-6 py-14 text-center shadow-[0_30px_80px_-40px_oklch(0.65_0.24_25/0.6)] sm:px-10 sm:py-16 md:px-16 md:py-20">
          <div
            aria-hidden
            className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
          />
          <div
            aria-hidden
            className="absolute -left-20 -top-20 size-72 rounded-full bg-primary/30 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-24 -right-16 size-72 rounded-full bg-accent/20 blur-3xl"
          />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
            <Badge variant="accent">Ready when you are</Badge>
            <h2 className="text-balance text-3xl font-black leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
              Got a motor issue? Don’t wait — message us now.
            </h2>
            <p className="text-pretty text-base text-muted-foreground sm:text-lg">
              Tell us what’s wrong with your motor. We’ll reply on Facebook with
              an honest assessment and a clear next step.
            </p>

            <FacebookCTA size="xl" />

            <ul className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
              {reassurances.map(({ icon: Icon, label }) => (
                <li key={label} className="inline-flex items-center gap-1.5">
                  <Icon className="size-3.5 text-accent" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground/80">
              {siteConfig.location.display}
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
