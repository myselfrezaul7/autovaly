import { Vehicle } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

interface ArticleVehicleDossierProps {
  vehicle: Vehicle;
  variant?: "sidebar" | "body";
}

export default function ArticleVehicleDossier({
  vehicle,
  variant = "sidebar",
}: ArticleVehicleDossierProps) {
  if (variant === "body") {
    return (
      <section
        aria-label="Featured Vehicle Dossier and 120Hz Telemetry"
        className="my-10 bg-surface/90 border border-border-custom hover:border-accent/60 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all duration-300 group overflow-hidden relative backdrop-blur-sm will-change-transform"
      >
        {/* Ambient background glow */}
        <div
          className="absolute -right-24 -bottom-24 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-20"
          style={{ backgroundColor: vehicle.coverGradient.from || "var(--accent)" }}
        />

        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-border-custom/80">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
            </span>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-accent">
              Featured Vehicle Dossier & 120Hz Telemetry
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-surface border border-border-custom text-text-muted text-[10px] font-bold uppercase tracking-wider rounded-md">
              {vehicle.fuelType}
            </span>
            <span className="px-2.5 py-0.5 bg-surface border border-border-custom text-text-muted text-[10px] font-bold uppercase tracking-wider rounded-md">
              {vehicle.bodyStyle}
            </span>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Thumbnail preview */}
          <div className="md:col-span-5 relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden border border-border-custom bg-black/40 shadow-inner">
            {vehicle.coverImage ? (
              <Image
                src={vehicle.coverImage}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
              />
            ) : (
              <div
                className="absolute inset-0 group-hover:scale-105 transition-transform duration-500 will-change-transform"
                style={{ backgroundImage: `linear-gradient(135deg, ${vehicle.coverGradient.from}, ${vehicle.coverGradient.to})` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-70" />
            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-xs">
              <span className="font-heading font-bold text-white bg-background/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                €{vehicle.priceEur.toLocaleString()}
              </span>
              {vehicle.evSpecs && (
                <span className="font-heading font-bold text-accent-cyan bg-background/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-cyan-500/20">
                  {vehicle.evSpecs.rangeKm} km WLTP
                </span>
              )}
            </div>
          </div>

          {/* Details & Specs */}
          <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
            <div>
              <span className="text-accent text-xs font-extrabold uppercase tracking-widest block mb-1">
                {vehicle.make}
              </span>
              <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-text-light group-hover:text-accent transition-colors leading-tight mb-1">
                {vehicle.year} {vehicle.model}
              </h3>
              <p className="text-xs sm:text-sm text-text-muted line-clamp-1">
                {vehicle.trim}
              </p>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-3 gap-3 bg-background/60 rounded-2xl p-3 border border-border-custom/70">
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider text-text-muted block font-semibold">Horsepower</span>
                <span className="font-heading font-extrabold text-lg sm:text-xl text-text-light tabular-nums">
                  {vehicle.specs.powerHp} <span className="text-xs font-normal text-text-muted">HP</span>
                </span>
              </div>
              <div className="text-center border-x border-border-custom/80">
                <span className="text-[10px] uppercase tracking-wider text-text-muted block font-semibold">0–100 km/h</span>
                <span className="font-heading font-extrabold text-lg sm:text-xl text-text-light tabular-nums">
                  {vehicle.specs.acceleration060}s
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-wider text-text-muted block font-semibold">Top Speed</span>
                <span className="font-heading font-extrabold text-lg sm:text-xl text-text-light tabular-nums">
                  {vehicle.specs.topSpeedKmh} <span className="text-xs font-normal text-text-muted">km/h</span>
                </span>
              </div>
            </div>

            {/* Direct Link CTA */}
            <div className="pt-1">
              <Link
                href={`/vehicles/${vehicle.slug}`}
                className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-6 py-3 rounded-xl bg-accent hover:bg-accent-dark text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-accent/25 hover:shadow-accent/40 group/btn"
              >
                <span>Inspect Full Vehicle Dossier & 120Hz Telemetry</span>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover/btn:translate-x-1 will-change-transform"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Default: Sidebar variant
  return (
    <div
      aria-label="Featured Vehicle Dossier and 120Hz Telemetry"
      className="bg-surface border border-border-custom hover:border-accent/60 rounded-2xl p-5 shadow-xl transition-all duration-300 group overflow-hidden relative will-change-transform"
    >
      {/* Telemetry pulse header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-accent/15 text-accent border border-accent/30">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          120Hz Telemetry
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
          {vehicle.fuelType} · {vehicle.bodyStyle}
        </span>
      </div>

      <div className="mb-3">
        <span className="text-accent text-[10px] font-extrabold uppercase tracking-widest block">
          Featured Dossier
        </span>
        <h4 className="font-heading font-extrabold text-lg text-text-light group-hover:text-accent transition-colors leading-tight">
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h4>
        <p className="text-xs text-text-muted line-clamp-1 mt-0.5">
          {vehicle.trim}
        </p>
      </div>

      {/* Vehicle Thumbnail with 120Hz smooth hover zoom */}
      <div className="relative h-36 w-full rounded-xl overflow-hidden mb-4 border border-border-custom bg-black/40 shadow-inner">
        {vehicle.coverImage ? (
          <Image
            src={vehicle.coverImage}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fill
            sizes="(max-width: 1024px) 100vw, 360px"
            className="object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
          />
        ) : (
          <div
            className="absolute inset-0 group-hover:scale-105 transition-transform duration-500 will-change-transform"
            style={{ backgroundImage: `linear-gradient(135deg, ${vehicle.coverGradient.from}, ${vehicle.coverGradient.to})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60" />
        <div className="absolute bottom-2 left-2.5 right-2.5 flex justify-between items-end text-[11px]">
          <span className="font-heading font-bold text-white bg-background/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 tabular-nums">
            €{vehicle.priceEur.toLocaleString()}
          </span>
          {vehicle.evSpecs && (
            <span className="text-[10px] font-bold text-accent-cyan bg-background/80 backdrop-blur-md px-2 py-0.5 rounded border border-cyan-500/20">
              {vehicle.evSpecs.rangeKm} km
            </span>
          )}
        </div>
      </div>

      {/* Quick Specs Grid (HP, 0-60, Top Speed) */}
      <div className="grid grid-cols-3 gap-2 mb-4 bg-background/60 rounded-xl p-2.5 border border-border-custom/70">
        <div className="text-center">
          <span className="text-[9px] uppercase tracking-wider text-text-muted block font-semibold">Power</span>
          <span className="font-heading font-extrabold text-sm text-text-light tabular-nums">
            {vehicle.specs.powerHp} <span className="text-[10px] font-normal text-text-muted">HP</span>
          </span>
        </div>
        <div className="text-center border-x border-border-custom/70">
          <span className="text-[9px] uppercase tracking-wider text-text-muted block font-semibold">0–100</span>
          <span className="font-heading font-extrabold text-sm text-text-light tabular-nums">
            {vehicle.specs.acceleration060}s
          </span>
        </div>
        <div className="text-center">
          <span className="text-[9px] uppercase tracking-wider text-text-muted block font-semibold">V-Max</span>
          <span className="font-heading font-extrabold text-sm text-text-light tabular-nums">
            {vehicle.specs.topSpeedKmh} <span className="text-[9px] font-normal text-text-muted">km/h</span>
          </span>
        </div>
      </div>

      {/* Direct link to /vehicles/[vehicleSlug] */}
      <Link
        href={`/vehicles/${vehicle.slug}`}
        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-accent hover:bg-accent-dark text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-md shadow-accent/20 group/btn"
      >
        <span>Inspect Vehicle Dossier</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover/btn:translate-x-1 will-change-transform"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>
    </div>
  );
}
