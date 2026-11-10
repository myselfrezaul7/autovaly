"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { Vehicle } from "@/lib/types";

export type SpeedUnit = "kmh" | "mph";
export type BattleStatus = "idle" | "staging" | "countdown" | "racing" | "finished";

export interface DragBattleCanvasProps {
  carA: Vehicle;
  carB: Vehicle;
  onViewSpecs?: () => void;
}

// Accurate drag racing physics calculation based on vehicle specs
function calculateQuarterMile(vehicle: Vehicle) {
  const hp = Math.max(100, vehicle.specs.powerHp);
  const weightKg = Math.max(800, vehicle.specs.weightKg);
  const weightLbs = weightKg * 2.20462;
  const isElectric = vehicle.fuelType === "BEV";

  // Base quarter-mile ET estimation formula
  let baseEt = 5.825 * Math.pow(weightLbs / hp, 1 / 3);
  if (isElectric) {
    // Electric instant torque slashes launch delay by ~0.4s
    baseEt = Math.max(8.8, baseEt * 0.94);
  }

  // Trap speed in mph
  let trapSpeedMph = 234 * Math.pow(hp / weightLbs, 1 / 3);
  if (isElectric) {
    trapSpeedMph = trapSpeedMph * 0.98;
  }

  const zeroToHundred = vehicle.specs.acceleration060 || 3.5;
  const eighthMileEt = baseEt * 0.64;

  return {
    quarterEt: parseFloat(baseEt.toFixed(2)),
    trapSpeedMph: Math.round(trapSpeedMph),
    trapSpeedKmh: Math.round(trapSpeedMph * 1.60934),
    eighthEt: parseFloat(eighthMileEt.toFixed(2)),
    zeroToHundred,
  };
}

