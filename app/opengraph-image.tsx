import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const alt =
  "Rapido Motorsiklo Garage — Quick, honest motorcycle repair in Lubao, Pampanga"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const COLORS = {
  primary: "#E13B2A",
  accent: "#F0C447",
  fg: "#FFFFFF",
}

export default async function Image() {
  const photoData = await readFile(
    join(process.cwd(), "app", "assets", "shop-front.png")
  )
  const photoSrc = `data:image/png;base64,${photoData.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Shop-front photo (brand sign is in-frame) */}
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={photoSrc}
          width={1200}
          height={630}
          style={{
            position: "absolute",
            inset: 0,
            width: 1200,
            height: 630,
            objectFit: "cover",
          }}
        />

        {/* Dark gradient: keeps the top sign visible, darkens the bottom for text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.05) 26%, rgba(0,0,0,0.68) 62%, rgba(0,0,0,0.94) 100%)",
          }}
        />

        {/* Content pinned to the bottom-left */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            width: "100%",
            height: "100%",
            padding: "0 72px 64px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill={COLORS.accent}>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
            </svg>
            <div
              style={{
                display: "flex",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: 1,
                color: COLORS.accent,
                textTransform: "uppercase",
                textShadow: "0 2px 12px rgba(0,0,0,0.8)",
              }}
            >
              Lubao, Pampanga
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              maxWidth: 940,
              fontSize: 74,
              fontWeight: 900,
              lineHeight: 1.03,
              letterSpacing: -1.5,
              color: COLORS.fg,
              textShadow: "0 2px 16px rgba(0,0,0,0.65)",
            }}
          >
            <span>Quick, honest&nbsp;</span>
            <span style={{ color: COLORS.accent }}>motorcycle repair.</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginTop: 26,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "12px 24px",
                borderRadius: 999,
                background: COLORS.primary,
                color: "#fff",
                fontSize: 24,
                fontWeight: 700,
                boxShadow: "0 12px 30px -10px rgba(225,59,42,0.8)",
              }}
            >
              Message us on Facebook
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 23,
                fontWeight: 600,
                color: "rgba(255,255,255,0.92)",
                textShadow: "0 2px 12px rgba(0,0,0,0.7)",
              }}
            >
              Repair · Parts · Bikes for sale
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
