"use client"

import {
  IconArrowDown,
  IconBolt,
  IconClock,
  IconMapPin,
  IconShield,
  IconTool,
} from "@tabler/icons-react"
import { motion } from "motion/react"

import { FacebookCTA } from "@/components/landing/facebook-cta"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const heroBullets = [
  { icon: IconBolt, label: "Quick turnaround" },
  { icon: IconShield, label: "Honest pricing" },
  { icon: IconTool, label: "Trusted by daily riders" },
]

export function HeroSection() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24 md:pt-44 md:pb-32"
    >
      <div
        aria-hidden
        className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] opacity-60"
      />
      <div
        aria-hidden
        className="absolute -top-32 right-[-10%] -z-10 h-[520px] w-[520px] rounded-full bg-primary/25 blur-[140px]"
      />
      <div
        aria-hidden
        className="absolute -bottom-40 left-[-15%] -z-10 h-[480px] w-[480px] rounded-full bg-accent/15 blur-[140px]"
      />

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <Badge variant="accent" className="mb-6">
            <IconMapPin /> Lubao, Pampanga
          </Badge>

          <h1 className="text-balance text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Quick, honest{" "}
            <span className="relative inline-block text-primary">
              motorcycle parts and services
              <span
                aria-hidden
                className="absolute inset-x-0 -bottom-1 h-[6px] bg-accent/80"
              />
            </span>{" "}
            for daily riders.
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg md:text-xl">
            Rapido Motorsiklo Garage keeps your ride running smooth. Reliable
            repair, straightforward pricing, and friendly service from a local
            shop that treats your motor like our own.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
          >
            <FacebookCTA size="xl" className="w-full sm:w-auto" />
            <Button
              size="xl"
              variant="outline"
              className="w-full sm:w-auto"
              render={<a href="#services" />}
              nativeButton={false}
            >
              View services
              <IconArrowDown />
            </Button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
          >
            {heroBullets.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2">
                <Icon className="size-4 text-accent" aria-hidden />
                {label}
              </li>
            ))}
            <li className="inline-flex items-center gap-2">
              <IconClock className="size-4 text-accent" aria-hidden />
              Walk-ins welcome
            </li>
          </motion.ul>
        </motion.div>
      </div>
    </section>
  )
}
