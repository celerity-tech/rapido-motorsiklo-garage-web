import { ImageResponse } from "next/og"

import {
  formatMileage,
  formatPrice,
  statusLabels,
  type Listing,
  type ListingStatus,
} from "@/lib/listing-utils"
import { getListingById } from "@/lib/listings"
import { siteConfig } from "@/lib/site"

export const alt = `Motorcycle for sale at ${siteConfig.name}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Reflect live listing data (price/status change) rather than caching at build.
export const dynamic = "force-dynamic"

const COLORS = {
  bg: "#15151A",
  panel: "#1E1E24",
  border: "#2A2A33",
  primary: "#E13B2A",
  primarySoft: "rgba(225, 59, 42, 0.18)",
  accent: "#F0C447",
  fg: "#F8F4E8",
  muted: "#B8B0A0",
}

const STATUS_COLORS: Record<ListingStatus, string> = {
  available: "#34D399",
  reserved: COLORS.accent,
  sold: COLORS.muted,
}

/**
 * Fetch the primary photo as a base64 data URL so Satori embeds a guaranteed
 * raster image. Cloudinary placeholders are SVG and won't render on social, so
 * those return null and we fall back to the branded panel. Any fetch failure
 * also degrades gracefully.
 */
async function loadPrimaryPhoto(listing: Listing): Promise<string | null> {
  const source = listing.images.find(
    (url) => url.startsWith("http") && !url.endsWith(".svg")
  )
  if (!source) return null

  const optimized = source.includes("/upload/")
    ? source.replace("/upload/", "/upload/c_fill,w_760,h_660,q_auto,f_jpg/")
    : source

  try {
    const res = await fetch(optimized)
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    return `data:image/jpeg;base64,${buffer.toString("base64")}`
  } catch {
    return null
  }
}

function Wordmark() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          background: COLORS.primary,
          borderRadius: 8,
          fontSize: 34,
          fontWeight: 900,
          color: "#fff",
          position: "relative",
        }}
      >
        R
        <div
          style={{
            position: "absolute",
            bottom: 5,
            left: 10,
            right: 10,
            height: 3,
            background: COLORS.accent,
            display: "flex",
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 26, fontWeight: 800 }}>
          <span>Rapido</span>
          <span style={{ color: COLORS.primary }}>.</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: COLORS.muted,
          }}
        >
          Motorsiklo Garage
        </div>
      </div>
    </div>
  )
}

function PhotoPanel({ photo }: { photo: string | null }) {
  if (photo) {
    return (
      <div style={{ display: "flex", width: 460, height: "100%" }}>
        {/* Rendered by Satori inside ImageResponse, not the DOM — next/image
            does not apply here. */}
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={photo}
          width={460}
          height={630}
          style={{ objectFit: "cover", width: 460, height: 630 }}
        />
      </div>
    )
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 460,
        height: "100%",
        background: COLORS.primary,
        backgroundImage: `radial-gradient(420px 420px at 50% 30%, rgba(255,255,255,0.16), transparent 70%)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 180,
          height: 180,
          borderRadius: 20,
          background: "rgba(0,0,0,0.18)",
          fontSize: 120,
          fontWeight: 900,
          color: "#fff",
        }}
      >
        R
      </div>
    </div>
  )
}

function card(listing: Listing | null, photo: string | null) {
  if (!listing) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          background: COLORS.bg,
          color: COLORS.fg,
          fontFamily: "sans-serif",
        }}
      >
        <Wordmark />
        <div style={{ display: "flex", fontSize: 40, fontWeight: 800 }}>
          Motorcycles for sale in Lubao, Pampanga
        </div>
      </div>
    )
  }

  const statusColor = STATUS_COLORS[listing.status]

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: COLORS.bg,
        color: COLORS.fg,
        fontFamily: "sans-serif",
      }}
    >
      <PhotoPanel photo={photo} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          padding: "56px 56px 48px",
          backgroundImage: `radial-gradient(700px 400px at 110% -10%, ${COLORS.primarySoft}, transparent 60%)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Wordmark />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 16px",
              borderRadius: 999,
              fontSize: 18,
              fontWeight: 700,
              color: statusColor,
              border: `1px solid ${statusColor}`,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {statusLabels[listing.status]}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 22, color: COLORS.muted }}>
            {listing.brand} · {listing.year}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: -1,
              marginTop: 6,
            }}
          >
            {listing.title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 60,
              fontWeight: 900,
              color: COLORS.primary,
              marginTop: 18,
            }}
          >
            {formatPrice(listing.price)}
          </div>
          <div
            style={{
              display: "flex",
              gap: 14,
              marginTop: 22,
              fontSize: 22,
              color: COLORS.fg,
              fontWeight: 600,
            }}
          >
            <span>{formatMileage(listing.mileageKm)}</span>
            <span style={{ color: COLORS.border }}>·</span>
            <span>{listing.engineCc}cc</span>
            <span style={{ color: COLORS.border }}>·</span>
            <span>{listing.transmission}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 28,
            borderTop: `1px solid ${COLORS.border}`,
            fontSize: 20,
            color: COLORS.muted,
            fontWeight: 600,
          }}
        >
          <span>{listing.location}</span>
          <span style={{ color: COLORS.accent }}>Message us on Facebook</span>
        </div>
      </div>
    </div>
  )
}

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const listing = await getListingById(id)
  const photo = listing ? await loadPrimaryPhoto(listing) : null

  return new ImageResponse(card(listing, photo), { ...size })
}
