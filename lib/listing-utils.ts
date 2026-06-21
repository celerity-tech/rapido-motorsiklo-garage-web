export type ListingStatus = "available" | "reserved" | "sold"

export type ListingTransmission = "Automatic" | "Manual" | "Semi-automatic"

export type Listing = {
  /** Stable UUID used as React key and in /marketplace/[id]. */
  id: string
  title: string
  brand: string
  year: number
  /** Price in PHP. */
  price: number
  /** Odometer reading in kilometers. */
  mileageKm: number
  engineCc: number
  transmission: ListingTransmission
  status: ListingStatus
  /** Short location string shown on the card. */
  location: string
  /** 2-4 concise selling points. */
  highlights: string[]
  /** Ordered gallery URLs. */
  images: string[]
  /** Primary image URL kept for existing cards. */
  image: string
  /** ISO date used for "newest first" sorting. */
  postedAt: string
  /** When true, rendered as the large hero card on the marketplace page. */
  featured?: boolean
}

export const FALLBACK_LISTING_IMAGE = "/listings/yamaha-sniper-155.svg"

const PESO = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
})

export const formatPrice = (price: number) => PESO.format(price)

export const formatMileage = (km: number) =>
  `${new Intl.NumberFormat("en-PH").format(km)} km`

export const statusLabels: Record<ListingStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
}
