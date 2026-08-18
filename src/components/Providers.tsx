"use client";

import { ThemeProvider } from "@/lib/theme-context";
import { CurrencyProvider } from "@/lib/currency-context";
import { GarageProvider } from "@/lib/garage-context";
import { LazyMotion, domMax } from "framer-motion";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.error("Service worker registration failed:", err);
      });
    }
  }, []);

  return (
    <LazyMotion features={domMax}>
      <ThemeProvider>
        <CurrencyProvider>
          <GarageProvider>{children}</GarageProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </LazyMotion>
  );
}

export default Providers;
