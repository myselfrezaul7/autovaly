import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import JsonLd from "@/components/JsonLd";
import ScrollEnhancements from "@/components/ui/ScrollEnhancements";

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#E82B2B",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://autovaly.com"),
  alternates: { canonical: "/" },
  title: {
    default: "Autovaly — Drive the Story | Car News, EV Reviews & Comparisons",
    template: "%s | Autovaly",
  },
  description: "Your definitive source for car news, EV reviews, comparisons, and automotive industry trends. Expert editorial coverage for enthusiasts and buyers worldwide.",
  keywords: ["car news", "EV reviews", "electric vehicles", "car comparisons", "auto industry", "Tesla", "BMW", "Porsche", "car specs", "automotive"],
  authors: [{ name: "Autovaly Editorial" }],
  creator: "Autovaly",
  publisher: "Autovaly",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://autovaly.com",
    siteName: "Autovaly",
    title: "Autovaly — Drive the Story",
    description: "Expert car news, EV reviews, and comparisons for enthusiasts and buyers worldwide.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Autovaly — Drive the Story" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Autovaly — Drive the Story",
    description: "Expert car news, EV reviews, and comparisons.",
    images: ["/og-image.png"],
    creator: "@autovaly",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KeyboardShortcuts from "@/components/ui/KeyboardShortcuts";
import { ThemeScript } from "@/components/ThemeScript";
import MobileNav from "@/components/ui/MobileNav";
import CookieConsent from "@/components/ui/CookieConsent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlow.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <ThemeScript />
      </head>
      <body className="antialiased font-sans bg-background text-text-light selection:bg-accent selection:text-white">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-accent">Skip to content</a>
        <JsonLd />
        <Providers>
          <KeyboardShortcuts />
          <ScrollEnhancements />
          <div className="flex flex-col min-h-screen">
            <TopBar />
            <Navbar />
            <main id="main-content" className="flex-1 flex flex-col w-full pb-[80px] lg:pb-0">
              {children}
            </main>
            <Footer />
            <MobileNav />
            <CookieConsent />
          </div>
        </Providers>
      </body>
    </html>
  );
}
