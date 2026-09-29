"use client";

import dynamic from "next/dynamic";
import { Vehicle } from "@/lib/types";

function AeroStudioSkeleton() {
  return (
    <div className="relative w-full h-[540px] sm:h-[620px] lg:h-[680px] bg-[#090b10] rounded-2xl overflow-hidden border border-border-custom flex flex-col items-center justify-center p-6 skeleton-shimmer">
      <div className="relative flex items-center justify-center mb-6">
        <div className="w-36 h-36 rounded-full border border-accent/20 animate-ping absolute" />
        <div className="w-28 h-28 rounded-full border border-[#00f5ff]/30 animate-pulse" />
        <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/50 flex items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent animate-spin"
            style={{ animationDuration: "3s" }}
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
        </div>
      </div>

      <div className="text-center space-y-2 max-w-sm">
        <h4 className="text-sm font-bold uppercase tracking-widest text-text-primary">
          Initializing 3D Aero Studio Engine
        </h4>
        <p className="text-xs text-text-muted">
          Assembling procedural chassis, clearcoat shaders & wind tunnel particles...
        </p>
      </div>
    </div>
  );
}

const AeroStudioCanvas = dynamic(
  () => import("./AeroStudioCanvas"),
  {
    ssr: false,
    loading: () => <AeroStudioSkeleton />,
  }
);

interface AeroStudioViewProps {
  vehicle: Vehicle;
}

export default function AeroStudioView({ vehicle }: AeroStudioViewProps) {
  return <AeroStudioCanvas vehicle={vehicle} />;
}
