"use client";

import { m } from "framer-motion";
import { ComparisonData } from "@/lib/types";
import { getVehicleBySlug } from "@/lib/content";
import Price from "@/components/ui/Price";
import Link from "next/link";
import AnimatedCounter from "./ui/AnimatedCounter";

interface CompareSpecsProps {
  comparison: ComparisonData;
}

function SpecBar({ valueA, valueB, format = (v: number) => v.toString() }: { valueA: number; valueB: number; format?: (v: number) => string }) {
  const max = Math.max(valueA, valueB);
  const percentA = (valueA / max) * 100;
  const percentB = (valueB / max) * 100;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-between items-end">
        <span className="font-bold text-lg"><AnimatedCounter value={valueA} /></span>
        <span className="font-bold text-lg"><AnimatedCounter value={valueB} /></span>
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex-1 h-1.5 bg-border-custom rounded-full overflow-hidden flex justify-end">
          <m.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${percentA}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className={`h-full ${valueA >= valueB ? "bg-accent" : "bg-text-muted"}`}
          />
        </div>
        <div className="flex-1 h-1.5 bg-border-custom rounded-full overflow-hidden">
          <m.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${percentB}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className={`h-full ${valueB >= valueA ? "bg-accent" : "bg-text-muted"}`}
          />
        </div>
      </div>
    </div>
  );
}

// Same as above, but lower is better (e.g. 0-60 time)
function SpecBarReverse({ valueA, valueB }: { valueA: number; valueB: number }) {
  const max = Math.max(valueA, valueB);
  const min = Math.min(valueA, valueB);
  
  // To make lower appear better, we map the bar length differently
  // Example: 3s vs 4s. 3 is better.
  const percentA = (min / valueA) * 100;
  const percentB = (min / valueB) * 100;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex justify-between items-end">
        <span className="font-bold text-lg"><AnimatedCounter value={valueA} duration={1} /></span>
        <span className="font-bold text-lg"><AnimatedCounter value={valueB} duration={1} /></span>
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex-1 h-1.5 bg-border-custom rounded-full overflow-hidden flex justify-end">
          <m.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${percentA}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className={`h-full ${valueA <= valueB ? "bg-accent" : "bg-text-muted"}`}
          />
        </div>
        <div className="flex-1 h-1.5 bg-border-custom rounded-full overflow-hidden">
          <m.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${percentB}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className={`h-full ${valueB <= valueA ? "bg-accent" : "bg-text-muted"}`}
          />
        </div>
      </div>
    </div>
  );
}

export default function CompareSpecs({ comparison }: CompareSpecsProps) {
  const carA = comparison.carA.slug ? getVehicleBySlug(comparison.carA.slug) : null;
  const carB = comparison.carB.slug ? getVehicleBySlug(comparison.carB.slug) : null;

  if (!carA || !carB) return null;

  return (
    <div className="max-w-5xl mx-auto bg-surface border border-border-custom rounded-xl overflow-hidden shadow-2xl">
      
      {/* Header Row */}
      <div className="grid grid-cols-3 border-b-2 border-border-custom bg-background">
        <div className="p-4 md:p-6 text-center font-bold text-muted uppercase tracking-widest text-xs">Spec</div>
        <div className="p-4 md:p-6 text-center font-heading font-bold text-xl border-l border-border-custom">{carA.model}</div>
        <div className="p-4 md:p-6 text-center font-heading font-bold text-xl border-l border-border-custom">{carB.model}</div>
      </div>

      <div className="divide-y divide-border-custom">
        {/* Price */}
        <div className="grid grid-cols-3 hover:bg-background/50 transition-colors items-center">
          <div className="p-4 md:p-6 font-medium text-sm text-text-muted flex items-center justify-center bg-background/50 border-r border-border-custom h-full">Starting Price</div>
          <div className="p-4 md:p-6 text-center font-bold text-lg"><Price eurAmount={carA.priceEur} usdAmount={carA.priceUsd} /></div>
          <div className="p-4 md:p-6 text-center font-bold text-lg border-l border-border-custom"><Price eurAmount={carB.priceEur} usdAmount={carB.priceUsd} /></div>
        </div>

        {/* Power */}
        <div className="grid grid-cols-3 hover:bg-background/50 transition-colors items-center">
          <div className="p-4 md:p-6 font-medium text-sm text-text-muted flex items-center justify-center bg-background/50 border-r border-border-custom h-full">Horsepower</div>
          <div className="col-span-2 p-4 md:p-6">
            <SpecBar valueA={carA.specs.powerHp || 0} valueB={carB.specs.powerHp || 0} />
          </div>
        </div>

        {/* 0-60 */}
        <div className="grid grid-cols-3 hover:bg-background/50 transition-colors items-center">
          <div className="p-4 md:p-6 font-medium text-sm text-text-muted flex items-center justify-center bg-background/50 border-r border-border-custom h-full">0-100 km/h (s)</div>
          <div className="col-span-2 p-4 md:p-6">
            <SpecBarReverse valueA={carA.specs.acceleration060 || 0} valueB={carB.specs.acceleration060 || 0} />
          </div>
        </div>

        {/* Drivetrain */}
        <div className="grid grid-cols-3 hover:bg-background/50 transition-colors items-center">
          <div className="p-4 md:p-6 font-medium text-sm text-text-muted flex items-center justify-center bg-background/50 border-r border-border-custom h-full">Drivetrain</div>
          <div className="p-4 md:p-6 text-center font-bold text-lg">{carA.specs.drivetrain}</div>
          <div className="p-4 md:p-6 text-center font-bold text-lg border-l border-border-custom">{carB.specs.drivetrain}</div>
        </div>

        {/* EV specific */}
        {carA.evSpecs && carB.evSpecs && (
          <>
            <div className="grid grid-cols-3 hover:bg-background/50 transition-colors items-center">
              <div className="p-4 md:p-6 font-medium text-sm text-text-muted flex items-center justify-center bg-background/50 border-r border-border-custom h-full">Range (WLTP km)</div>
              <div className="col-span-2 p-4 md:p-6">
                <SpecBar valueA={carA.evSpecs.rangeKm || 0} valueB={carB.evSpecs.rangeKm || 0} />
              </div>
            </div>
            <div className="grid grid-cols-3 hover:bg-background/50 transition-colors items-center">
              <div className="p-4 md:p-6 font-medium text-sm text-text-muted flex items-center justify-center bg-background/50 border-r border-border-custom h-full">Battery (kWh)</div>
              <div className="col-span-2 p-4 md:p-6">
                <SpecBar valueA={carA.evSpecs.batteryKwh || 0} valueB={carB.evSpecs.batteryKwh || 0} />
              </div>
            </div>
          </>
        )}

        {/* Links */}
        <div className="grid grid-cols-3 bg-background items-center">
          <div className="p-4 md:p-6 border-r border-border-custom h-full"></div>
          <div className="p-4 md:p-6 text-center">
            <Link href={`/vehicles/${carA.slug}`} className="text-accent font-bold hover:underline">View {carA.make} →</Link>
          </div>
          <div className="p-4 md:p-6 text-center border-l border-border-custom">
            <Link href={`/vehicles/${carB.slug}`} className="text-accent font-bold hover:underline">View {carB.make} →</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
