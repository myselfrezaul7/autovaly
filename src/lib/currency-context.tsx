"use client";

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";

export type Currency = "EUR" | "USD";

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  setCurrency: (currency: Currency) => void;
  formatPrice: (eurAmount: number, usdAmount: number) => string;
  mounted: boolean;
}

// Module-level cached formatters to prevent garbage collection in render loops
export const eurFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("EUR");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("currency") as Currency;
      if (stored === "EUR" || stored === "USD") {
        setCurrencyState(stored);
      }
    } catch {
      // ignore localStorage error
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "currency" && (e.newValue === "EUR" || e.newValue === "USD")) {
        setCurrencyState(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    try {
      localStorage.setItem("currency", newCurrency);
    } catch {
      // ignore localStorage error
    }
  }, []);

  const toggleCurrency = useCallback(() => {
    setCurrencyState((prev) => {
      const next = prev === "EUR" ? "USD" : "EUR";
      try {
        localStorage.setItem("currency", next);
      } catch {
        // ignore localStorage error
      }
      return next;
    });
  }, []);

  const formatPrice = useCallback(
    (eurAmount: number, usdAmount: number) => {
      return currency === "EUR" ? eurFormatter.format(eurAmount) : usdFormatter.format(usdAmount);
    },
    [currency]
  );

  const contextValue = useMemo(
    () => ({
      currency,
      toggleCurrency,
      setCurrency,
      formatPrice,
      mounted,
    }),
    [currency, toggleCurrency, setCurrency, formatPrice, mounted]
  );

  return <CurrencyContext.Provider value={contextValue}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
