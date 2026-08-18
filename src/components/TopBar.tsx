"use client";

import { useState, useEffect } from "react";
import { tickerHeadlines } from "@/lib/data/ticker";
import Link from "next/link";

export default function TopBar() {
  const [mounted, setMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentDate = mounted
    ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <div
      className="bg-[#0B0D11] border-b border-border-custom/80 h-10 md:h-9 flex items-center overflow-hidden relative z-50 text-text-light select-none"
      role="region"
      aria-label="Breaking automotive ticker"
    >
      {/* Live / Breaking Badge */}
      <div className="flex items-center gap-1.5 px-3 py-1 bg-accent text-white font-extrabold uppercase text-[10px] tracking-wider z-20 flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" aria-hidden="true" />
        <span>FAST FEED</span>
      </div>

      {/* Marquee ticker */}
      <div
        className={`flex items-center whitespace-nowrap ticker-track ${
          isPaused ? "[animation-play-state:paused]" : "animate-[ticker_32s_linear_infinite]"
        }`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused((prev) => !prev)}
      >
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center" aria-hidden={i === 1}>
            {tickerHeadlines.map((item) => (
              <Link
                key={`${item.id}-${i}`}
                href={item.url}
                className="flex items-center gap-2 text-xs font-medium text-text-muted hover:text-white px-5 transition-colors group"
                tabIndex={i === 1 ? -1 : 0}
              >
                {item.isLive ? (
                  <span className="inline-flex items-center gap-1 font-bold tracking-wider uppercase text-[10px] text-accent group-hover:text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" aria-hidden="true" />
                    LIVE
                  </span>
                ) : (
                  <span className="text-[10px] text-accent/80 font-bold" aria-hidden="true">⚡</span>
                )}
                <span className="group-hover:underline">{item.text}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Right Controls: Play/Pause, Date & Locale */}
      <div className="absolute right-0 top-0 bottom-0 flex items-center gap-3 text-xs text-text-muted font-medium bg-[#0B0D11] px-3 md:px-4 z-20 before:content-[''] before:absolute before:-left-6 before:top-0 before:bottom-0 before:w-6 before:bg-gradient-to-r before:from-transparent before:to-[#0B0D11] border-l border-border-custom/50">
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="text-text-muted hover:text-text-light transition-colors p-1 rounded cursor-pointer text-[11px]"
          aria-label={isPaused ? "Resume news ticker" : "Pause news ticker"}
          title={isPaused ? "Resume news ticker" : "Pause news ticker"}
        >
          {isPaused ? "▶" : "⏸"}
        </button>
        <span className="hidden sm:inline text-[11px] text-text-muted">{currentDate}</span>
        <span className="hidden sm:inline text-border-custom">|</span>
        <span className="hidden sm:inline text-[11px] font-bold text-accent">GLOBAL ED.</span>
      </div>
    </div>
  );
}
