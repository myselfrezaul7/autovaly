import { getVehicleBySlug } from "@/lib/content";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import CompareSpecs from "@/components/CompareSpecs";
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

  const title = `${carA.make} ${carA.model} vs ${carB.make} ${carB.model}`;
  const description = `Compare the ${carA.make} ${carA.model} against the ${carB.make} ${carB.model}. Detailed head-to-head specs, performance, and telemetry.`;

  return {
    title,
    description,
    robots: { index: false, follow: true },
    openGraph: {
      type: "article",
      title: `${title} | Autovaly`,
      description,
      url: `https://autovaly.com/compare/custom?a=${slugA}&b=${slugB}`,
      images: carA.coverImage ? [{ url: carA.coverImage, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Autovaly`,
      description,
      images: carA.coverImage ? [carA.coverImage] : [],
    },
    alternates: { canonical: `/compare/custom?a=${slugA}&b=${slugB}` },
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

  if (!slugA || !slugB) {
    notFound();
  }

  const carA = getVehicleBySlug(slugA);
  const carB = getVehicleBySlug(slugB);

  if (!carA || !carB) {
    notFound();
  }

  const customComparison: ComparisonData = {
    id: `custom-${carA.slug}-${carB.slug}`,
    slug: `custom?a=${slugA}&b=${slugB}`,
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
    specs: [
      { label: "0-100 km/h", carA: `${carA.specs.acceleration060}s`, carB: `${carB.specs.acceleration060}s` },
      { label: "Power", carA: `${carA.specs.powerHp} hp`, carB: `${carB.specs.powerHp} hp` },
      { label: "Top Speed", carA: `${carA.specs.topSpeedKmh} km/h`, carB: `${carB.specs.topSpeedKmh} km/h` },
    ],
  };

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Compare", url: "/compare" },
    { name: `${carA.model} vs ${carB.model}`, url: `/compare/custom?a=${slugA}&b=${slugB}` },
  ];

  return (
    <article className="min-h-screen pb-20 bg-background text-text-light">
      <BreadcrumbJsonLd crumbs={crumbs} />
      <div className="container mx-auto px-4 md:px-6 pt-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      {/* Split Hero */}
      <div className="flex flex-col md:flex-row min-h-[40vh] border-b border-border-custom relative overflow-hidden">
        {/* VS Badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-surface border-4 border-background rounded-full z-20 flex items-center justify-center shadow-2xl hidden md:flex">
          <span className="font-heading font-black text-accent text-2xl italic">VS</span>
        </div>

        {/* Car A Hero */}
        <div
          className="flex-1 relative flex flex-col justify-end p-8 lg:p-16 min-h-[30vh]"
          style={{ background: `linear-gradient(to bottom, ${carA.coverGradient.from}40, ${carA.coverGradient.to}10)` }}
        >
          {carA.coverImage && (
            <div className="absolute inset-0 z-0 overflow-hidden mix-blend-overlay opacity-40">
              <Image src={carA.coverImage} alt={carA.model} fill priority sizes="50vw" className="object-cover" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-0" />
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
              <Image src={carB.coverImage} alt={carB.model} fill priority sizes="50vw" className="object-cover" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-0" />
          <div className="relative z-10">
            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-2 block">{carB.make}</span>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white drop-shadow-lg">{carB.model}</h2>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-10 text-center max-w-3xl">
        <p className="text-lg md:text-xl font-medium text-text-muted italic">
          &quot;Head-to-head telemetry showdown between {carA.make} {carA.model} and {carB.make} {carB.model}.&quot;
        </p>
      </div>

      {/* Unified Animated CompareSpecs Matrix */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <CompareSpecs comparison={customComparison} />
      </div>
    </article>
  );
}