export default function DragBattleCanvas({ carA, carB, onViewSpecs }: DragBattleCanvasProps) {
  const [status, setStatus] = useState<BattleStatus>("idle");
  const [speedUnit, setSpeedUnit] = useState<SpeedUnit>("kmh");
  const [countdownStep, setCountdownStep] = useState<number>(0); // 0=idle, 1=pre-stage, 2=amber1, 3=amber2, 4=amber3, 5=green
  const [raceProgress, setRaceProgress] = useState<number>(0); // 0.0 to 1.0

  const animFrameRef = useRef<number | null>(null);
  const raceStartTimeRef = useRef<number | null>(null);

  const statsA = useMemo(() => calculateQuarterMile(carA), [carA]);
  const statsB = useMemo(() => calculateQuarterMile(carB), [carB]);

  const winner = statsA.quarterEt <= statsB.quarterEt ? "A" : "B";
  const deltaEt = Math.abs(statsA.quarterEt - statsB.quarterEt).toFixed(2);

  // Total duration of simulation in ms (scaled for exciting visualization: ~4.5s)
  const raceDurationMs = 4500;

  // Staging countdown sequence
  const startRaceSequence = () => {
    if (status === "countdown" || status === "racing") return;
    setStatus("countdown");
    setRaceProgress(0);
    setCountdownStep(1); // Pre-stage lights on

    setTimeout(() => setCountdownStep(2), 400); // Amber 1
    setTimeout(() => setCountdownStep(3), 850); // Amber 2
    setTimeout(() => setCountdownStep(4), 1300); // Amber 3
    setTimeout(() => {
      setCountdownStep(5); // GREEN
      setStatus("racing");
      raceStartTimeRef.current = performance.now();
    }, 1750);
  };

  const resetRace = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setStatus("idle");
    setCountdownStep(0);
    setRaceProgress(0);
    raceStartTimeRef.current = null;
  };

  // 120Hz smooth physics loop
  useEffect(() => {
    if (status !== "racing") return;

    const tick = (now: number) => {
      if (!raceStartTimeRef.current) raceStartTimeRef.current = now;
      const elapsed = now - raceStartTimeRef.current;
      const progress = Math.min(1, elapsed / raceDurationMs);

      // Nonlinear acceleration curve (rapid initial bite then top-end drag)
      const easedProgress = Math.pow(progress, 1.45);
      setRaceProgress(easedProgress);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        setStatus("finished");
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [status]);

  // Current real-time telemetry based on race progress
  const currentSpeedA = useMemo(() => {
    const maxSpeed = speedUnit === "kmh" ? statsA.trapSpeedKmh : statsA.trapSpeedMph;
    return Math.round(maxSpeed * raceProgress);
  }, [raceProgress, speedUnit, statsA]);

  const currentSpeedB = useMemo(() => {
    const maxSpeed = speedUnit === "kmh" ? statsB.trapSpeedKmh : statsB.trapSpeedMph;
    return Math.round(maxSpeed * raceProgress);
  }, [raceProgress, speedUnit, statsB]);

  // Car lane progress (winner reaches 100% first)
  const carAPercent = raceProgress * (winner === "A" ? 100 : (statsB.quarterEt / statsA.quarterEt) * 100);
  const carBPercent = raceProgress * (winner === "B" ? 100 : (statsA.quarterEt / statsB.quarterEt) * 100);

  return (
    <div className="w-full rounded-3xl bg-gradient-to-b from-[#0b0e14] via-[#07090e] to-[#0b0e14] border border-border-custom overflow-hidden shadow-2xl hardware-accelerated select-none">
      {/* Top Header Bar */}
      <div className="px-5 py-4 bg-surface/70 border-b border-border-custom flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏁</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent">
                1/4-Mile Launch Battle
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#00d2d3]">
                120Hz Direct GPU
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-lg text-white">
              {carA.make} {carA.model} vs {carB.make} {carB.model}
            </h3>
          </div>
        </div>

        {/* Speed Unit Toggle & Controls */}
        <div className="flex items-center gap-3">
          <div className="inline-flex p-1 rounded-xl bg-[#090b10] border border-border-custom text-xs font-mono">
            <button
              type="button"
              onClick={() => setSpeedUnit("kmh")}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                speedUnit === "kmh" ? "bg-accent text-white" : "text-text-muted hover:text-white"
              }`}
            >
              KM/H
            </button>
            <button
              type="button"
              onClick={() => setSpeedUnit("mph")}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                speedUnit === "mph" ? "bg-accent text-white" : "text-text-muted hover:text-white"
              }`}
            >
              MPH
            </button>
          </div>

          {onViewSpecs && (
            <button
              type="button"
              onClick={onViewSpecs}
              className="px-3.5 py-1.5 rounded-xl bg-surface border border-border-custom hover:border-accent text-xs font-mono font-bold text-white transition-all cursor-pointer"
            >
              📊 Specs
            </button>
          )}
        </div>
      </div>

      {/* Main Drag Strip Staging Area */}
      <div className="relative p-6 sm:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#141824] via-[#090b10] to-[#06080c] overflow-hidden">
        {/* NHRA Christmas Tree Staging Lights */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="bg-[#121620] border-2 border-border-custom rounded-2xl px-4 py-2.5 shadow-2xl flex items-center gap-3">
            {/* Pre-Stage */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-mono text-text-muted uppercase">PRE</span>
              <div
                className={`w-3.5 h-3.5 rounded-full border border-white/20 transition-all ${
                  countdownStep >= 1 ? "bg-amber-300 shadow-[0_0_10px_#fde047]" : "bg-neutral-800"
                }`}
              />
            </div>

            {/* Amber 1 */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-mono text-text-muted uppercase">.500</span>
              <div
                className={`w-3.5 h-3.5 rounded-full border border-white/20 transition-all ${
                  countdownStep >= 2 ? "bg-amber-400 shadow-[0_0_12px_#fbbf24]" : "bg-neutral-800"
                }`}
              />
            </div>

            {/* Amber 2 */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-mono text-text-muted uppercase">.500</span>
              <div
                className={`w-3.5 h-3.5 rounded-full border border-white/20 transition-all ${
                  countdownStep >= 3 ? "bg-amber-500 shadow-[0_0_12px_#f59e0b]" : "bg-neutral-800"
                }`}
              />
            </div>

            {/* Amber 3 */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-mono text-text-muted uppercase">.500</span>
              <div
                className={`w-3.5 h-3.5 rounded-full border border-white/20 transition-all ${
                  countdownStep >= 4 ? "bg-amber-500 shadow-[0_0_12px_#f59e0b]" : "bg-neutral-800"
                }`}
              />
            </div>

            {/* Green Light */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[8px] font-mono font-bold text-emerald-400 uppercase">GO!</span>
              <div
                className={`w-4 h-4 rounded-full border-2 border-emerald-400 transition-all ${
                  countdownStep === 5 ? "bg-emerald-400 shadow-[0_0_16px_#34d399]" : "bg-neutral-800"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Dual Lane Track Visualizer */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Lane 1: Car A */}
          <div className="relative bg-[#0e121a] p-4 rounded-2xl border border-border-custom overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" />
                <span className="font-heading font-extrabold text-sm sm:text-base text-white">
                  {carA.make} {carA.model}
                </span>
                {status === "finished" && winner === "A" && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-accent text-white animate-bounce">
                    🏆 WINNER (-{deltaEt}s)
                  </span>
                )}
              </div>
              <div className="font-mono text-xs text-right">
                <span className="text-text-muted block text-[10px]">SPEED</span>
                <span className="font-bold text-accent text-sm sm:text-base tabular-nums">
                  {currentSpeedA} {speedUnit.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Lane Track Floor */}
            <div className="relative h-14 bg-[#090b10] rounded-xl border border-white/5 overflow-hidden flex items-center px-2">
              {/* Finish line marker */}
              <div className="absolute right-3 top-0 bottom-0 w-2.5 bg-[repeating-linear-gradient(45deg,#fff,#fff_4px,#000_4px,#000_8px)] opacity-60 z-10" />

              {/* Moving Car A */}
              <div
                className="absolute z-20 flex items-center transition-none gpu-layer"
                style={{
                  left: `calc(${Math.min(90, carAPercent * 0.9)}%)`,
                }}
              >
                <div className="relative w-20 h-10">
                  {carA.coverImage ? (
                    <Image
                      src={carA.coverImage}
                      alt={carA.model}
                      fill
                      sizes="80px"
                      className="object-contain drop-shadow-[0_4px_10px_rgba(232,35,42,0.4)]"
                    />
                  ) : (
                    <span className="text-2xl">🏎️</span>
                  )}
                </div>
              </div>
            </div>

            {/* Split Stats */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border-custom/50 text-[11px] font-mono text-text-muted">
              <div>0-100: <span className="text-white font-bold">{statsA.zeroToHundred}s</span></div>
              <div>1/8 MILE: <span className="text-white font-bold">{statsA.eighthEt}s</span></div>
              <div>1/4 MILE: <span className="text-accent font-bold">{statsA.quarterEt}s</span></div>
            </div>
          </div>

          {/* Lane 2: Car B */}
          <div className="relative bg-[#0e121a] p-4 rounded-2xl border border-border-custom overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00d2d3]" />
                <span className="font-heading font-extrabold text-sm sm:text-base text-white">
                  {carB.make} {carB.model}
                </span>
                {status === "finished" && winner === "B" && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#00d2d3] text-black animate-bounce">
                    🏆 WINNER (-{deltaEt}s)
                  </span>
                )}
              </div>
              <div className="font-mono text-xs text-right">
                <span className="text-text-muted block text-[10px]">SPEED</span>
                <span className="font-bold text-[#00d2d3] text-sm sm:text-base tabular-nums">
                  {currentSpeedB} {speedUnit.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Lane Track Floor */}
            <div className="relative h-14 bg-[#090b10] rounded-xl border border-white/5 overflow-hidden flex items-center px-2">
              {/* Finish line marker */}
              <div className="absolute right-3 top-0 bottom-0 w-2.5 bg-[repeating-linear-gradient(45deg,#fff,#fff_4px,#000_4px,#000_8px)] opacity-60 z-10" />

              {/* Moving Car B */}
              <div
                className="absolute z-20 flex items-center transition-none gpu-layer"
                style={{
                  left: `calc(${Math.min(90, carBPercent * 0.9)}%)`,
                }}
              >
                <div className="relative w-20 h-10">
                  {carB.coverImage ? (
                    <Image
                      src={carB.coverImage}
                      alt={carB.model}
                      fill
                      sizes="80px"
                      className="object-contain drop-shadow-[0_4px_10px_rgba(0,210,211,0.4)]"
                    />
                  ) : (
                    <span className="text-2xl">🏎️</span>
                  )}
                </div>
              </div>
            </div>

            {/* Split Stats */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border-custom/50 text-[11px] font-mono text-text-muted">
              <div>0-100: <span className="text-white font-bold">{statsB.zeroToHundred}s</span></div>
              <div>1/8 MILE: <span className="text-white font-bold">{statsB.eighthEt}s</span></div>
              <div>1/4 MILE: <span className="text-[#00d2d3] font-bold">{statsB.quarterEt}s</span></div>
            </div>
          </div>
        </div>

        {/* Action Controls & Launch Trigger */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {status === "idle" && (
            <button
              type="button"
              onClick={startRaceSequence}
              className="px-8 py-3.5 rounded-2xl bg-accent hover:bg-accent/90 text-white font-heading font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-accent/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <span>🚦</span>
              <span>Stage & Launch 1/4-Mile</span>
            </button>
          )}

          {status === "countdown" && (
            <div className="px-8 py-3.5 rounded-2xl bg-amber-500/20 border border-amber-500 text-amber-300 font-mono font-bold text-sm tracking-widest uppercase animate-pulse">
              Staging Tree Activated...
            </div>
          )}

          {status === "racing" && (
            <div className="px-8 py-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500 text-emerald-400 font-mono font-bold text-sm tracking-widest uppercase">
              Full Throttle Running...
            </div>
          )}

          {status === "finished" && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={startRaceSequence}
                className="px-6 py-3 rounded-2xl bg-accent hover:bg-accent/90 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                🔄 Re-Run Battle
              </button>
              <button
                type="button"
                onClick={resetRace}
                className="px-5 py-3 rounded-2xl bg-surface border border-border-custom hover:border-white/30 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Reset Staging
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
