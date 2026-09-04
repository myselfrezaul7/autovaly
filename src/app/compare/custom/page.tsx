import { getVehicleBySlug, getAllVehicles } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import CompareSpecs from "@/components/CompareSpecs";
import CompareBuilder from "@/components/CompareBuilder";
import { ComparisonData } from "@/lib/types";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string; vehicles?: string }>;
}): Promise<Metadata> {
  const { a, b, vehicles } = await searchParams;
  const slugA = a || (vehicles ? vehicles.split(",")[0] : null);
  const slugB = b || (vehicles ? vehicles.split(",")[1] : null);

  if (!slugA || !slugB) return { title: "Custom Comparison", robots: { index: false, follow: true } };

  const carA = getVehicleBySlug(slugA);
  const carB = getVehicleBySlug(slugB);

  if (!carA || !carB) return { title: "Custom Comparison", robots: { index: false, follow: true } };

  const [canonicalA, canonicalB] = [slugA, slugB].sort();

  const title = `${carA.make} ${carA.model} vs ${carB.make} ${carB.model} Showdown`;
  const description = `Compare the ${carA.make} ${carA.model} against the ${carB.make} ${carB.model}. Complete head-to-head telemetry, performance, and pricing.`;

  return {
    title,
    description,
    robots: { index: false, follow: true },
    openGraph: {
      type: "article",
      title: `${title} | Autovaly`,
      description,
      url: `https://autovaly.com/compare/custom?a=${canonicalA}&b=${canonicalB}`,
      images: carA.coverImage ? [{ url: carA.coverImage, width: 1200, height: 630, alt: title }] : [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Autovaly`,
      description,
      images: carA.coverImage ? [carA.coverImage] : ["/og-image.png"],
    },
    alternates: { canonical: `/compare/custom?a=${canonicalA}&b=${canonicalB}` },
  };
}

export default async function CustomComparisonPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string; vehicles?: string }>;
}) {
  const { a, b, vehicles } = await searchParams;
  const slugA = a || (vehicles ? vehicles.split(",")[0] : null);
  const slugB = b || (vehicles ? vehicles.split(",")[1] : null);

  const carA = slugA ? getVehicleBySlug(slugA) : null;
  const carB = slugB ? getVehicleBySlug(slugB) : null;

  if (!slugA || !slugB || !carA || !carB) {
    const allVehicles = getAllVehicles();
    const crumbs = [
      { name: "Home", url: "/" },
      { name: "Compare", url: "/compare" },
      { name: "Custom Comparison", url: "/compare/custom" },
    ];

    return (
      <main id="main-content" className="min-h-screen pb-20 bg-background text-text-light">
        <BreadcrumbJsonLd crumbs={crumbs} />
        <div className="container mx-auto px-4 md:px-6 pt-6">
          <Breadcrumbs crumbs={crumbs} />
        </div>

        <div className="container mx-auto px-4 md:px-6 pt-12 max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-2 block">
              Head-to-Head Comparison Builder
            </span>
            <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-4">
              Compare Any Two Vehicles
            </h1>
            <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto mb-6">
              Select two vehicles below to generate an instant head-to-head spec breakdown, acceleration telemetry, WLTP efficiency, and pricing comparison.
            </p>
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-border-custom hover:border-accent text-sm font-semibold text-text-light transition-colors"
            >
              Browse All Vehicles &rarr;
            </Link>
          </div>

          <CompareBuilder vehicles={allVehicles} initialCarA={carA?.slug || slugA || ""} />
        </div>
      </main>
    );
  }

  const [canonicalA, canonicalB] = [slugA, slugB].sort();

  // Synthesize complete spec comparison matrix
  const specs = [
    { label: "0-100 km/h", carA: `${carA.specs.acceleration060}s`, carB: `${carB.specs.acceleration060}s` },
    { label: "Power Output", carA: `${carA.specs.powerHp} hp`, carB: `${carB.specs.powerHp} hp` },
    { label: "Torque", carA: `${carA.specs.torqueNm} Nm`, carB: `${carB.specs.torqueNm} Nm` },
    { label: "Top Speed", carA: `${carA.specs.topSpeedKmh} km/h`, carB: `${carB.specs.topSpeedKmh} km/h` },
    {
      label: "WLTP Range",
      carA: carA.evSpecs?.rangeKm ? `${carA.evSpecs.rangeKm} km` : "N/A (ICE/Hybrid)",
      carB: carB.evSpecs?.rangeKm ? `${carB.evSpecs.rangeKm} km` : "N/A (ICE/Hybrid)",
    },
    {
      label: "Battery Capacity",
      carA: carA.evSpecs?.batteryKwh ? `${carA.evSpecs.batteryKwh} kWh` : "N/A",
      carB: carB.evSpecs?.batteryKwh ? `${carB.evSpecs.batteryKwh} kWh` : "N/A",
    },
    {
      label: "10-80% DC Fast Charge",
      carA: carA.evSpecs?.chargingTime1080 || "N/A",
      carB: carB.evSpecs?.chargingTime1080 || "N/A",
    },
    {
      label: "Drivetrain",
      carA: carA.specs.drivetrain || "AWD",
      carB: carB.specs.drivetrain || "AWD",
    },
    {
      label: "Curb Weight",
      carA: `${carA.specs.weightKg} kg`,
      carB: `${carB.specs.weightKg} kg`,
    },
    {
      label: "Cargo Volume",
      carA: `${carA.specs.cargoLiters} L`,
      carB: `${carB.specs.cargoLiters} L`,
    },
    {
      label: "Starting Price (EUR)",
      carA: `€${carA.priceEur.toLocaleString()}`,
      carB: `€${carB.priceEur.toLocaleString()}`,
    },
  ];

  const customComparison: ComparisonData = {
    id: `custom-${carA.slug}-${carB.slug}`,
    slug: `custom?a=${canonicalA}&b=${canonicalB}`,
    tagline: `Instrumented head-to-head showdown: ${carA.make} ${carA.model} vs ${carB.make} ${carB.model}`,
    carA: {
      name: `${carA.make} ${carA.model}`,
      slug: carA.slug,
      gradient: carA.coverGradient,
    },
    carB: {
      name: `${carB.make} ${carB.model}`,
      slug: carB.slug,
      gradient: carB.coverGradient,
    },
    specs,
  };

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Compare", url: "/compare" },
    { name: `${carA.model} vs ${carB.model}`, url: `/compare/custom?a=${canonicalA}&b=${canonicalB}` },
  ];

  return (
    <main id="main-content" className="min-h-screen pb-20 bg-background text-text-light">
      <BreadcrumbJsonLd crumbs={crumbs} />
      <div className="container mx-auto px-4 md:px-6 pt-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      {/* Split Hero */}
      <div className="flex flex-col md:flex-row min-h-[40vh] border-b border-border-custom relative overflow-hidden">
        {/* VS Badge */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-surface border-4 border-background rounded-full z-20 flex items-center justify-center shadow-2xl hidden md:flex"
          aria-hidden="true"
        >
          <span className="font-heading font-black text-accent text-2xl italic">VS</span>
        </div>

        {/* Car A Hero */}
        <div
          className="flex-1 relative flex flex-col justify-end p-8 lg:p-16 min-h-[30vh]"
          style={{ background: `linear-gradient(to bottom, ${carA.coverGradient.from}40, ${carA.coverGradient.to}10)` }}
        >
          {carA.coverImage && (
            <div className="absolute inset-0 z-0 overflow-hidden mix-blend-overlay opacity-40">
              <Image src={carA.coverImage} alt={`${carA.make} ${carA.model}`} fill priority sizes="50vw" className="object-cover" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-0" aria-hidden="true" />
          <div className="relative z-10 md:text-right">
            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-2 block">{carA.make}</span>
            <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white drop-shadow-lg">{carA.model}</h1>
          </div>
        </div>

        {/* Car B Hero */}
        <div
          className="flex-1 relative flex flex-col justify-end p-8 lg:p-16 min-h-[30vh]"
          style={{ background: `linear-gradient(to bottom, ${carB.coverGradient.from}40, ${carB.coverGradient.to}10)` }}
        >
          {carB.coverImage && (
            <div className="absolute inset-0 z-0 overflow-hidden mix-blend-overlay opacity-40">
              <Image src={carB.coverImage} alt={`${carB.make} ${carB.model}`} fill priority sizes="50vw" className="object-cover" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-0" aria-hidden="true" />
          <div className="relative z-10">
            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-2 block">{carB.make}</span>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white drop-shadow-lg">{carB.model}</h2>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-12 text-center max-w-3xl">
        <p className="text-xl md:text-2xl font-medium text-text-muted italic">&ldquo;{customComparison.tagline}&rdquo;</p>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <CompareSpecs comparison={customComparison} />
      </div>
    </main>
  );
}
