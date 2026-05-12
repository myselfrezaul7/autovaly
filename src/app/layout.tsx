import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import JsonLd from "@/components/JsonLd";

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://autovaly.com"),
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlow.variable} ${inter.variable}`}>
      <body className="antialiased font-sans bg-background text-text-light selection:bg-accent selection:text-white">
        <JsonLd />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
