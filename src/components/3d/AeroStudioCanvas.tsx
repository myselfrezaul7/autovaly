"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Vehicle, BodyStyle } from "@/lib/types";

export interface AeroStudioCanvasProps {
  vehicle: Vehicle;
}

interface PaintColorOption {
  name: string;
  hex: string;
  accentRgb: string;
}

const PAINT_PALETTE: PaintColorOption[] = [
  { name: "Carmine Red", hex: "#E8232A", accentRgb: "232, 35, 42" },
  { name: "Cyber Cyan", hex: "#00D2D3", accentRgb: "0, 210, 211" },
  { name: "Stealth Onyx", hex: "#15181C", accentRgb: "30, 35, 42" },
  { name: "Liquid Quicksilver", hex: "#94A3B8", accentRgb: "148, 163, 184" },
  { name: "Apex Gold", hex: "#D4AF37", accentRgb: "212, 175, 55" },
  { name: "Racing Green", hex: "#00B894", accentRgb: "0, 184, 148" },
];

function getAeroSpecs(bodyStyle: BodyStyle) {
  switch (bodyStyle) {
    case "Coupe":
    case "Convertible":
      return { cd: 0.21, baseDownforceKg: 195, aeroCategory: "High-Downforce Ground-Effect Fastback" };
    case "Sedan":
      return { cd: 0.22, baseDownforceKg: 155, aeroCategory: "Low-Turbulence Laminar Teardrop" };
    case "SUV":
      return { cd: 0.27, baseDownforceKg: 120, aeroCategory: "Active Lift-Suppression & Vortex Shield" };
    case "Truck":
      return { cd: 0.33, baseDownforceKg: 95, aeroCategory: "Pressure-Relief Bed Aerodynamics" };
    default:
      return { cd: 0.24, baseDownforceKg: 140, aeroCategory: "Balanced Flow Streamliner" };
  }
}

interface Hotspot {
  id: string;
  title: string;
  category: string;
  xPercent: number;
  yPercent: number;
  description: string;
  specKey: string;
  specValue: string;
}

