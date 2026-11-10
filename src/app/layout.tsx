import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import JsonLd from "@/components/JsonLd";
import ScrollEnhancements from "@/components/ui/ScrollEnhancements";
import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import KeyboardShortcuts from "@/components/ui/KeyboardShortcuts";
import { ThemeScript } from "@/components/ThemeScript";
import MobileNav from "@/components/ui/MobileNav";
import CookieConsent from "@/components/ui/CookieConsent";
import DomainSaleModal from "@/components/DomainSaleModal";

export const viewport: Viewport = {
  themeColor: "#E82B2B",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://autovaly.com"),
  manifest: "/manifest.webmanifest",
  icons: {
    apple: "/apple-touch-icon.png",
  },
  alternates: { canonical: "/" },
  title: {
    default: "Autovaly — Drive the Story | Car News, EV Reviews & Comparisons",
    template: "%s | Autovaly",
  },
  description:
    "Your definitive source for car news, EV reviews, comparisons, and automotive industry trends. Expert editorial coverage for enthusiasts and buyers worldwide.",
  keywords: [
    "car news",
    "EV reviews",
    "electric vehicles",
    "car comparisons",
    "auto industry",
    "Tesla",
    "BMW",
    "Porsche",
    "car specs",
    "automotive",
  ],
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
    description: "Deep-dive automotive journalism, real-world EV reviews, and technical car comparisons.",
    images: ["/og-image.png"],
    creator: "@autovaly",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="antialiased font-sans bg-background text-text-light selection:bg-accent selection:text-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-background focus:text-accent focus:ring-2 focus:ring-accent focus:rounded-xl focus:shadow-2xl"
        >
          Skip to content
        </a>
        <JsonLd />
        <Providers>
          <KeyboardShortcuts />
          <ScrollEnhancements />
          <div className="flex flex-col min-h-screen">
            <TopBar />
            <Navbar />
            <div className="flex-1 flex flex-col w-full pb-[80px] lg:pb-0">
              {children}
            </div>
            <Footer />
            <MobileNav />
            <CookieConsent />
            <DomainSaleModal />
          </div>
        </Providers>
      </body>
    </html>
  );
}
