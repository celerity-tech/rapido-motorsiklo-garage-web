import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient, ListingStatus } from "@prisma/client"

function readDotEnv(key: string) {
  const envPath = resolve(process.cwd(), ".env")
  if (!existsSync(envPath)) return undefined

  const line = readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(`${key}=`))

  if (!line) return undefined

  return line
    .slice(line.indexOf("=") + 1)
    .trim()
    .replace(/^["']|["']$/g, "")
}

const connectionString = process.env.DATABASE_URL ?? readDotEnv("DATABASE_URL")

if (!connectionString) {
  throw new Error("DATABASE_URL is required")
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(connectionString),
})

async function main() {
  await prisma.listing.deleteMany()

  await prisma.listing.create({
    data: {
      title: "Yamaha Sniper 155 (MX King)",
      brand: "Yamaha",
      year: 2021,
      price: 78000,
      mileageKm: 15400,
      engineCc: 155,
      transmission: "Manual",
      status: ListingStatus.AVAILABLE,
      location: "Lubao, Pampanga",
      highlights: [
        "Single owner, well-maintained",
        "Complete and updated papers",
        "Stock, no major modifications",
      ],
      postedAt: new Date("2026-06-10T00:00:00.000Z"),
      featured: true,
      images: {
        create: {
          url: "/listings/yamaha-sniper-155.svg",
          publicId: "",
          position: 0,
        },
      },
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
