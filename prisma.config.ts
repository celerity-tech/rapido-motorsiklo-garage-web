import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

import { defineConfig } from "prisma/config"

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

const databaseUrl = process.env.DATABASE_URL ?? readDotEnv("DATABASE_URL")

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required")
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node --no-warnings --experimental-strip-types prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
})
