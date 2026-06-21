import {
  IconBrandFacebook,
  IconClock,
  IconMail,
  IconMapPin,
  IconPhone,
} from "@tabler/icons-react"
import type { ComponentType, SVGProps } from "react"
import Link from "next/link"

import { Logo } from "@/components/landing/logo"
import { Separator } from "@/components/ui/separator"
import { siteConfig } from "@/lib/site"

const navColumns = [
  {
    title: "Explore",
    items: [
      { label: "Home", href: "/" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "About", href: "/about" },
      { label: "Location", href: "/#location" },
    ],
  },
  {
    title: "What we do",
    items: [
      { label: "Services", href: "/#services" },
      { label: "Parts shop", href: "/#parts" },
      { label: "Why Rapido", href: "/about#why" },
      { label: "FAQ", href: "/about#faq" },
    ],
  },
]

type ContactItem = {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  value: string
}

const contactItems: ContactItem[] = [
  { icon: IconMapPin, value: siteConfig.location.full },
  { icon: IconClock, value: siteConfig.contact.hours },
  // Hidden until provided in siteConfig.
  ...(siteConfig.contact.phone
    ? [{ icon: IconPhone, value: siteConfig.contact.phone }]
    : []),
  ...(siteConfig.contact.email
    ? [{ icon: IconMail, value: siteConfig.contact.email }]
    : []),
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-border/60 bg-background/80">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo className="h-12" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description} Quick repair, honest pricing, and the
              friendly service daily riders deserve.
            </p>
            <a
              href={siteConfig.contact.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-sm border border-border/70 bg-card/60 px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:border-primary/40 hover:text-primary"
            >
              <IconBrandFacebook className="size-4 text-primary" aria-hidden />
              Follow us on Facebook
            </a>
          </div>

          {navColumns.map((col) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className="md:col-span-2"
            >
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-foreground/80 transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="md:col-span-3">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Visit & contact
            </h3>
            <ul className="flex flex-col gap-3">
              {contactItems.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-sm text-foreground/80"
                >
                  <item.icon
                    className="mt-0.5 size-4 shrink-0 text-primary"
                    aria-hidden
                  />
                  <span className="leading-relaxed">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-border/60" />

        <div className="flex flex-col items-start justify-between gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>Made for daily riders in Lubao, Pampanga.</p>
        </div>
      </div>
    </footer>
  )
}
