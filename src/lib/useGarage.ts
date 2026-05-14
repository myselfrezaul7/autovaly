"use client";

import { useState, useEffect } from "react";
import { Vehicle } from "./types";

export function useGarage() {
  const [garage, setGarage] = useState<Vehicle[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("autovaly_garage");
      if (stored) {
        setGarage(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse garage", e);
    }
  }, []);

  const addToGarage = (vehicle: Vehicle) => {
    try {
      const stored = localStorage.getItem("autovaly_garage");
      let current: Vehicle[] = stored ? JSON.parse(stored) : [];
      
      // Remove if already exists (shouldn't happen with proper UI but safe)
      current = current.filter(v => v.id !== vehicle.id);
      
      // Add to beginning
      current.unshift(vehicle);
      
      // Keep only last 20
      if (current.length > 20) {
        current = current.slice(0, 20);
      }
      
      localStorage.setItem("autovaly_garage", JSON.stringify(current));
      setGarage(current);
    } catch (e) {
      console.error("Failed to save garage", e);
    }
  };

  const removeFromGarage = (vehicleId: string) => {
    try {
      const current = garage.filter(v => v.id !== vehicleId);
      localStorage.setItem("autovaly_garage", JSON.stringify(current));
      setGarage(current);
    } catch (e) {
      console.error("Failed to remove from garage", e);
    }
  };

  const isInGarage = (vehicleId: string) => {
    return garage.some(v => v.id === vehicleId);
  };

  return { garage, addToGarage, removeFromGarage, isInGarage, garageCount: garage.length };
}
