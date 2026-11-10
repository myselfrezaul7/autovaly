"use client";

import React, { useState, ReactNode } from "react";
import DragBattleCanvas from "./DragBattleCanvas";
import { Vehicle } from "@/lib/types";

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
        <div className="flex items-center justify-center mb-8">
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
              <span>1/4-Mile Launch Battle</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/30 border border-white/20 font-bold">
                120HZ
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
