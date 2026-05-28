import { getVehicleBySlug } from "@/lib/content";
import { notFound } from "next/navigation";
import Price from "@/components/ui/Price";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ a?: string, b?: string }> }): Promise<Metadata> {
  const { a, b } = await searchParams;
  if (!a || !b) return { title: "Custom Comparison | Autovaly" };

  const carA = getVehicleBySlug(a);
  const carB = getVehicleBySlug(b);

  if (!carA || !carB) return { title: "Custom Comparison | Autovaly" };

  const title = `${carA.make} ${carA.model} vs ${carB.make} ${carB.model} | Autovaly`;
  const description = `Compare the ${carA.make} ${carA.model} against the ${carB.make} ${carB.model}. Detailed head-to-head specs, performance, and features.`;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      url: `https://autovaly.com/compare/custom?a=${a}&b=${b}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: { canonical: `/compare/custom?a=${a}&b=${b}` },
  };
}

export default async function CustomComparisonPage({ searchParams }: { searchParams: Promise<{ a?: string, b?: string }> }) {
  const { a, b } = await searchParams;

  if (!a || !b) {
    notFound();
  }

  const carA = getVehicleBySlug(a);
  const carB = getVehicleBySlug(b);

  if (!carA || !carB) {
    notFound();
  }

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Compare", url: "/compare" },
    { name: `${carA.model} vs ${carB.model}`, url: `/compare/custom?a=${a}&b=${b}` }
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
          style={{ background: `linear-gradient(to bottom, ${carA.coverGradient.from}40, ${carA.coverGradient.to}10)` }}
        >
          {carA?.coverImage && (
            <div className="absolute inset-0 z-0 overflow-hidden mix-blend-overlay opacity-40">
              <Image src={carA.coverImage} alt={carA.model} fill priority sizes="50vw" className="object-cover" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-0" />
          <div className="relative z-10 md:text-right">
            <span className="text-accent font-bold uppercase tracking-widest text-sm mb-2 block">{carA.make}</span>
            <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white drop-shadow-lg">{carA.model}</h1>
          </div>
        </div>

        {/* Car B Hero */}
        <div 
          className="flex-1 relative flex flex-col justify-end p-8 lg:p-16 min-h-[30vh]"
          style={{ background: `linear-gradient(to bottom, ${carB.coverGradient.from}40, ${carB.coverGradient.to}10)` }}
        >
          {carB?.coverImage && (
            <div className="absolute inset-0 z-0 overflow-hidden mix-blend-overlay opacity-40">
              <Image src={carB.coverImage} alt={carB.model} fill priority sizes="50vw" className="object-cover" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-0" />
          <div className="relative z-10">
            <span className="text-accent font-bold uppercase tracking-widest text-sm mb-2 block">{carB.make}</span>
            <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white drop-shadow-lg">{carB.model}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-12 text-center max-w-3xl">
        <p className="text-xl md:text-2xl font-medium text-muted italic">"Head-to-head comparison between {carA.make} {carA.model} and {carB.make} {carB.model}."</p>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="max-w-5xl mx-auto bg-surface border border-border-custom rounded-xl overflow-hidden shadow-2xl">
          
          {/* Header Row */}
          <div className="grid grid-cols-3 border-b-2 border-border-custom bg-background/90 backdrop-blur-md sticky top-[60px] md:top-[72px] z-30 shadow-sm">
            <div className="p-4 md:p-6 text-center font-bold text-muted uppercase tracking-widest text-xs">Spec</div>
            <div className="p-4 md:p-6 text-center font-heading font-bold text-xl border-l border-border-custom text-text-light drop-shadow-md">{carA.model}</div>
            <div className="p-4 md:p-6 text-center font-heading font-bold text-xl border-l border-border-custom text-text-light drop-shadow-md">{carB.model}</div>
          </div>

          <div className="divide-y divide-border-custom">
            {/* Price */}
            <div className="grid grid-cols-3 hover:bg-background/50 transition-colors">
              <div className="p-4 md:p-6 font-medium text-sm text-text-muted flex items-center justify-center bg-background/50 border-r border-border-custom">Starting Price</div>
              <div className="p-4 md:p-6 text-center font-bold text-lg"><Price eurAmount={carA.priceEur} usdAmount={carA.priceUsd} /></div>
              <div className="p-4 md:p-6 text-center font-bold text-lg border-l border-border-custom"><Price eurAmount={carB.priceEur} usdAmount={carB.priceUsd} /></div>
            </div>

            {/* Power */}
            <div className="grid grid-cols-3 hover:bg-background/50 transition-colors">
              <div className="p-4 md:p-6 font-medium text-sm text-text-muted flex items-center justify-center bg-background/50 border-r border-border-custom">Horsepower</div>
              <div className="p-4 md:p-6 text-center font-bold text-lg">{carA.specs.powerHp} hp</div>
              <div className="p-4 md:p-6 text-center font-bold text-lg border-l border-border-custom">{carB.specs.powerHp} hp</div>
            </div>

            {/* 0-60 */}
            <div className="grid grid-cols-3 hover:bg-background/50 transition-colors">
              <div className="p-4 md:p-6 font-medium text-sm text-text-muted flex items-center justify-center bg-background/50 border-r border-border-custom">0-100 km/h</div>
              <div className="p-4 md:p-6 text-center font-bold text-lg">{carA.specs.acceleration060}s</div>
              <div className="p-4 md:p-6 text-center font-bold text-lg border-l border-border-custom">{carB.specs.acceleration060}s</div>
            </div>

            {/* Drivetrain */}
            <div className="grid grid-cols-3 hover:bg-background/50 transition-colors">
              <div className="p-4 md:p-6 font-medium text-sm text-text-muted flex items-center justify-center bg-background/50 border-r border-border-custom">Drivetrain</div>
              <div className="p-4 md:p-6 text-center font-bold text-lg">{carA.specs.drivetrain}</div>
              <div className="p-4 md:p-6 text-center font-bold text-lg border-l border-border-custom">{carB.specs.drivetrain}</div>
            </div>

            {/* EV specific */}
            {carA.evSpecs && carB.evSpecs && (
              <>
                <div className="grid grid-cols-3 hover:bg-background/50 transition-colors">
                  <div className="p-4 md:p-6 font-medium text-sm text-text-muted flex items-center justify-center bg-background/50 border-r border-border-custom">Range (WLTP)</div>
                  <div className="p-4 md:p-6 text-center font-bold text-lg">{carA.evSpecs.rangeKm} km</div>
                  <div className="p-4 md:p-6 text-center font-bold text-lg border-l border-border-custom">{carB.evSpecs.rangeKm} km</div>
                </div>
                <div className="grid grid-cols-3 hover:bg-background/50 transition-colors">
                  <div className="p-4 md:p-6 font-medium text-sm text-text-muted flex items-center justify-center bg-background/50 border-r border-border-custom">Battery</div>
                  <div className="p-4 md:p-6 text-center font-bold text-lg">{carA.evSpecs.batteryKwh} kWh</div>
                  <div className="p-4 md:p-6 text-center font-bold text-lg border-l border-border-custom">{carB.evSpecs.batteryKwh} kWh</div>
                </div>
              </>
            )}

            {/* Links */}
            <div className="grid grid-cols-3 bg-background">
              <div className="p-4 md:p-6 border-r border-border-custom"></div>
              <div className="p-4 md:p-6 text-center">
                <Link href={`/vehicles/${carA.slug}`} className="text-accent font-bold hover:underline">View {carA.make} →</Link>
              </div>
              <div className="p-4 md:p-6 text-center border-l border-border-custom">
                <Link href={`/vehicles/${carB.slug}`} className="text-accent font-bold hover:underline">View {carB.make} →</Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </article>
  );
}
