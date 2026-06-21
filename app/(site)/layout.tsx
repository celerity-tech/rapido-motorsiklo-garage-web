import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { JsonLd } from "@/components/seo/json-ld"
import { SmoothScroll } from "@/components/smooth-scroll"
import { localBusinessJsonLd, websiteJsonLd } from "@/lib/seo"

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SmoothScroll>
      <JsonLd data={localBusinessJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <Header />
      {children}
      <Footer />
    </SmoothScroll>
  )
}
