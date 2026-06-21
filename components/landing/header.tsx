"use client"

import { IconMenu2, IconX } from "@tabler/icons-react"
import { useLenis } from "lenis/react"
import { AnimatePresence, motion, useScroll } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { FacebookCTA } from "@/components/landing/facebook-cta"
import { Logo } from "@/components/landing/logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "About", href: "/about" },
]

function useActivePath() {
  const pathname = usePathname()
  return (href: string) => {
    const [path] = href.split("#")
    const normalized = path.length > 1 ? path.replace(/\/$/, "") : path
    if (normalized === "/") return pathname === "/" && !href.includes("#")
    return pathname === normalized || pathname.startsWith(`${normalized}/`)
  }
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const lenis = useLenis()
  const isActive = useActivePath()
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Lock background scroll while the mobile menu is open.
  useEffect(() => {
    if (!open) return
    lenis?.stop()
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      lenis?.start()
      document.body.style.overflow = original
    }
  }, [open, lenis])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <motion.div
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-primary via-accent to-primary"
      />

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Rapido Motorsiklo Garage — home">
          <Logo priority />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "rounded-sm px-3 py-2 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <FacebookCTA size="sm" label="Message us" />
        </div>

        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Open menu"
          className="md:hidden"
          onClick={() => setOpen(true)}
        >
          <IconMenu2 />
        </Button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col gap-6 border-l border-border bg-background p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <Logo />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                >
                  <IconX />
                </Button>
              </div>

              <nav aria-label="Mobile" className="flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "border-b border-border/60 py-4 text-base font-medium transition-colors hover:text-primary",
                      isActive(link.href) ? "text-primary" : "text-foreground/90"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-3">
                <FacebookCTA size="lg" className="w-full" />
                <p className="text-center text-xs text-muted-foreground">
                  Walk-ins welcome. Fast, honest service.
                </p>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
