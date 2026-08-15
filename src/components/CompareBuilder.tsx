"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Vehicle } from "@/lib/types";

export default function CompareBuilder({
  vehicles,
  initialCarA = "",
}: {
  vehicles: Vehicle[];
  initialCarA?: string;
}) {
  const [carA, setCarA] = useState(initialCarA);
  const [carB, setCarB] = useState("");
  const router = useRouter();

  const handleCompare = () => {
    if (carA && carB) {
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
        <button 
          onClick={() => { const temp = carA; setCarA(carB); setCarB(temp); }}
          className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-accent/10 text-accent rounded-full font-bold touch-press transition-transform hover:rotate-180 duration-500 cursor-pointer"
          aria-label="Swap vehicles"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M4 21h5v-5"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
        </button>
        <div className="w-full flex-1">
          <select 
            value={carB}
            onChange={(e) => setCarB(e.target.value)}
            className="w-full bg-background border border-border-custom rounded-md px-4 py-3 text-text-light outline-none focus:border-accent">
            <option value="">Select Car 2</option>
            {vehicles.map(v => <option key={v.id} value={v.slug}>{v.make} {v.model}</option>)}
          </select>
        </div>
        <button 
          onClick={handleCompare}
          className="w-full md:w-auto px-8 py-3 bg-accent hover:bg-accent-dark text-white font-bold rounded-md uppercase tracking-wider text-sm transition-colors touch-press cursor-pointer">
          Compare
        </button>
      </div>
    </div>
  );
}
