"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Price from "../ui/Price";
import type { Vehicle } from "@/lib/types";

export interface GarageVaultCanvasProps {
  garage: Vehicle[];
  selectedForCompare?: string[];
  onToggleCompare?: (slug: string) => void;
  onRemoveVehicle?: (id: string) => void;
}

interface UnderglowColor {
  id: string;
  name: string;
  hex: string;
}

const UNDERGLOW_PALETTE: UnderglowColor[] = [
  { id: "cyan", name: "Cyber Cyan", hex: "#00D2D3" },
  { id: "crimson", name: "Hyper Red", hex: "#E8232A" },
  { id: "amber", name: "Electric Amber", hex: "#F59E0B" },
  { id: "emerald", name: "Acid Lime", hex: "#10B981" },
  { id: "purple", name: "Ultraviolet", hex: "#A855F7" },
  { id: "ice", name: "Stealth Ice", hex: "#E2E8F0" },
];

export default function GarageVaultCanvas({
  garage,
  selectedForCompare = [],
  onToggleCompare,
  onRemoveVehicle,
}: GarageVaultCanvasProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [underglow, setUnderglow] = useState<UnderglowColor>(UNDERGLOW_PALETTE[0]);

  if (garage.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center bg-[#090b10] border border-border-custom rounded-3xl p-8">
        <div className="w-20 h-20 rounded-2xl bg-surface border border-border-custom flex items-center justify-center mb-4 text-3xl shadow-xl">
          🏎️
        </div>
        <h3 className="text-2xl font-bold font-heading text-white mb-2">
          Your Fleet is Empty
        </h3>
        <p className="text-text-muted text-sm max-w-sm mb-6">
          Bookmark vehicles while exploring reviews and comparisons to curate your private hypercar fleet here.
        </p>
        <Link
          href="/vehicles"
          className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
        >
          Explore All Vehicles
        </Link>
      </div>
    );
  }

  const currentVehicle = garage[activeIndex] || garage[0];
  const isSelectedForCompare = selectedForCompare.includes(currentVehicle.slug);

  return (
    <div className="w-full rounded-3xl bg-gradient-to-b from-[#0c0f17] via-[#07090e] to-[#0c0f17] border border-border-custom overflow-hidden shadow-2xl hardware-accelerated select-none">
      {/* Top Header Bar */}
      <div className="px-5 py-4 bg-surface/75 border-b border-border-custom flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏛️</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent">
                Executive Hypercar Showcase
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#00d2d3]">
                120Hz Fluidity
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-lg text-white">
              Bay {activeIndex + 1} of {garage.length}: {currentVehicle.make} {currentVehicle.model}
            </h3>
          </div>
        </div>

        {/* Ambient Underglow Palette */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-text-muted uppercase hidden sm:inline">
            Vault Lighting:
          </span>
          {UNDERGLOW_PALETTE.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setUnderglow(c)}
              title={c.name}
              className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                underglow.id === c.id ? "scale-125 border-white shadow-md" : "border-transparent opacity-60 hover:opacity-100"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      {/* Center Spotlight Bay */}
      <div className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#141824] via-[#090b10] to-[#05070a]">
        {/* Floor Reflections & Circular Turntable */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Dynamic Underglow Atmosphere */}
        <div
          className="absolute w-[75%] h-36 rounded-full blur-3xl opacity-40 transition-colors duration-500 pointer-events-none"
          style={{
            backgroundColor: underglow.hex,
            bottom: "8%",
          }}
        />

        {/* Turntable Pedestal Base */}
        <div
          className="absolute bottom-6 w-[85%] max-w-2xl h-10 rounded-[100%] border border-white/10 opacity-70"
          style={{
            boxShadow: `0 0 40px ${underglow.hex}44`,
          }}
        />

        {/* Vehicle Render */}
        <div className="relative z-10 w-[90%] sm:w-[82%] max-w-3xl h-[260px] sm:h-[320px] md:h-[360px] flex items-center justify-center">
          {currentVehicle.coverImage ? (
            <Image
              src={currentVehicle.coverImage}
              alt={`${currentVehicle.make} ${currentVehicle.model}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)] transition-all duration-300"
            />
          ) : (
            <span className="text-6xl">🏎️</span>
          )}
        </div>

        {/* Quick Carousel Prev/Next Buttons */}
        {garage.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev - 1 + garage.length) % garage.length)}
              className="absolute left-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 border border-white/15 text-white flex items-center justify-center text-lg backdrop-blur-md transition-all cursor-pointer active:scale-95"
              aria-label="Previous vehicle"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % garage.length)}
              className="absolute right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 border border-white/15 text-white flex items-center justify-center text-lg backdrop-blur-md transition-all cursor-pointer active:scale-95"
              aria-label="Next vehicle"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Fleet Thumbnail Selector Strip */}
      {garage.length > 1 && (
        <div className="px-5 py-3 bg-[#090b10] border-t border-border-custom flex items-center gap-3 overflow-x-auto hide-scrollbar">
          {garage.map((v, idx) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                activeIndex === idx
                  ? "bg-accent/15 border-accent text-white"
                  : "bg-surface/60 border-border-custom text-text-muted hover:text-white"
              }`}
            >
              <span className="text-xs font-mono font-bold">Bay {idx + 1}</span>
              <span className="text-xs font-heading font-extrabold">{v.make} {v.model}</span>
            </button>
          ))}
        </div>
      )}

      {/* Vehicle Telemetry & Action Footer */}
      <div className="p-5 sm:p-6 bg-surface/60 border-t border-border-custom flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Specs Readout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
          <div>
            <span className="text-text-muted block text-[10px] uppercase">0-100 KM/H</span>
            <span className="text-white font-extrabold text-sm sm:text-base">
              {currentVehicle.specs.acceleration060}s
            </span>
          </div>
          <div>
            <span className="text-text-muted block text-[10px] uppercase">HORSEPOWER</span>
            <span className="text-accent font-extrabold text-sm sm:text-base">
              {currentVehicle.specs.powerHp} HP
            </span>
          </div>
          <div>
            <span className="text-text-muted block text-[10px] uppercase">TOP SPEED</span>
            <span className="text-[#00d2d3] font-extrabold text-sm sm:text-base">
              {currentVehicle.specs.topSpeedKmh} km/h
            </span>
          </div>
          <div>
            <span className="text-text-muted block text-[10px] uppercase">STARTING MSRP</span>
            <span className="text-[#d4af37] font-extrabold text-sm sm:text-base">
              <Price eurAmount={currentVehicle.priceEur} usdAmount={currentVehicle.priceUsd} />
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {onToggleCompare && (
            <button
              type="button"
              onClick={() => onToggleCompare(currentVehicle.slug)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                isSelectedForCompare
                  ? "bg-[#00d2d3] border-[#00d2d3] text-black shadow-lg shadow-[#00d2d3]/20"
                  : "bg-surface border-border-custom text-white hover:border-accent"
              }`}
            >
              {isSelectedForCompare ? "✓ Staged for Compare" : "⚔️ Compare Vehicle"}
            </button>
          )}

          <Link
            href={`/vehicles/${currentVehicle.slug}`}
            className="px-4 py-2.5 bg-accent hover:bg-accent/90 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
          >
            Full Vehicle Dossier
          </Link>

          {onRemoveVehicle && (
            <button
              type="button"
              onClick={() => onRemoveVehicle(currentVehicle.id)}
              title="Remove from fleet"
              className="p-2.5 rounded-xl bg-surface border border-border-custom hover:border-red-500/50 text-text-muted hover:text-red-400 transition-all cursor-pointer"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
