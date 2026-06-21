import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { SmoothScroll } from "@/components/smooth-scroll"

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SmoothScroll>
      <Header />
      {children}
      <Footer />
    </SmoothScroll>
  )
}
