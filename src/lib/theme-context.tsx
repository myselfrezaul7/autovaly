"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") {
        setTimeout(() => setTheme(saved), 0);
        document.documentElement.classList.remove("dark", "light");
        document.documentElement.classList.add(saved);
      } else {
        const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
        const initialTheme = prefersLight ? "light" : "dark";
        setTimeout(() => setTheme(initialTheme), 0);
        document.documentElement.classList.remove("dark", "light");
        document.documentElement.classList.add(initialTheme);
      }
    } catch (e) {
      console.error("Failed to access localStorage for theme", e);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "theme" && (e.newValue === "dark" || e.newValue === "light")) {
        setTheme(e.newValue);
        document.documentElement.classList.remove("dark", "light");
        document.documentElement.classList.add(e.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("theme", newTheme);
      } catch (e) {
        console.error("Failed to save theme in localStorage", e);
      }
      
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(newTheme);
      return newTheme;
    });
  }, []);

  const contextValue = useMemo(
    () => ({ theme, toggleTheme, mounted }),
    [theme, toggleTheme, mounted]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
