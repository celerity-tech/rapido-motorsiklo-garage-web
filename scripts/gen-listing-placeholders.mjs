/**
 * Generates on-brand SVG placeholder images for the sample marketplace listings.
 * These are temporary stand-ins until the CMS serves real motorcycle photos.
 *
 * Run: `node scripts/gen-listing-placeholders.mjs`
 */
import { mkdir, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const outDir = join(root, "public", "listings")

const bikes = [
  { file: "yamaha-sniper-155", brand: "Yamaha", title: "Sniper 155", cc: 155 },
  { file: "honda-click-125i", brand: "Honda", title: "Click 125i", cc: 125 },
  { file: "yamaha-mio-sporty", brand: "Yamaha", title: "Mio Sporty", cc: 113 },
  { file: "suzuki-raider-r150", brand: "Suzuki", title: "Raider R150", cc: 147 },
  { file: "honda-xrm-125", brand: "Honda", title: "XRM 125", cc: 125 },
  { file: "kawasaki-rouser-ns160", brand: "Kawasaki", title: "Rouser NS160", cc: 160 },
]

const W = 1200
const H = 800

const svg = ({ brand, title, cc }) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${brand} ${title} — sample photo">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1a1a1e"/>
      <stop offset="1" stop-color="#0d0d0f"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.42" r="0.6">
      <stop offset="0" stop-color="#e23d2e" stop-opacity="0.32"/>
      <stop offset="1" stop-color="#e23d2e" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M56 0H0V56" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <text x="600" y="430" text-anchor="middle" font-family="Outfit, Arial, sans-serif" font-size="300" font-weight="900" fill="#ffffff" fill-opacity="0.04" letter-spacing="6">${brand.toUpperCase()}</text>

  <g transform="translate(600 400)" stroke="#e23d2e" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="-200" cy="120" r="98"/>
    <circle cx="200" cy="120" r="98"/>
    <circle cx="-200" cy="120" r="34" stroke="#f4c20d" stroke-width="8"/>
    <circle cx="200" cy="120" r="34" stroke="#f4c20d" stroke-width="8"/>
    <path d="M-200 120 L-70 -20 L110 -20 L200 120"/>
    <path d="M-90 -20 Q10 -120 150 -30"/>
    <path d="M110 -20 L185 -120 L280 -120"/>
    <path d="M-70 -20 L-130 120"/>
  </g>

  <g font-family="Outfit, Arial, sans-serif">
    <rect x="64" y="64" width="${(brand.length + 6) * 16 + 28}" height="44" rx="8" fill="#e23d2e"/>
    <text x="${64 + 20}" y="93" font-size="22" font-weight="700" fill="#ffffff" letter-spacing="2">${brand.toUpperCase()} · RAPIDO</text>

    <text x="64" y="${H - 110}" font-size="58" font-weight="800" fill="#f5f3ef">${title}</text>
    <text x="64" y="${H - 64}" font-size="28" font-weight="500" fill="#9a9a93">${cc}cc · Sample photo — real shots coming soon</text>

    <g transform="translate(${W - 220} ${H - 128})">
      <rect width="156" height="40" rx="8" fill="none" stroke="#f4c20d" stroke-opacity="0.5"/>
      <text x="78" y="26" text-anchor="middle" font-size="18" font-weight="700" fill="#f4c20d" letter-spacing="3">SAMPLE</text>
    </g>
  </g>
</svg>
`

await mkdir(outDir, { recursive: true })
await Promise.all(
  bikes.map((bike) =>
    writeFile(join(outDir, `${bike.file}.svg`), svg(bike), "utf8")
  )
)
console.log(`Wrote ${bikes.length} placeholders to public/listings/`)
