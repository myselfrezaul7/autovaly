import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

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
  title: "Autovaly — Drive the Story | Car News, EV Reviews & Comparisons",
  description: "Autovaly — Your source for car news, EV reviews, comparisons, and industry trends. Drive the Story.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlow.variable} ${inter.variable}`}>
      <body className="antialiased font-sans bg-background text-text-light selection:bg-accent selection:text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
