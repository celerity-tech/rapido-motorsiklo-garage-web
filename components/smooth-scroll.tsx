"use client"

import { ReactLenis, useLenis } from "lenis/react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

/** Fixed-header height to offset in-page anchor scrolling. */
const HEADER_OFFSET = -84

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  return reduced
}

/**
 * Handles anchor smoothing + scroll restoration on top of Lenis:
 * - Intercepts same-page hash links (`#id` and `/#id` while already home)
 *   and eases to them with a fixed-header offset.
 * - On route change, resets to the top (or to the URL hash if present).
 */
function ScrollManager() {
  const lenis = useLenis()
  const pathname = usePathname()

  useEffect(() => {
    if (!lenis) return

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as HTMLElement | null)?.closest("a")
      if (!anchor) return

      const href = anchor.getAttribute("href")
      if (!href) return

      const url = new URL(href, window.location.href)
      const samePage = url.pathname === window.location.pathname
      if (!samePage || !url.hash) return

      const target = document.querySelector(url.hash)
      if (!target) return

      event.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: HEADER_OFFSET })
      history.pushState(null, "", url.hash)
    }

    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [lenis])

  // Reset scroll on navigation (App Router + Lenis don't sync automatically).
  useEffect(() => {
    if (!lenis) return
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash)
      if (target) {
        lenis.scrollTo(target as HTMLElement, {
          offset: HEADER_OFFSET,
          immediate: true,
        })
        return
      }
    }
    lenis.scrollTo(0, { immediate: true })
  }, [lenis, pathname])

  return null
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion()

  return (
    <ReactLenis
      root
      options={{
        // Gentle, premium feel — eased wheel + synced touch for mobile.
        lerp: reduced ? 1 : 0.1,
        duration: reduced ? 0 : 1.15,
        smoothWheel: !reduced,
        syncTouch: !reduced,
        syncTouchLerp: 0.08,
        touchMultiplier: 1.2,
        wheelMultiplier: 1,
        gestureOrientation: "vertical",
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
    >
      <ScrollManager />
      {children}
    </ReactLenis>
  )
}
