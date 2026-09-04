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
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCompare = () => {
    if (!carA || !carB) {
      setError("Please select two vehicles to compare.");
      return;
    }
    if (carA === carB) {
      setError("Please select two different vehicles.");
      return;
    }
    setError("");
    router.push(`/compare/custom?a=${carA}&b=${carB}`);
  };

  return (
    <div className="max-w-4xl mx-auto mb-16 p-8 bg-surface border border-border-custom rounded-2xl shadow-card-shadow">
      <h2 className="text-2xl font-bold font-heading mb-6 text-center">Build Your Own Comparison</h2>
      
      {error && (
        <div role="alert" className="mb-6 p-3 rounded-xl bg-accent/10 border border-accent/30 text-accent text-sm text-center font-medium">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="w-full flex-1">
          <select 
            value={carA}
            onChange={(e) => { setCarA(e.target.value); setError(""); }}
            aria-label="Select first vehicle"
            className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 text-text-light outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/40 transition-all">
            <option value="">Select Car 1</option>
            {vehicles.map(v => <option key={v.id} value={v.slug}>{v.make} {v.model}</option>)}
          </select>
        </div>
        <button 
          onClick={() => { const temp = carA; setCarA(carB); setCarB(temp); setError(""); }}
          className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-accent/10 text-accent rounded-full font-bold touch-press transition-transform hover:rotate-180 duration-500 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent/40"
          aria-label="Swap vehicles"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M4 21h5v-5"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
        </button>
        <div className="w-full flex-1">
          <select 
            value={carB}
            onChange={(e) => { setCarB(e.target.value); setError(""); }}
            aria-label="Select second vehicle"
            className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 text-text-light outline-none focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/40 transition-all">
            <option value="">Select Car 2</option>
            {vehicles.map(v => <option key={v.id} value={v.slug}>{v.make} {v.model}</option>)}
          </select>
        </div>
        <button 
          onClick={handleCompare}
          className="w-full md:w-auto px-8 py-3 bg-accent hover:bg-accent-dark text-white font-bold rounded-xl uppercase tracking-wider text-sm transition-colors touch-press cursor-pointer focus-visible:ring-2 focus-visible:ring-accent/40">
          Compare
        </button>
      </div>
    </div>
  );
}
