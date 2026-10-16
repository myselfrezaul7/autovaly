"use client";

import { useState, useEffect, useCallback } from "react";
import { Vehicle } from "./types";

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<Vehicle[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("autovaly_recent_vehicles");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTimeout(() => setRecentlyViewed(parsed), 0);
        }
      }
    } catch (e) {
      console.error("Failed to parse recently viewed", e);
    }
  }, []);

  const addVehicle = useCallback((vehicle: Vehicle) => {
    try {
      setRecentlyViewed((prev) => {
        const current = Array.isArray(prev) ? prev.filter((v) => v.id !== vehicle.id) : [];
        const updated = [vehicle, ...current].slice(0, 6);
        try {
          localStorage.setItem("autovaly_recent_vehicles", JSON.stringify(updated));
        } catch (e) {
          console.error("Failed to save recently viewed", e);
        }
        return updated;
      });
    } catch (e) {
      console.error("Failed to save recently viewed", e);
    }
  }, []);

  return { recentlyViewed, addVehicle };
}
