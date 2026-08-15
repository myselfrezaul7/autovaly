"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Vehicle } from "./types";

interface GarageContextType {
  garage: Vehicle[];
  addToGarage: (vehicle: Vehicle) => void;
  removeFromGarage: (vehicleId: string) => void;
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
        setGarage(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse garage from localStorage", e);
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "autovaly_garage" && e.newValue) {
        try {
          setGarage(JSON.parse(e.newValue));
        } catch {}
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
      } catch (e) {
        console.error("Failed to save garage", e);
      }
      return updated;
    });
  }, []);

  const removeFromGarage = useCallback((vehicleId: string) => {
    setGarage((prev) => {
      const updated = prev.filter((v) => v.id !== vehicleId);
      try {
        localStorage.setItem("autovaly_garage", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to remove from garage", e);
      }
      return updated;
    });
  }, []);

  const isInGarage = useCallback(
    (vehicleId: string) => garage.some((v) => v.id === vehicleId),
    [garage]
  );

  return (
    <GarageContext.Provider
      value={{
        garage,
        addToGarage,
        removeFromGarage,
        isInGarage,
        garageCount: garage.length,
      }}
    >
      {children}
    </GarageContext.Provider>
  );
}

export function useGarage() {
  const context = useContext(GarageContext);
  if (!context) {
    throw new Error("useGarage must be used within a GarageProvider");
  }
  return context;
}
