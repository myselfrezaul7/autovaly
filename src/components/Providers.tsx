"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { ThemeProvider } from "@/lib/theme-context";
import { CurrencyProvider } from "@/lib/currency-context";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <LazyMotion features={domAnimation}>
          {children}
        </LazyMotion>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
