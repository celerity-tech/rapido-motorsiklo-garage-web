"use client"

import Image from "next/image"
import { useState } from "react"

import { cn } from "@/lib/utils"

export function ListingGallery({
  title,
  images,
  sold,
}: {
  title: string
  images: string[]
  sold: boolean
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedImage = images[selectedIndex] ?? images[0]

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-border/70 bg-card/60 shadow-xl shadow-black/30">
        <Image
          src={selectedImage}
          alt={`${title} marketplace photo ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className={cn("object-cover", sold && "grayscale")}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background/35 via-transparent to-transparent"
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Show photo ${index + 1}`}
              className={cn(
                "relative aspect-[4/3] overflow-hidden rounded-sm border bg-background/60 transition-colors",
                selectedIndex === index
                  ? "border-primary/70"
                  : "border-border/70 hover:border-primary/40"
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="160px"
                className={cn("object-cover", sold && "grayscale")}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
