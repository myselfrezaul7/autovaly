"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { Vehicle } from "./types";

interface GarageContextType {
  garage: Vehicle[];
  addToGarage: (vehicle: Vehicle) => void;
  removeFromGarage: (vehicleId: string) => void;
  clearGarage: () => void;
  isInGarage: (vehicleId: string) => boolean;
  garageCount: number;
}

const GarageContext = createContext<GarageContextType | undefined>(undefined);

export function GarageProvider({ children }: { children: React.ReactNode }) {
  const [garage, setGarage] = useState<Vehicle[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("autovaly_garage");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setGarage(parsed);
        }
      }
    } catch {
      // ignore JSON parse error
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "autovaly_garage" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setGarage(parsed);
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const addToGarage = useCallback((vehicle: Vehicle) => {
    setGarage((prev) => {
      const updated = [vehicle, ...prev.filter((v) => v.id !== vehicle.id)].slice(0, 20);
      try {
        localStorage.setItem("autovaly_garage", JSON.stringify(updated));
      } catch {
        // ignore storage error
      }
      return updated;
    });
  }, []);

  const removeFromGarage = useCallback((vehicleId: string) => {
    setGarage((prev) => {
      const updated = prev.filter((v) => v.id !== vehicleId);
      try {
        localStorage.setItem("autovaly_garage", JSON.stringify(updated));
      } catch {
        // ignore storage error
      }
      return updated;
    });
  }, []);

  const clearGarage = useCallback(() => {
    setGarage([]);
    try {
      localStorage.removeItem("autovaly_garage");
    } catch {
      // ignore
    }
  }, []);

  const garageIds = useMemo(() => new Set(garage.map((v) => v.id)), [garage]);

  const isInGarage = useCallback(
    (vehicleId: string) => garageIds.has(vehicleId),
    [garageIds]
  );

  const contextValue = useMemo(
    () => ({
      garage,
      addToGarage,
      removeFromGarage,
      clearGarage,
      isInGarage,
      garageCount: garage.length,
    }),
    [garage, addToGarage, removeFromGarage, clearGarage, isInGarage]
  );

  return <GarageContext.Provider value={contextValue}>{children}</GarageContext.Provider>;
}

export function useGarage() {
  const context = useContext(GarageContext);
  if (!context) {
    throw new Error("useGarage must be used within a GarageProvider");
  }
  return context;
}
