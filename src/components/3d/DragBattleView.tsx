"use client";

import React, { useState, ReactNode } from "react";
import dynamic from "next/dynamic";
import { Vehicle } from "@/lib/types";

// Sleek dark loading skeleton while WebGL initializes
export function DragBattleSkeleton() {
  return (
    <div className="relative w-full h-[580px] md:h-[620px] rounded-3xl overflow-hidden bg-[#07090e] border border-border-custom shadow-2xl flex flex-col items-center justify-center p-6 select-none animate-pulse">
      {/* Background Perspective Asphalt Grid Illusion */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2a2d35_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Center Christmas Tree Silhouette & Pulsing Staging Light */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-surface border border-border-custom flex items-center justify-center mb-6 shadow-2xl relative">
          <span className="text-3xl animate-bounce">🏁</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent animate-ping" />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
          <h3 className="font-heading font-black text-lg md:text-xl text-white tracking-widest uppercase">
            Initializing 3D Drag Strip
          </h3>
        </div>

        <p className="text-text-muted text-xs md:text-sm font-mono max-w-sm text-center mb-8">
          Calibrating aerodynamic drag curves, quarter-mile staging beams, and high-performance WebGL shaders...
        </p>

        {/* Loading Progress Bar */}
        <div className="w-64 h-1.5 bg-surface rounded-full overflow-hidden relative shadow-inner">
          <div className="h-full bg-gradient-to-r from-accent via-[#00d2d3] to-accent w-1/2 rounded-full animate-[shimmer_1.5s_infinite]" />
        </div>
      </div>

      {/* Simulated Bottom Telemetry Docks */}
      <div className="absolute bottom-6 left-6 right-6 grid grid-cols-2 gap-4 opacity-40">
        <div className="h-20 bg-surface/60 rounded-2xl border border-border-custom" />
        <div className="h-20 bg-surface/60 rounded-2xl border border-border-custom" />
      </div>
    </div>
  );
}

// Dynamically import Three.js canvas with ssr: false
const DragBattleCanvas = dynamic(() => import("./DragBattleCanvas"), {
  ssr: false,
  loading: () => <DragBattleSkeleton />,
});

export interface DragBattleViewProps {
  carA: Vehicle;
  carB: Vehicle;
  children?: ReactNode;
  defaultView?: "battle" | "specs";
}

export default function DragBattleView({
  carA,
  carB,
  children,
  defaultView = "battle",
}: DragBattleViewProps) {
  const [activeView, setActiveView] = useState<"battle" | "specs">(defaultView);

  return (
    <div className="w-full">
      {/* Interactive View Switcher Bar (only when children / spec matrix is provided) */}
      {children && (
        <div className="flex items-center justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-surface border border-border-custom shadow-xl">
            <button
              type="button"
              onClick={() => setActiveView("battle")}
              className={`flex items-center gap-2.5 px-5 md:px-7 py-3 rounded-xl font-heading font-extrabold text-xs md:text-sm uppercase tracking-wider transition-all cursor-pointer ${
                activeView === "battle"
                  ? "bg-accent text-white shadow-lg shadow-accent/30"
                  : "text-text-muted hover:text-white hover:bg-surface-hover"
              }`}
            >
              <span className="text-base">⚔️</span>
              <span>3D Launch Battle</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/30 border border-white/20 font-bold">
                1/4 MILE
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView("specs")}
              className={`flex items-center gap-2.5 px-5 md:px-7 py-3 rounded-xl font-heading font-extrabold text-xs md:text-sm uppercase tracking-wider transition-all cursor-pointer ${
                activeView === "specs"
                  ? "bg-accent text-white shadow-lg shadow-accent/30"
                  : "text-text-muted hover:text-white hover:bg-surface-hover"
              }`}
            >
              <span className="text-base">📊</span>
              <span>Full Spec Matrix</span>
            </button>
          </div>
        </div>
      )}

      {/* Active View Container */}
      <div className="w-full">
        {activeView === "battle" ? (
          <DragBattleCanvas
            carA={carA}
            carB={carB}
            onViewSpecs={children ? () => setActiveView("specs") : undefined}
          />
        ) : (
          <div className="w-full animate-fadeIn">{children}</div>
        )}
      </div>
    </div>
  );
}