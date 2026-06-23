"use client";

import { m } from "framer-motion";
import { ComparisonData } from "@/lib/types";
import { getVehicleBySlug } from "@/lib/content";
import Price from "@/components/ui/Price";
import Link from "next/link";
import AnimatedCounter from "./ui/AnimatedCounter";
import { ReactNode } from "react";
import clsx from "clsx";

interface CompareSpecsProps {
  comparison: ComparisonData;
}

// Determines which value is "better" for highlighting
type Winner = "A" | "B" | "TIE" | "NONE";

function getWinner(valA: number, valB: number, lowerIsBetter = false): Winner {
  if (valA === valB) return "TIE";
  if (lowerIsBetter) return valA < valB ? "A" : "B";
  return valA > valB ? "A" : "B";
}

// High-tech SpecBar with glowing laser fill
function SpecBar({ valueA, valueB, winner, suffix = "" }: { valueA: number; valueB: number; winner: Winner; suffix?: string }) {
  const max = Math.max(valueA, valueB);
  // Avoid division by zero
  const percentA = max > 0 ? (valueA / max) * 100 : 0;
  const percentB = max > 0 ? (valueB / max) * 100 : 0;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-between items-end">
        <span className={clsx("font-bold text-lg transition-colors", winner === "A" ? "text-accent drop-shadow-[0_0_8px_rgba(var(--color-accent),0.5)]" : "text-text-light")}>
          <AnimatedCounter value={valueA} />{suffix}
        </span>
        <span className={clsx("font-bold text-lg transition-colors", winner === "B" ? "text-accent drop-shadow-[0_0_8px_rgba(var(--color-accent),0.5)]" : "text-text-light")}>
          <AnimatedCounter value={valueB} />{suffix}
        </span>
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex-1 h-2 bg-background/50 rounded-full overflow-hidden flex justify-end shadow-inner relative">
          <m.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${percentA}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className={clsx("h-full relative", winner === "A" ? "bg-accent shadow-[0_0_12px_var(--color-accent)]" : "bg-text-muted/50")}
          >
            {winner === "A" && <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay" />}
          </m.div>
        </div>
        <div className="flex-1 h-2 bg-background/50 rounded-full overflow-hidden relative shadow-inner">
          <m.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${percentB}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className={clsx("h-full relative", winner === "B" ? "bg-accent shadow-[0_0_12px_var(--color-accent)]" : "bg-text-muted/50")}
          >
            {winner === "B" && <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay" />}
          </m.div>
        </div>
      </div>
    </div>
  );
}

// Reverse SpecBar for things like 0-60 time, weight
function SpecBarReverse({ valueA, valueB, winner, suffix = "" }: { valueA: number; valueB: number; winner: Winner; suffix?: string }) {
  const min = Math.min(valueA, valueB);
  const percentA = valueA > 0 ? (min / valueA) * 100 : 0;
  const percentB = valueB > 0 ? (min / valueB) * 100 : 0;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-between items-end">
        <span className={clsx("font-bold text-lg transition-colors", winner === "A" ? "text-accent drop-shadow-[0_0_8px_rgba(var(--color-accent),0.5)]" : "text-text-light")}>
          <AnimatedCounter value={valueA} duration={1} />{suffix}
        </span>
        <span className={clsx("font-bold text-lg transition-colors", winner === "B" ? "text-accent drop-shadow-[0_0_8px_rgba(var(--color-accent),0.5)]" : "text-text-light")}>
          <AnimatedCounter value={valueB} duration={1} />{suffix}
        </span>
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex-1 h-2 bg-background/50 rounded-full overflow-hidden flex justify-end shadow-inner relative">
          <m.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${percentA}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className={clsx("h-full relative", winner === "A" ? "bg-accent shadow-[0_0_12px_var(--color-accent)]" : "bg-text-muted/50")}
          >
            {winner === "A" && <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay" />}
          </m.div>
        </div>
        <div className="flex-1 h-2 bg-background/50 rounded-full overflow-hidden relative shadow-inner">
          <m.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${percentB}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className={clsx("h-full relative", winner === "B" ? "bg-accent shadow-[0_0_12px_var(--color-accent)]" : "bg-text-muted/50")}
          >
            {winner === "B" && <div className="absolute inset-0 bg-white/20 animate-pulse mix-blend-overlay" />}
          </m.div>
        </div>
      </div>
    </div>
  );
}

// Category Header
function CategoryHeader({ title }: { title: string }) {
  return (
    <div className="col-span-3 sticky top-16 md:top-20 z-10 bg-surface/80 backdrop-blur-md border-y border-accent/20 py-3 px-4 md:px-6 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <h3 className="font-heading font-black text-xl md:text-2xl tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-accent to-blue-500">
        {title}
      </h3>
    </div>
  );
}

// Generic Spec Row
function SpecRow({ label, children, isHoverable = true }: { label: string; children: ReactNode; isHoverable?: boolean }) {
  return (
    <div className={clsx("grid grid-cols-3 items-center border-b border-border-custom last:border-b-0 transition-colors group", isHoverable && "hover:bg-accent/5")}>
      <div className="p-4 md:p-6 font-medium text-xs md:text-sm text-text-muted flex items-center justify-center bg-background/30 border-r border-border-custom h-full uppercase tracking-widest group-hover:text-text-light transition-colors">
        {label}
      </div>
      {children}
    </div>
  );
}

// Text Spec Row
function TextSpecRow({ label, valA, valB }: { label: string; valA: string | ReactNode; valB: string | ReactNode }) {
  return (
    <SpecRow label={label}>
      <div className="p-4 md:p-6 text-center font-bold text-lg text-text-light">{valA}</div>
      <div className="p-4 md:p-6 text-center font-bold text-lg text-text-light border-l border-border-custom">{valB}</div>
    </SpecRow>
  );
}

export default function CompareSpecs({ comparison }: CompareSpecsProps) {
  const carA = comparison.carA.slug ? getVehicleBySlug(comparison.carA.slug) : null;
  const carB = comparison.carB.slug ? getVehicleBySlug(comparison.carB.slug) : null;

  if (!carA || !carB) return null;

  const isEV = carA.evSpecs && carB.evSpecs;

  return (
    <div className="max-w-5xl mx-auto bg-surface/40 backdrop-blur-sm border border-border-custom rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
      
      {/* Sticky Header Row */}
      <div className="grid grid-cols-3 border-b-2 border-accent/30 bg-surface/90 backdrop-blur-lg sticky top-0 z-20 shadow-md">
        <div className="p-4 md:p-6 flex items-center justify-center font-bold text-accent uppercase tracking-widest text-xs">Spec Matrix</div>
        <div className="p-4 md:p-6 text-center font-heading font-black text-2xl border-l border-border-custom">{carA.model}</div>
        <div className="p-4 md:p-6 text-center font-heading font-black text-2xl border-l border-border-custom">{carB.model}</div>
      </div>

      <div className="flex flex-col">
        {/* === POWERTRAIN === */}
        <CategoryHeader title="Powertrain & Performance" />
        
        <SpecRow label="Starting Price">
          <div className="p-4 md:p-6 text-center font-bold text-xl"><Price eurAmount={carA.priceEur} usdAmount={carA.priceUsd} /></div>
          <div className="p-4 md:p-6 text-center font-bold text-xl border-l border-border-custom"><Price eurAmount={carB.priceEur} usdAmount={carB.priceUsd} /></div>
        </SpecRow>

        <SpecRow label="Horsepower">
          <div className="col-span-2 p-4 md:p-6">
            <SpecBar 
              valueA={carA.specs.powerHp || 0} 
              valueB={carB.specs.powerHp || 0} 
              winner={getWinner(carA.specs.powerHp, carB.specs.powerHp)} 
              suffix=" hp"
            />
          </div>
        </SpecRow>

        <SpecRow label="Torque">
          <div className="col-span-2 p-4 md:p-6">
            <SpecBar 
              valueA={carA.specs.torqueNm || 0} 
              valueB={carB.specs.torqueNm || 0} 
              winner={getWinner(carA.specs.torqueNm, carB.specs.torqueNm)} 
              suffix=" Nm"
            />
          </div>
        </SpecRow>

        <SpecRow label="0-100 km/h">
          <div className="col-span-2 p-4 md:p-6">
            <SpecBarReverse 
              valueA={carA.specs.acceleration060 || 0} 
              valueB={carB.specs.acceleration060 || 0} 
              winner={getWinner(carA.specs.acceleration060, carB.specs.acceleration060, true)} 
              suffix=" s"
            />
          </div>
        </SpecRow>

        <SpecRow label="Top Speed">
          <div className="col-span-2 p-4 md:p-6">
            <SpecBar 
              valueA={carA.specs.topSpeedKmh || 0} 
              valueB={carB.specs.topSpeedKmh || 0} 
              winner={getWinner(carA.specs.topSpeedKmh, carB.specs.topSpeedKmh)} 
              suffix=" km/h"
            />
          </div>
        </SpecRow>

        <TextSpecRow label="Drivetrain" valA={carA.specs.drivetrain} valB={carB.specs.drivetrain} />

        {/* === DIMENSIONS & CAPACITY === */}
        <CategoryHeader title="Dimensions & Capacity" />

        <SpecRow label="Weight (kg)">
          <div className="col-span-2 p-4 md:p-6">
            <SpecBarReverse 
              valueA={carA.specs.weightKg || 0} 
              valueB={carB.specs.weightKg || 0} 
              winner={getWinner(carA.specs.weightKg, carB.specs.weightKg, true)} 
              suffix=" kg"
            />
          </div>
        </SpecRow>

        <TextSpecRow 
          label="L / W / H (mm)" 
          valA={`${carA.specs.lengthMm || '-'} / ${carA.specs.widthMm || '-'} / ${carA.specs.heightMm || '-'}`} 
          valB={`${carB.specs.lengthMm || '-'} / ${carB.specs.widthMm || '-'} / ${carB.specs.heightMm || '-'}`} 
        />

        <TextSpecRow 
          label="Wheelbase (mm)" 
          valA={carA.specs.wheelbaseMm ? carA.specs.wheelbaseMm.toString() : "-"} 
          valB={carB.specs.wheelbaseMm ? carB.specs.wheelbaseMm.toString() : "-"} 
        />

        <SpecRow label="Cargo Volume">
          <div className="col-span-2 p-4 md:p-6">
            <SpecBar 
              valueA={carA.specs.cargoLiters || 0} 
              valueB={carB.specs.cargoLiters || 0} 
              winner={getWinner(carA.specs.cargoLiters, carB.specs.cargoLiters)} 
              suffix=" L"
            />
          </div>
        </SpecRow>

        <TextSpecRow 
          label="Seating" 
          valA={carA.specs.seatingCapacity?.toString() || "-"} 
          valB={carB.specs.seatingCapacity?.toString() || "-"} 
        />

        {/* === BATTERY MATRIX (IF EV) === */}
        {isEV && (
          <>
            <CategoryHeader title="Battery Matrix" />
            
            <SpecRow label="WLTP Range">
              <div className="col-span-2 p-4 md:p-6">
                <SpecBar 
                  valueA={carA.evSpecs!.rangeKm || 0} 
                  valueB={carB.evSpecs!.rangeKm || 0} 
                  winner={getWinner(carA.evSpecs!.rangeKm, carB.evSpecs!.rangeKm)} 
                  suffix=" km"
                />
              </div>
            </SpecRow>

            <SpecRow label="Battery Capacity">
              <div className="col-span-2 p-4 md:p-6">
                <SpecBar 
                  valueA={carA.evSpecs!.batteryKwh || 0} 
                  valueB={carB.evSpecs!.batteryKwh || 0} 
                  winner={getWinner(carA.evSpecs!.batteryKwh, carB.evSpecs!.batteryKwh)} 
                  suffix=" kWh"
                />
              </div>
            </SpecRow>

            <SpecRow label="Peak Charging">
              <div className="col-span-2 p-4 md:p-6">
                <SpecBar 
                  valueA={carA.evSpecs!.chargingSpeedKw || 0} 
                  valueB={carB.evSpecs!.chargingSpeedKw || 0} 
                  winner={getWinner(carA.evSpecs!.chargingSpeedKw, carB.evSpecs!.chargingSpeedKw)} 
                  suffix=" kW"
                />
              </div>
            </SpecRow>

            <TextSpecRow 
              label="Charge Time (10-80%)" 
              valA={carA.evSpecs!.chargingTime1080 || "-"} 
              valB={carB.evSpecs!.chargingTime1080 || "-"} 
            />

            <TextSpecRow 
              label="Efficiency" 
              valA={carA.evSpecs!.efficiency || "-"} 
              valB={carB.evSpecs!.efficiency || "-"} 
            />
          </>
        )}

        {/* Action Links */}
        <div className="grid grid-cols-3 bg-surface/90 backdrop-blur-md items-center border-t-2 border-accent/30 mt-4">
          <div className="p-4 md:p-6 border-r border-border-custom h-full flex items-center justify-center">
            <span className="text-muted text-xs uppercase tracking-widest font-bold">Discover More</span>
          </div>
          <div className="p-4 md:p-6 text-center">
            <Link href={`/vehicles/${carA.slug}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-accent/20 text-accent font-bold rounded-lg transition-all border border-accent/20 hover:border-accent shadow-[0_0_15px_rgba(var(--color-accent),0.1)] hover:shadow-[0_0_20px_rgba(var(--color-accent),0.4)] uppercase tracking-widest text-sm">
              View {carA.make}
            </Link>
          </div>
          <div className="p-4 md:p-6 text-center border-l border-border-custom">
            <Link href={`/vehicles/${carB.slug}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-accent/20 text-accent font-bold rounded-lg transition-all border border-accent/20 hover:border-accent shadow-[0_0_15px_rgba(var(--color-accent),0.1)] hover:shadow-[0_0_20px_rgba(var(--color-accent),0.4)] uppercase tracking-widest text-sm">
              View {carB.make}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
