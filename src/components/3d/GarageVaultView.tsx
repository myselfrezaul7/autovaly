"use client";

import dynamic from "next/dynamic";
import type { Vehicle } from "@/lib/types";

const GarageVaultCanvas = dynamic(() => import("./GarageVaultCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[660px] md:h-[720px] rounded-3xl bg-[#090b10] border border-border-custom/80 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
      <div className="relative flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl border-2 border-accent/20 border-t-accent animate-spin mb-4" />
        <span className="text-[11px] uppercase tracking-widest font-heading font-extrabold text-accent mb-1 animate-pulse">
          INITIALIZING 3D GARAGE VAULT
        </span>
        <span className="text-xs text-text-muted">
          Loading WebGL showroom shaders & telemetry...
        </span>
      </div>
    </div>
  ),
});

export interface GarageVaultViewProps {
  garage: Vehicle[];
  selectedForCompare?: string[];
  onToggleCompare?: (slug: string) => void;
  onRemoveVehicle?: (id: string) => void;
}

export default function GarageVaultView(props: GarageVaultViewProps) {
  return <GarageVaultCanvas {...props} />;
}
