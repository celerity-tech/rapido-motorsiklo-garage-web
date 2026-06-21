import type { Metadata } from "next"

import { AboutIntro } from "@/components/landing/about-intro"
import { FaqSection } from "@/components/landing/faq-section"
import { FinalCtaSection } from "@/components/landing/final-cta-section"
import { GallerySection } from "@/components/landing/gallery-section"
import { WhyChooseUsSection } from "@/components/landing/why-choose-us-section"

export const metadata: Metadata = {
  title: "About — Honest motorcycle repair in Lubao",
  description:
    "Meet Rapido Motorsiklo Garage: a Lubao, Pampanga motor shop built on fast, fair, and honest service. Repair, maintenance, parts, motor trade, and motorcycles for sale.",
  alternates: { canonical: "/about" },
}

export default function AboutPage() {
  return (
    <main id="main" className="relative">
      <AboutIntro />
      <WhyChooseUsSection />
      <GallerySection />
      <FaqSection />
      <FinalCtaSection />
    </main>
  )
}
