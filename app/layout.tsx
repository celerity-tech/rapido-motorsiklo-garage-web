import type { Metadata, Viewport } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/site";

const fontSans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const siteUrl = siteConfig.url;
const siteName = siteConfig.name;
const siteTitle =
  "Rapido Motorsiklo Garage — Quick, honest motorcycle parts & services in Lubao";
const siteDescription =
  "Daily riders trust Rapido Motorsiklo Garage in Lubao, Pampanga for fast, honest motorcycle repair, maintenance, parts, and motorcycles for sale. Message us on Facebook to get help today.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "motorcycle repair Lubao",
    "motor parts Pampanga",
    "motorcycle for sale Pampanga",
    "Rapido Motorsiklo Garage",
    "motorcycle maintenance",
    "motor shop near me",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: siteUrl,
    siteName,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#15151A",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-PH" className="dark">
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
