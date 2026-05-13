"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Vehicle } from "@/lib/types";

export default function CompareBuilder({ vehicles }: { vehicles: Vehicle[] }) {
  const [carA, setCarA] = useState("");
  const [carB, setCarB] = useState("");
  const router = useRouter();

  const handleCompare = () => {
    if (carA && carB) {
      // Just redirect to the comparison page with slugs in query params or a dynamic route
      // We'll use a dynamic query parameter for now, e.g. /compare/custom?a=slug1&b=slug2
      router.push(`/compare/custom?a=${carA}&b=${carB}`);
    } else {
      alert("Please select two different vehicles to compare.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mb-16 p-8 bg-surface border border-border-custom rounded-xl shadow-card-shadow">
      <h2 className="text-2xl font-bold font-heading mb-6 text-center">Build Your Own Comparison</h2>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full flex-1">
          <select 
            value={carA}
            onChange={(e) => setCarA(e.target.value)}
            className="w-full bg-background border border-border-custom rounded-md px-4 py-3 text-text-light outline-none focus:border-accent">
            <option value="">Select Car 1</option>
            {vehicles.map(v => <option key={v.id} value={v.slug}>{v.make} {v.model}</option>)}
          </select>
        </div>
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-accent/10 text-accent rounded-full font-bold">
          VS
        </div>
        <div className="w-full flex-1">
          <select 
            value={carB}
            onChange={(e) => setCarB(e.target.value)}
            className="w-full bg-background border border-border-custom rounded-md px-4 py-3 text-text-light outline-none focus:border-accent">
            <option value="">Select Car 2</option>
            {vehicles.map(v => <option key={v.id} value={v.slug} disabled={v.slug === carA}>{v.make} {v.model}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-6 text-center">
        <button 
          onClick={handleCompare}
          className="bg-accent text-white font-bold uppercase tracking-wide text-sm px-8 py-3 rounded hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!carA || !carB || carA === carB}
        >
          Compare Now
        </button>
      </div>
    </div>
  );
}
