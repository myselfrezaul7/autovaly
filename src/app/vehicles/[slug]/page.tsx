import { getVehicleBySlug, getAllVehicles, getAllArticles, getCategoryTagColor } from "@/lib/content";
import { notFound } from "next/navigation";
import Price from "@/components/ui/Price";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import VehicleJsonLd from "@/components/VehicleJsonLd";
import FAQJsonLd from "@/components/FAQJsonLd";
import TrackView from "@/components/TrackView";
import VehiclePerformance from "@/components/VehiclePerformance";
import GarageButton from "@/components/ui/GarageButton";

export async function generateStaticParams() {
  const vehicles = getAllVehicles();
  return vehicles.map((v) => ({
    slug: v.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug;
  const vehicle = getVehicleBySlug(slug);

  if (!vehicle) return { title: "Not Found" };

  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} — Specs, Price & Review`;
  const description = `Full specs and expert review of the ${vehicle.year} ${vehicle.make} ${vehicle.model}. ${vehicle.specs.powerHp}hp, ${vehicle.evSpecs?.rangeKm ? vehicle.evSpecs.rangeKm + 'km range, ' : ''}starting from €${vehicle.priceEur.toLocaleString()}. Autovaly verdict inside.`;

  return {
    title,
    description,
    openGraph: { 
      type: "article", 
      url: `https://autovaly.com/vehicles/${vehicle.slug}`,
      title,
      description,
      images: vehicle.coverImage ? [{ url: vehicle.coverImage, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: vehicle.coverImage ? [vehicle.coverImage] : [],
    },
    alternates: { canonical: `/vehicles/${vehicle.slug}` },
  };
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const vehicle = getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const allArticles = getAllArticles();
  const relatedArticles = allArticles.filter(a => a.segments.some(s => vehicle.segments.includes(s))).slice(0, 3);

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Vehicles", url: "/vehicles" },
    { name: `${vehicle.make} ${vehicle.model}`, url: `/vehicles/${vehicle.slug}` }
  ];

  const faqs = [
    {
      question: `What is the price of the ${vehicle.year} ${vehicle.make} ${vehicle.model}?`,
      answer: `The ${vehicle.year} ${vehicle.make} ${vehicle.model} starts at €${vehicle.priceEur.toLocaleString()} (or $${vehicle.priceUsd.toLocaleString()}).`
    },
    {
      question: `What is the horsepower of the ${vehicle.year} ${vehicle.make} ${vehicle.model}?`,
      answer: `It has ${vehicle.specs.powerHp} horsepower and can go from 0-100 km/h in ${vehicle.specs.acceleration060} seconds.`
    },
    ...(vehicle.evSpecs ? [{
      question: `What is the range of the ${vehicle.make} ${vehicle.model}?`,
      answer: `The ${vehicle.make} ${vehicle.model} has a WLTP range of ${vehicle.evSpecs.rangeKm} km and a battery capacity of ${vehicle.evSpecs.batteryKwh} kWh.`
    }] : []),
    {
      question: `What are the pros and cons of the ${vehicle.make} ${vehicle.model}?`,
      answer: `Pros: ${vehicle.prosAndCons.pros.join(', ')}. Cons: ${vehicle.prosAndCons.cons.join(', ')}.`
    }
  ];

  return (
    <article className="min-h-screen">
      <BreadcrumbJsonLd crumbs={crumbs} />
      <VehicleJsonLd vehicle={vehicle} />
      <FAQJsonLd faqs={faqs} />
      <TrackView vehicle={vehicle} />
      
      <div className="container mx-auto px-4 md:px-6 pt-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>
      {/* Hero Section */}
      <div 
        className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 md:px-6 flex items-end border-b border-border-custom"
        style={{ background: `linear-gradient(to bottom, ${vehicle.coverGradient.from}40, ${vehicle.coverGradient.to}10)` }}
      >
        {vehicle.coverImage && (
          <div className="absolute inset-0 z-0 overflow-hidden mix-blend-overlay opacity-30">
            <Image src={vehicle.coverImage} alt={vehicle.model} fill priority sizes="100vw" className="object-cover" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-0" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-accent/20 text-accent text-xs font-bold uppercase tracking-widest rounded">
                {vehicle.fuelType}
              </span>
              <span className="px-3 py-1 bg-surface border border-border-custom text-xs font-bold uppercase tracking-widest rounded">
                {vehicle.bodyStyle}
              </span>
              <span className="px-3 py-1 bg-surface border border-border-custom text-xs font-bold uppercase tracking-widest rounded">
                {vehicle.year}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight mb-4">
              <span className="block text-accent text-2xl md:text-3xl mb-2">{vehicle.make}</span>
              {vehicle.model}
            </h1>
            
            <p className="text-xl md:text-2xl text-muted font-medium mb-8">
              {vehicle.trim}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 fixed sm:static bottom-[60px] lg:bottom-auto left-0 right-0 z-40 bg-surface/90 sm:bg-transparent backdrop-blur-xl sm:backdrop-blur-none p-4 sm:p-0 border-t border-border-custom sm:border-0 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-0 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] sm:shadow-none transition-all">
              <Price eurAmount={vehicle.priceEur} usdAmount={vehicle.priceUsd} className="text-2xl sm:text-3xl font-bold font-heading tabular-nums" />
              
              <GarageButton vehicle={vehicle} />

              <Link 
                href={`/compare?a=${vehicle.slug}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-accent text-white sm:bg-surface sm:text-text-primary sm:border border-border-custom rounded-md font-bold text-sm hover:border-accent hover:text-accent transition-colors touch-press flex-1 sm:flex-none shadow-lg shadow-accent/20 sm:shadow-none"
              >
                Compare with another car
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Quick Highlights */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-accent rounded-full inline-block"></span>
                Key Highlights
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vehicle.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-surface p-4 rounded-lg border border-border-custom">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent flex-shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span className="font-medium text-sm">{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Performance and EV Specs */}
            <VehiclePerformance vehicle={vehicle} />

            {/* Dimensions */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-accent rounded-full inline-block"></span>
                Dimensions & Practicality
              </h2>
              <div className="bg-surface rounded-xl border border-border-custom overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-border-custom">
                      <td className="py-4 px-6 text-muted font-medium w-1/3">Weight</td>
                      <td className="py-4 px-6 font-bold">{vehicle.specs.weightKg} kg</td>
                    </tr>
                    <tr className="border-b border-border-custom">
                      <td className="py-4 px-6 text-muted font-medium">Length x Width x Height</td>
                      <td className="py-4 px-6 font-bold">{vehicle.specs.lengthMm} x {vehicle.specs.widthMm} x {vehicle.specs.heightMm} mm</td>
                    </tr>
                    <tr className="border-b border-border-custom">
                      <td className="py-4 px-6 text-muted font-medium">Wheelbase</td>
                      <td className="py-4 px-6 font-bold">{vehicle.specs.wheelbaseMm} mm</td>
                    </tr>
                    <tr className="border-b border-border-custom">
                      <td className="py-4 px-6 text-muted font-medium">Cargo Volume</td>
                      <td className="py-4 px-6 font-bold">{vehicle.specs.cargoLiters} L</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-muted font-medium">Seating</td>
                      <td className="py-4 px-6 font-bold">{vehicle.specs.seatingCapacity} Passengers</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-surface border border-border-custom rounded-xl p-6 sticky top-24">
              <h3 className="font-heading font-bold text-xl mb-6 text-center">Autovaly Verdict</h3>
              
              <div className="mb-6">
                <h4 className="flex items-center gap-2 text-sm font-bold text-green-500 mb-3 uppercase tracking-wider">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  The Good
                </h4>
                <ul className="space-y-2">
                  {vehicle.prosAndCons.pros.map((pro, i) => (
                    <li key={i} className="text-sm text-text-light flex items-start gap-2">
                      <span className="text-green-500 font-bold mt-0.5">•</span> {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-border-custom">
                <h4 className="flex items-center gap-2 text-sm font-bold text-red-500 mb-3 uppercase tracking-wider">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  The Bad
                </h4>
                <ul className="space-y-2">
                  {vehicle.prosAndCons.cons.map((con, i) => (
                    <li key={i} className="text-sm text-text-light flex items-start gap-2">
                      <span className="text-red-500 font-bold mt-0.5">•</span> {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {relatedArticles.length > 0 && (
        <section className="container mx-auto px-4 md:px-6 py-16 border-t border-border-custom">
          <h2 className="font-heading text-2xl uppercase tracking-wider pl-4 border-l-[5px] border-accent mb-8">Read More About This Segment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((a) => (
              <Link key={a.id} href={`/articles/${a.slug}`} className="group bg-surface border border-border-custom rounded-md overflow-hidden transition-all duration-300 hover:-translate-y-1">
                <div className="h-40 relative overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `linear-gradient(135deg, ${a.coverGradient.from}, ${a.coverGradient.to})` }} />
                </div>
                <div className="p-5">
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-widest rounded-sm mb-2 text-white px-2 py-0.5 ${getCategoryTagColor(a.category)}`}>{a.category}</span>
                  <h3 className="font-heading text-lg font-bold leading-tight group-hover:text-accent transition-colors">{a.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
