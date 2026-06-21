import Image from "next/image"

import brandLogo from "@/app/assets/brand-logo.png"
import { cn } from "@/lib/utils"

/**
 * Official Rapido brand logo. The artwork has a solid red background, so it's
 * presented inside a rounded, ringed frame to read as a clean badge on the
 * dark UI. Size via `className` (defaults to a compact header height).
 */
export function Logo({
  className,
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  return (
    <Image
      src={brandLogo}
      alt="Rapido Motorsiklo Garage"
      priority={priority}
      sizes="(max-width: 768px) 140px, 200px"
      className={cn(
        "h-9 w-auto select-none rounded-md ring-1 ring-border/60",
        className
      )}
    />
  )
}
