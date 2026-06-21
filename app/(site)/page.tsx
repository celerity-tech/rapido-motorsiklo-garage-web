import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { LocationSection } from "@/components/landing/location-section"
import { FinalCtaSection } from "@/components/landing/final-cta-section"
import { PartsSection } from "@/components/landing/parts-section"
import { ProblemSolutionSection } from "@/components/landing/problem-solution-section"
import { ServicesSection } from "@/components/landing/services-section"
import { TrustBar } from "@/components/landing/trust-bar"
import { MarketplaceTeaser } from "@/components/marketplace/marketplace-teaser"
import { getListings } from "@/lib/listings"

export const dynamic = "force-dynamic"

export default async function Home() {
  const listings = await getListings()

  return (
    <main id="main" className="relative">
      <HeroSection />
      <TrustBar />
      <ServicesSection />
      <ProblemSolutionSection />
      <HowItWorksSection />
      <PartsSection />
      <MarketplaceTeaser listings={listings} />
      <LocationSection />
      <FinalCtaSection />
    </main>
  )
}
