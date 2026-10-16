"use client";

import { ThemeProvider } from "@/lib/theme-context";
import { CurrencyProvider } from "@/lib/currency-context";
import { GarageProvider } from "@/lib/garage-context";
import { LazyMotion, domAnimation } from "framer-motion";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      const registerSw = () => {
        navigator.serviceWorker.register("/sw.js").catch((err) => {
          console.error("Service worker registration failed:", err);
        });
      };
      if (document.readyState === "complete") {
        registerSw();
      } else {
        window.addEventListener("load", registerSw, { once: true });
        return () => window.removeEventListener("load", registerSw);
      }
    }
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <ThemeProvider>
        <CurrencyProvider>
          <GarageProvider>{children}</GarageProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </LazyMotion>
  );
}

export default Providers;
