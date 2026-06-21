"use client"

import {
  IconDeviceFloppy,
  IconPhoto,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react"
import Link from "next/link"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

import {
  ImageUploader,
  type ExistingListingImage,
} from "@/components/admin/image-uploader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type ListingActionState = {
  error?: string
}

type ListingFormAction = (
  state: ListingActionState,
  formData: FormData
) => Promise<ListingActionState>

export type AdminListingFormValue = {
  title: string
  brand: string
  year: number
  price: number
  mileageKm: number
  engineCc: number
  transmission: "Automatic" | "Manual" | "Semi-automatic"
  status: "AVAILABLE" | "RESERVED" | "SOLD"
  location: string
  highlights: string[]
  featured: boolean
  postedAt: string
  images: ExistingListingImage[]
}

const transmissionOptions = [
  "Automatic",
  "Manual",
  "Semi-automatic",
] as const

const statusOptions = [
  { value: "AVAILABLE", label: "Available" },
  { value: "RESERVED", label: "Reserved" },
  { value: "SOLD", label: "Sold" },
] as const

function today() {
  return new Date().toISOString().slice(0, 10)
}

const emptyListing: AdminListingFormValue = {
  title: "",
  brand: "",
  year: new Date().getFullYear(),
  price: 0,
  mileageKm: 0,
  engineCc: 0,
  transmission: "Manual",
  status: "AVAILABLE",
  location: "Lubao, Pampanga",
  highlights: [""],
  featured: false,
  postedAt: today(),
  images: [],
}

export function ListingForm({
  action,
  listing,
  submitLabel,
}: {
  action: ListingFormAction
  listing?: AdminListingFormValue
  submitLabel: string
}) {
  const values = listing ?? emptyListing
  const [state, formAction, isPending] = useActionState(action, {})
  const [transmission, setTransmission] = useState(values.transmission)
  const [status, setStatus] = useState(values.status)
  const [highlights, setHighlights] = useState(
    values.highlights.length > 0 ? values.highlights : [""]
  )

  useEffect(() => {
    if (!state.error) return

    toast.error(state.error)
    window.requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>("[data-form-error]")
        ?.scrollIntoView({ block: "center", behavior: "smooth" })
    })
  }, [state.error])

  const updateHighlight = (index: number, value: string) => {
    setHighlights((current) =>
      current.map((highlight, highlightIndex) =>
        highlightIndex === index ? value : highlight
      )
    )
  }

  const removeHighlight = (index: number) => {
    setHighlights((current) =>
      current.length === 1
        ? [""]
        : current.filter((_, highlightIndex) => highlightIndex !== index)
    )
  }

  return (
    <form action={formAction} className="space-y-8">
      {state.error && (
        <div
          data-form-error
          className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <p className="font-semibold">Could not save the listing.</p>
          <p className="mt-1">{state.error}</p>
        </div>
      )}

      <section className="grid gap-5 rounded-md border border-border/70 bg-card/50 p-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Listing title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={values.title}
            placeholder="Yamaha Sniper 155"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            name="brand"
            defaultValue={values.brand}
            placeholder="Yamaha"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            name="year"
            type="number"
            min="1970"
            max={new Date().getFullYear() + 1}
            defaultValue={values.year}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            defaultValue={values.price}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mileageKm">Mileage (km)</Label>
          <Input
            id="mileageKm"
            name="mileageKm"
            type="number"
            min="0"
            defaultValue={values.mileageKm}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="engineCc">Engine (cc)</Label>
          <Input
            id="engineCc"
            name="engineCc"
            type="number"
            min="1"
            defaultValue={values.engineCc}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Transmission</Label>
          <input type="hidden" name="transmission" value={transmission} />
          <Select
            value={transmission}
            onValueChange={(value) =>
              setTransmission((value ?? "Manual") as typeof transmission)
            }
            items={transmissionOptions.map((value) => ({ label: value, value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {transmissionOptions.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <input type="hidden" name="status" value={status} />
          <Select
            value={status}
            onValueChange={(value) =>
              setStatus((value ?? "AVAILABLE") as typeof status)
            }
            items={statusOptions}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            defaultValue={values.location}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postedAt">Posted date</Label>
          <Input
            id="postedAt"
            name="postedAt"
            type="date"
            defaultValue={values.postedAt}
            required
          />
        </div>

        <label className="flex items-center gap-3 rounded-sm border border-border/70 bg-background/40 px-3 py-2 text-sm font-medium text-foreground">
          <input
            name="featured"
            type="checkbox"
            defaultChecked={values.featured}
            className="size-4 accent-primary"
          />
          Feature this listing
        </label>
      </section>

      <section className="rounded-md border border-border/70 bg-card/50 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Highlights</h2>
            <p className="text-sm text-muted-foreground">
              Short selling points shown on public cards.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setHighlights((current) => [...current, ""])}
            disabled={highlights.length >= 6}
          >
            <IconPlus />
            Add
          </Button>
        </div>

        <div className="space-y-3">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                name="highlights"
                value={highlight}
                onChange={(event) => updateHighlight(index, event.target.value)}
                className="min-h-10"
                placeholder="Complete and updated papers"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeHighlight(index)}
                aria-label="Remove highlight"
              >
                <IconTrash />
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-md border border-border/70 bg-card/50 p-5">
        <div className="mb-4 flex items-center gap-2">
          <IconPhoto className="size-5 text-accent" aria-hidden />
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Gallery</h2>
            <p className="text-sm text-muted-foreground">
              Reorder images to choose the primary marketplace photo.
            </p>
          </div>
        </div>
        <ImageUploader existingImages={values.images} />
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          render={<Link href="/admin" />}
          nativeButton={false}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          <IconDeviceFloppy />
          {isPending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}
