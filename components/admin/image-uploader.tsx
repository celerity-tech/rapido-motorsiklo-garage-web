"use client"

import {
  IconArrowDown,
  IconArrowUp,
  IconPhotoPlus,
  IconStarFilled,
  IconTrash,
} from "@tabler/icons-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ExistingListingImage = {
  id: string
  url: string
  position: number
}

type ImageItem =
  | {
      kind: "existing"
      key: string
      id: string
      url: string
    }
  | {
      kind: "new"
      key: string
      file: File
      url: string
    }

const MAX_IMAGES = 4
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])

function createNewItem(file: File): ImageItem {
  return {
    kind: "new",
    key: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
    file,
    url: URL.createObjectURL(file),
  }
}

export function ImageUploader({
  existingImages = [],
}: {
  existingImages?: ExistingListingImage[]
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const itemsRef = useRef<ImageItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [items, setItems] = useState<ImageItem[]>(
    existingImages
      .sort((a, b) => a.position - b.position)
      .map((image) => ({
        kind: "existing",
        key: image.id,
        id: image.id,
        url: image.url,
      }))
  )

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useEffect(() => {
    const input = inputRef.current
    if (!input || typeof DataTransfer === "undefined") return

    const transfer = new DataTransfer()
    items.forEach((item) => {
      if (item.kind === "new") transfer.items.add(item.file)
    })
    input.files = transfer.files
  }, [items])

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => {
        if (item.kind === "new") URL.revokeObjectURL(item.url)
      })
    }
  }, [])

  const addFiles = (files: File[]) => {
    setError(null)

    if (items.length + files.length > MAX_IMAGES) {
      setError(`A listing can have up to ${MAX_IMAGES} images.`)
      return
    }

    const invalidType = files.find((file) => !ACCEPTED_TYPES.has(file.type))
    if (invalidType) {
      setError("Images must be JPG, PNG, or WebP files.")
      return
    }

    const oversized = files.find((file) => file.size > MAX_IMAGE_SIZE)
    if (oversized) {
      setError("Each image must be 5 MB or smaller.")
      return
    }

    setItems((current) => [...current, ...files.map(createNewItem)])
  }

  const moveItem = (index: number, direction: -1 | 1) => {
    setItems((current) => {
      const next = [...current]
      const target = index + direction
      if (target < 0 || target >= next.length) return next
      const [item] = next.splice(index, 1)
      next.splice(target, 0, item)
      return next
    })
  }

  const removeItem = (index: number) => {
    setItems((current) => {
      const item = current[index]
      if (item.kind === "new") URL.revokeObjectURL(item.url)
      return current.filter((_, itemIndex) => itemIndex !== index)
    })
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <div
            key={item.key}
            className={cn(
              "group relative overflow-hidden rounded-md border bg-background/50",
              index === 0 ? "border-primary/50" : "border-border/70"
            )}
          >
            {item.kind === "existing" && (
              <input type="hidden" name="existingImageIds" value={item.id} />
            )}
            <div className="relative aspect-[4/3]">
              <Image
                src={item.url}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 220px"
                className="object-cover"
                unoptimized={item.kind === "new"}
              />
            </div>
            <div className="absolute left-2 top-2 flex items-center gap-1">
              {index === 0 && (
                <span className="inline-flex items-center gap-1 rounded-sm border border-accent/40 bg-background/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent backdrop-blur">
                  <IconStarFilled className="size-3" aria-hidden />
                  Primary
                </span>
              )}
            </div>
            <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
              <Button
                type="button"
                variant="secondary"
                size="icon-xs"
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
                aria-label="Move image earlier"
              >
                <IconArrowUp />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon-xs"
                onClick={() => moveItem(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Move image later"
              >
                <IconArrowDown />
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="icon-xs"
                onClick={() => removeItem(index)}
                aria-label="Remove image"
              >
                <IconTrash />
              </Button>
            </div>
          </div>
        ))}

        {items.length < MAX_IMAGES && (
          <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border/80 bg-background/30 text-center text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/40 hover:text-foreground">
            <IconPhotoPlus className="size-6 text-accent" aria-hidden />
            <span className="font-medium">Add photos</span>
            <span className="px-4 text-xs">JPG, PNG, or WebP up to 5 MB</span>
            <input
              ref={inputRef}
              name="images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={(event) => {
                addFiles(Array.from(event.currentTarget.files ?? []))
              }}
            />
          </label>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
