import { getVehicleBySlug, getAllVehicles } from "@/lib/content";
import { notFound } from "next/navigation";
import Price from "@/components/ui/Price";
import Link from "next/link";
import { Metadata } from "next";

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

  return {
    title: `${vehicle.make} ${vehicle.model} Specs & Review`,
    description: `Detailed specifications, pricing, and pros/cons for the ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}.`,
  };
}

import TrackView from "@/components/TrackView";

export default async function VehicleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const vehicle = getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  return (
    <article className="min-h-screen">
      <TrackView vehicle={vehicle} />
      {/* Hero Section */}
      <div 
        className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 md:px-6 flex items-end border-b border-border-custom"
        style={{ background: `linear-gradient(to bottom, ${vehicle.coverGradient.from}40, ${vehicle.coverGradient.to}10)` }}
      >
        {vehicle.coverImage && (
          <div className="absolute inset-0 z-0 overflow-hidden mix-blend-overlay opacity-30">
            <img src={vehicle.coverImage} alt={vehicle.model} className="w-full h-full object-cover" />
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

            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <Price eurAmount={vehicle.priceEur} usdAmount={vehicle.priceUsd} className="text-3xl font-bold font-heading" />
              
              <Link 
                href={`/compare?a=${vehicle.slug}`}
                className="inline-flex items-center justify-center px-6 py-3 bg-surface border border-border-custom rounded-md font-bold text-sm hover:border-accent hover:text-accent transition-colors"
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

            {/* Performance Specs */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-accent rounded-full inline-block"></span>
                Performance
              </h2>
              <div className="bg-surface rounded-xl border border-border-custom overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-b border-border-custom">
                      <td className="py-4 px-6 text-muted font-medium w-1/3">Horsepower</td>
                      <td className="py-4 px-6 font-bold">{vehicle.specs.powerHp} hp</td>
                    </tr>
                    <tr className="border-b border-border-custom">
                      <td className="py-4 px-6 text-muted font-medium">Torque</td>
                      <td className="py-4 px-6 font-bold">{vehicle.specs.torqueNm} Nm</td>
                    </tr>
                    <tr className="border-b border-border-custom">
                      <td className="py-4 px-6 text-muted font-medium">0-100 km/h</td>
                      <td className="py-4 px-6 font-bold">{vehicle.specs.acceleration060} s</td>
                    </tr>
                    <tr className="border-b border-border-custom">
                      <td className="py-4 px-6 text-muted font-medium">Top Speed</td>
                      <td className="py-4 px-6 font-bold">{vehicle.specs.topSpeedKmh} km/h</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 text-muted font-medium">Drivetrain</td>
                      <td className="py-4 px-6 font-bold">{vehicle.specs.drivetrain}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* EV Specs (if applicable) */}
            {vehicle.evSpecs && (
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-1 bg-accent rounded-full inline-block"></span>
                  Battery & Charging
                </h2>
                <div className="bg-surface rounded-xl border border-border-custom overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-border-custom">
                        <td className="py-4 px-6 text-muted font-medium w-1/3">Range (WLTP)</td>
                        <td className="py-4 px-6 font-bold">{vehicle.evSpecs.rangeKm} km</td>
                      </tr>
                      <tr className="border-b border-border-custom">
                        <td className="py-4 px-6 text-muted font-medium">Range (EPA)</td>
                        <td className="py-4 px-6 font-bold">{vehicle.evSpecs.rangeMiles} mi</td>
                      </tr>
                      <tr className="border-b border-border-custom">
                        <td className="py-4 px-6 text-muted font-medium">Battery Capacity</td>
                        <td className="py-4 px-6 font-bold">{vehicle.evSpecs.batteryKwh} kWh</td>
                      </tr>
                      <tr className="border-b border-border-custom">
                        <td className="py-4 px-6 text-muted font-medium">Max DC Charging</td>
                        <td className="py-4 px-6 font-bold">{vehicle.evSpecs.chargingSpeedKw} kW</td>
                      </tr>
                      <tr className="border-b border-border-custom">
                        <td className="py-4 px-6 text-muted font-medium">Fast Charge (10-80%)</td>
                        <td className="py-4 px-6 font-bold">{vehicle.evSpecs.chargingTime1080}</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-6 text-muted font-medium">Efficiency</td>
                        <td className="py-4 px-6 font-bold">{vehicle.evSpecs.efficiency}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            )}

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
    </article>
  );
}