export default function AeroStudioCanvas({ vehicle }: AeroStudioCanvasProps) {
  const [selectedPaint, setSelectedPaint] = useState<PaintColorOption>(PAINT_PALETTE[0]);
  const [windSpeedKmh, setWindSpeedKmh] = useState<number>(200);
  const [isWindTunnelActive, setIsWindTunnelActive] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>("front-aero");

  const aeroSpecs = useMemo(() => getAeroSpecs(vehicle.bodyStyle), [vehicle.bodyStyle]);

  // Real-world dynamic aerodynamic calculations
  // D = 0.5 * rho * v^2 * Cl * A -> scales quadratically with speed
  const speedRatio = windSpeedKmh / 200;
  const currentDownforceKg = Math.round(aeroSpecs.baseDownforceKg * Math.pow(speedRatio, 1.85));
  // Drag force in Newtons: Fd = 0.5 * 1.225 * (v_ms)^2 * Cd * 2.2 m^2 frontal area
  const speedMs = windSpeedKmh / 3.6;
  const dragForceN = Math.round(0.5 * 1.225 * Math.pow(speedMs, 2) * aeroSpecs.cd * 2.2);

  const hotspots: Hotspot[] = useMemo(
    () => [
      {
        id: "front-aero",
        title: "Active Venturi Air Dam",
        category: "FRONT AXLE DOWNFORCE",
        xPercent: 18,
        yPercent: 68,
        description:
          "Dynamic active air shutters open for high-demand brake & thermal cooling, or seal flush at speed to guide laminar air under the flat carbon undertray.",
        specKey: "Front Lift Coefficient",
        specValue: "-0.08 Cl (Downforce)",
      },
      {
        id: "powertrain",
        title: "Integrated High-Torque Powertrain",
        category: "PROPULSION & CHASSIS",
        xPercent: 42,
        yPercent: 72,
        description:
          "Ultra-compact motor architecture and structural battery pack positioned low between the axles to yield a race-grade 460mm center of gravity.",
        specKey: "Power & Torque",
        specValue: `${vehicle.specs.powerHp} HP • ${vehicle.specs.torqueNm} Nm`,
      },
      {
        id: "venturi-flanks",
        title: "Side Venturi Air Curtains",
        category: "TURBULENCE MITIGATION",
        xPercent: 52,
        yPercent: 48,
        description:
          "Scaffolds turbulent air around the front wheel wells through high-velocity laminar flow guides, slashing parasitic side-wake turbulence by 18%.",
        specKey: "Vortex Reduction",
        specValue: "18% Parasitic Wake Cut",
      },
      {
        id: "rear-diffuser",
        title: "Active Adaptive Aero Wing & Diffuser",
        category: "REAR AXLE STABILITY",
        xPercent: 84,
        yPercent: 44,
        description:
          "Multi-element active aero spoiler auto-deploys to create high rear-axle downforce under high-speed braking and sharp track cornering.",
        specKey: "Rear Aero Downforce",
        specValue: `${Math.round(currentDownforceKg * 0.58)} kg @ ${windSpeedKmh} km/h`,
      },
    ],
    [vehicle.specs.powerHp, vehicle.specs.torqueNm, currentDownforceKg, windSpeedKmh]
  );

  const selectedHotspotData = hotspots.find((h) => h.id === activeHotspot) || hotspots[0];

  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-[#0e1117] via-[#090b10] to-[#0e1117] border border-border-custom overflow-hidden shadow-2xl hardware-accelerated select-none">
      {/* Top Telemetry Header Bar */}
      <div className="px-5 py-4 bg-surface/80 border-b border-border-custom flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-accent animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent">
                Active Telemetry Studio
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-text-muted">
                120Hz Hardware Composite
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-lg sm:text-xl text-white">
              {vehicle.make} {vehicle.model}
            </h3>
          </div>
        </div>

        {/* Live Aero Quick Stats */}
        <div className="flex items-center gap-4 sm:gap-6 font-mono text-xs">
          <div className="text-right">
            <span className="text-text-muted block text-[10px] uppercase">Drag Coeff (Cd)</span>
            <span className="text-accent font-bold text-sm sm:text-base">{aeroSpecs.cd}</span>
          </div>
          <div className="h-7 w-[1px] bg-border-custom" />
          <div className="text-right">
            <span className="text-text-muted block text-[10px] uppercase">Downforce</span>
            <span className="text-[#00d2d3] font-bold text-sm sm:text-base tabular-nums">
              {currentDownforceKg} kg
            </span>
          </div>
          <div className="h-7 w-[1px] bg-border-custom" />
          <div className="text-right">
            <span className="text-text-muted block text-[10px] uppercase">Drag Force</span>
            <span className="text-[#d4af37] font-bold text-sm sm:text-base tabular-nums">
              {dragForceN} N
            </span>
          </div>
        </div>
      </div>

      {/* Main Aero Wind Tunnel Stage */}
      <div className="relative w-full h-[360px] sm:h-[420px] md:h-[480px] flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#181d28]/70 via-[#0a0c12] to-[#07080c]">
        {/* Aerodynamic Wind Tunnel Grid Floor */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 30%, transparent 80%)",
          }}
        />

        {/* Ambient Finish Underglow */}
        <div
          className="absolute w-[80%] h-32 rounded-full blur-3xl opacity-35 transition-all duration-700 pointer-events-none"
          style={{
            backgroundColor: selectedPaint.hex,
            bottom: "10%",
          }}
        />

        {/* Supersonic 120fps Wind Streamlines Overlay */}
        {isWindTunnelActive && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {/* Streamline Track 1: Roof laminar path */}
            <div
              className={`absolute top-[28%] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00d2d3] to-transparent opacity-70 ${
                windSpeedKmh > 200 ? "animate-streamline-fast" : "animate-streamline"
              }`}
              style={{ animationDelay: "0s" }}
            />
            {/* Streamline Track 2: Shoulder vortex */}
            <div
              className={`absolute top-[42%] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 ${
                windSpeedKmh > 200 ? "animate-streamline-fast" : "animate-streamline"
              }`}
              style={{ animationDelay: "0.45s" }}
            />
            {/* Streamline Track 3: Hood & Windshield flow */}
            <div
              className={`absolute top-[52%] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-75 ${
                windSpeedKmh > 200 ? "animate-streamline-fast" : "animate-streamline"
              }`}
              style={{ animationDelay: "0.25s" }}
            />
            {/* Streamline Track 4: Venturi underbody flow */}
            <div
              className={`absolute bottom-[24%] left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-90 ${
                windSpeedKmh > 200 ? "animate-streamline-fast" : "animate-streamline"
              }`}
              style={{ animationDelay: "0.7s" }}
            />
          </div>
        )}

        {/* High-Resolution Vehicle Display */}
        <div className="relative z-10 w-[92%] sm:w-[84%] md:w-[78%] max-w-4xl h-[260px] sm:h-[320px] md:h-[380px] flex items-center justify-center">
          {vehicle.coverImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={vehicle.coverImage}
                alt={`${vehicle.make} ${vehicle.model}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          ) : (
            <div className="text-text-muted text-sm font-mono flex flex-col items-center gap-2">
              <span className="text-4xl">🏎️</span>
              <span>Official Vehicle Telemetry Rendering</span>
            </div>
          )}

          {/* Interactive Telemetry Hotspots */}
          {hotspots.map((h) => {
            const isSelected = activeHotspot === h.id;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => setActiveHotspot(h.id)}
                aria-label={`Inspect ${h.title}`}
                className={`absolute z-30 group cursor-pointer transition-transform duration-200 ${
                  isSelected ? "scale-125" : "hover:scale-110"
                }`}
                style={{
                  left: `${h.xPercent}%`,
                  top: `${h.yPercent}%`,
                }}
              >
                <span className="relative flex h-7 w-7 items-center justify-center">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isSelected ? "bg-accent" : "bg-[#00d2d3]"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-5 w-5 border-2 border-white items-center justify-center text-[10px] font-bold text-white shadow-lg ${
                      isSelected ? "bg-accent" : "bg-[#00d2d3]/90"
                    }`}
                  >
                    +
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Floating Active Aero Indicator Badge */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-bold">{aeroSpecs.aeroCategory}</span>
        </div>
      </div>

      {/* Interactive Controls & Telemetry Dashboard */}
      <div className="p-5 sm:p-6 bg-surface/50 border-t border-border-custom grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Hotspot Deep-Dive Telemetry */}
        <div className="lg:col-span-7 bg-[#0b0e14] p-4 sm:p-5 rounded-xl border border-border-custom flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-0.5 rounded border border-accent/20">
                {selectedHotspotData.category}
              </span>
              <span className="text-xs font-mono font-bold text-[#00d2d3]">
                {selectedHotspotData.specValue}
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-heading font-extrabold text-white mb-2">
              {selectedHotspotData.title}
            </h4>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              {selectedHotspotData.description}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-border-custom flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-text-muted font-mono">Select Hotspot:</span>
            {hotspots.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setActiveHotspot(h.id)}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  activeHotspot === h.id
                    ? "bg-accent/20 border-accent text-accent font-bold"
                    : "bg-surface border-border-custom text-text-muted hover:text-white"
                }`}
              >
                {h.title}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Wind Velocity Slider & Paint Palette */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Wind Speed Scrubber */}
          <div className="bg-[#0b0e14] p-4 rounded-xl border border-border-custom">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
                Tunnel Wind Velocity
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-extrabold text-white tabular-nums">
                  {windSpeedKmh} km/h
                </span>
                <span className="text-xs text-text-muted">
                  ({Math.round(windSpeedKmh * 0.621371)} mph)
                </span>
              </div>
            </div>

            <input
              type="range"
              min="50"
              max="350"
              step="10"
              value={windSpeedKmh}
              onChange={(e) => setWindSpeedKmh(Number(e.target.value))}
              className="w-full accent-accent h-1.5 bg-surface rounded-lg appearance-none cursor-pointer"
            />

            <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-text-muted">
              <span>50 km/h (City)</span>
              <span>200 km/h (Autobahn)</span>
              <span>350 km/h (V-Max)</span>
            </div>
          </div>

          {/* Paint Finishes & Wind Tunnel Toggle */}
          <div className="bg-[#0b0e14] p-4 rounded-xl border border-border-custom flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono text-text-muted block uppercase tracking-wider mb-2">
                Factory Finishes
              </span>
              <div className="flex items-center gap-2">
                {PAINT_PALETTE.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setSelectedPaint(p)}
                    title={p.name}
                    className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                      selectedPaint.name === p.name
                        ? "border-white scale-125 shadow-md"
                        : "border-border-custom hover:scale-110"
                    }`}
                    style={{ backgroundColor: p.hex }}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsWindTunnelActive((prev) => !prev)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                isWindTunnelActive
                  ? "bg-[#00d2d3]/15 border-[#00d2d3] text-[#00d2d3]"
                  : "bg-surface border-border-custom text-text-muted hover:text-white"
              }`}
            >
              {isWindTunnelActive ? "💨 Tunnel ON" : "⏸ Tunnel OFF"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
