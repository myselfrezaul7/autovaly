import { comparisons } from "@/lib/data/comparisons";
import Link from "next/link";
import { Metadata } from "next";
import { getAllVehicles } from "@/lib/content";

export const metadata: Metadata = {
  title: "Compare Vehicles",
  description: "Compare electric, hybrid, and gas vehicles side-by-side to find your perfect match.",
};

export default function CompareIndexPage() {
  const vehicles = getAllVehicles();
  
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20 min-h-[70vh]">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight mb-6">
          Head-to-Head Comparisons
        </h1>
        <p className="text-xl text-muted max-w-2xl mx-auto">
          We pit the industry's most important cars against each other. Range, performance, price—see how they stack up.
        </p>
      </div>

      <div className="max-w-4xl mx-auto mb-16 p-8 bg-surface border border-border-custom rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold font-heading mb-6 text-center">Build Your Own Comparison</h2>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-full flex-1">
            <select className="w-full bg-background border border-border-custom rounded-md px-4 py-3 text-text-light outline-none focus:border-accent">
              <option value="">Select Car 1</option>
              {vehicles.map(v => <option key={v.id} value={v.slug}>{v.make} {v.model}</option>)}
            </select>
          </div>
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-accent/10 text-accent rounded-full font-bold">
            VS
          </div>
          <div className="w-full flex-1">
            <select className="w-full bg-background border border-border-custom rounded-md px-4 py-3 text-text-light outline-none focus:border-accent">
              <option value="">Select Car 2</option>
              {vehicles.map(v => <option key={v.id} value={v.slug}>{v.make} {v.model}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button className="bg-accent text-white font-bold uppercase tracking-wide text-sm px-8 py-3 rounded hover:bg-accent-dark transition-colors">
            Compare Now
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-heading font-bold mb-8">Popular Matchups</h2>
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
                <div className="w-12 bg-background flex items-center justify-center z-10 -mx-6 transform skew-x-[-15deg] border-x border-border-custom">
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
                <p className="text-text-muted text-sm italic">"{comp.tagline}"</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
