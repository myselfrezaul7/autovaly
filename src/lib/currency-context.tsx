"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Currency = "EUR" | "USD";

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  formatPrice: (eurAmount: number, usdAmount: number) => string;
  mounted: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    try {
      const stored = localStorage.getItem("currency") as Currency;
      if (stored) {
        setTimeout(() => setCurrency(stored), 0);
      }
    } catch (e) {
      console.error("Failed to access localStorage for currency", e);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "currency" && (e.newValue === "EUR" || e.newValue === "USD")) {
        setCurrency(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleCurrency = () => {
    const newCurrency = currency === "EUR" ? "USD" : "EUR";
    setCurrency(newCurrency);
    try {
      localStorage.setItem("currency", newCurrency);
    } catch (e) {
      console.error("Failed to save currency to localStorage", e);
    }
  };

  const formatPrice = (eurAmount: number, usdAmount: number) => {
    if (currency === "EUR") {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(eurAmount);
    } else {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(usdAmount);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, toggleCurrency, formatPrice, mounted }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
