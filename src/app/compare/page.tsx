import Link from "next/link";
import CompareBuilder from "@/components/CompareBuilder";
import { Metadata } from "next";
import { getAllVehicles } from "@/lib/content";
import { comparisons } from "@/lib/data/comparisons";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Car Comparison Tool — Compare EVs, SUVs & Sedans Side-by-Side",
  description: "Compare cars head-to-head with detailed spec breakdowns. Range, performance, price — find the perfect vehicle with Autovaly's comparison engine.",
  openGraph: {
    title: "Car Comparison Tool | Autovaly",
    description: "Compare cars head-to-head with detailed spec breakdowns, telemetry, and pricing.",
    url: "https://autovaly.com/compare",
    images: [{ url: "https://autovaly.com/og-image.png", width: 1200, height: 630, alt: "Autovaly Comparison Tool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Car Comparison Tool | Autovaly",
    description: "Compare cars head-to-head with detailed spec breakdowns.",
  },
  alternates: { canonical: "/compare" },
};

export default async function CompareIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string }>;
}) {
  const initialCarA = (await searchParams).a || "";
  const vehicles = getAllVehicles();

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Compare", url: "/compare" },
  ];

  return (
    <main id="main-content" className="container mx-auto px-4 md:px-6 py-12 lg:py-20 min-h-[70vh]">
      <BreadcrumbJsonLd crumbs={crumbs} />
      <Breadcrumbs crumbs={crumbs} />

      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight mb-6 text-text-light">
          Head-to-Head Comparisons
        </h1>
        <p className="text-xl text-text-muted max-w-2xl mx-auto">
          We pit the industry&apos;s most important cars against each other. Range, performance, price—see how they stack up.
        </p>
      </div>

      <CompareBuilder vehicles={vehicles} initialCarA={initialCarA} />

      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-heading font-bold mb-8 text-text-light">Popular Matchups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {comparisons.map((comp) => (
            <Link
              key={comp.id}
              href={`/compare/${comp.slug}`}
              className="group flex flex-col bg-surface border border-border-custom rounded-xl overflow-hidden hover:border-accent transition-colors"
            >
              <div className="flex h-32 w-full">
                <div
                  className="flex-1 flex items-center justify-center p-4 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${comp.carA.gradient.from}, ${comp.carA.gradient.to})` }}
                >
                  <span className="relative z-10 font-bold text-white text-center shadow-black drop-shadow-md">{comp.carA.name}</span>
                </div>
                <div className="w-12 bg-background flex items-center justify-center z-10 -mx-6 transform skew-x-[-15deg] border-x border-border-custom" aria-hidden="true">
                  <span className="transform skew-x-[15deg] font-heading font-black text-accent text-xl italic">VS</span>
                </div>
                <div
                  className="flex-1 flex items-center justify-center p-4 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${comp.carB.gradient.from}, ${comp.carB.gradient.to})` }}
                >
                  <span className="relative z-10 font-bold text-white text-center shadow-black drop-shadow-md">{comp.carB.name}</span>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{comp.carA.name} vs {comp.carB.name}</h3>
                <p className="text-text-muted text-sm italic">&ldquo;{comp.tagline}&rdquo;</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
