import { comparisons } from "@/lib/data/comparisons";
import { getVehicleBySlug } from "@/lib/content";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import CompareSpecs from "@/components/CompareSpecs";

export async function generateStaticParams() {
  return comparisons.map((c) => ({
    slug: c.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const comparison = comparisons.find(c => c.slug === slug);

  if (!comparison) return { title: "Not Found" };

  const title = `${comparison.carA.name} vs ${comparison.carB.name} | Comparison`;
  const description = `Detailed comparison between ${comparison.carA.name} and ${comparison.carB.name}. ${comparison.tagline}`;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      url: `https://autovaly.com/compare/${comparison.slug}`
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: `/compare/${comparison.slug}` }
  };
}

export default async function ComparisonDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const comparison = comparisons.find(c => c.slug === slug);

  if (!comparison) {
    notFound();
  }

  const carA = comparison.carA.slug ? getVehicleBySlug(comparison.carA.slug) : null;
  const carB = comparison.carB.slug ? getVehicleBySlug(comparison.carB.slug) : null;

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Compare", url: "/compare" },
    { name: `${comparison.carA.name} vs ${comparison.carB.name}`, url: `/compare/${comparison.slug}` }
  ];

  return (
    <article className="min-h-screen pb-20">
      <BreadcrumbJsonLd crumbs={crumbs} />
      <div className="container mx-auto px-4 md:px-6 pt-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>
      {/* Split Hero */}
      <div className="flex flex-col md:flex-row min-h-[40vh] border-b border-border-custom relative">
        {/* VS Badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-surface border-4 border-background rounded-full z-20 flex items-center justify-center shadow-xl hidden md:flex">
          <span className="font-heading font-black text-accent text-2xl italic">VS</span>
        </div>

        {/* Car A Hero */}
        <div 
          className="flex-1 relative flex flex-col justify-end p-8 lg:p-16 min-h-[30vh]"
          style={{ background: `linear-gradient(to bottom, ${comparison.carA.gradient.from}40, ${comparison.carA.gradient.to}10)` }}
        >
          {carA?.coverImage && (
            <div className="absolute inset-0 z-0 overflow-hidden mix-blend-overlay opacity-40">
              <Image src={carA.coverImage} alt={carA.model} fill priority sizes="50vw" className="object-cover" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-0" />
          <div className="relative z-10 md:text-right">
            <span className="text-accent font-bold uppercase tracking-widest text-sm mb-2 block">{carA ? carA.make : ''}</span>
            <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white drop-shadow-lg">{comparison.carA.name}</h1>
          </div>
        </div>

        {/* Car B Hero */}
        <div 
          className="flex-1 relative flex flex-col justify-end p-8 lg:p-16 min-h-[30vh]"
          style={{ background: `linear-gradient(to bottom, ${comparison.carB.gradient.from}40, ${comparison.carB.gradient.to}10)` }}
        >
          {carB?.coverImage && (
            <div className="absolute inset-0 z-0 overflow-hidden mix-blend-overlay opacity-40">
              <Image src={carB.coverImage} alt={carB.model} fill priority sizes="50vw" className="object-cover" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-0" />
          <div className="relative z-10">
            <span className="text-accent font-bold uppercase tracking-widest text-sm mb-2 block">{carB ? carB.make : ''}</span>
            <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white drop-shadow-lg">{comparison.carB.name}</h2>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-12 text-center max-w-3xl">
        <p className="text-xl md:text-2xl font-medium text-muted italic">"{comparison.tagline}"</p>
      </div>

      {carA && carB && (
        <div className="container mx-auto px-4 md:px-6 py-16">
          <CompareSpecs comparison={comparison} />
        </div>
      )}

    </article>
  );
}
