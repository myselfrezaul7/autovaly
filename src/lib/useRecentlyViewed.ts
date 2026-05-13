"use client";

import { useState, useEffect } from "react";
import { Vehicle } from "./types";

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<Vehicle[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("autovaly_recent_vehicles");
      if (stored) {
        setRecentlyViewed(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse recently viewed", e);
    }
  }, []);

  const addVehicle = (vehicle: Vehicle) => {
    try {
      const stored = localStorage.getItem("autovaly_recent_vehicles");
      let current: Vehicle[] = stored ? JSON.parse(stored) : [];
      
      // Remove if already exists to move to top
      current = current.filter(v => v.id !== vehicle.id);
      
      // Add to beginning
      current.unshift(vehicle);
      
      // Keep only last 6
      if (current.length > 6) {
        current = current.slice(0, 6);
      }
      
      localStorage.setItem("autovaly_recent_vehicles", JSON.stringify(current));
      setRecentlyViewed(current);
    } catch (e) {
      console.error("Failed to save recently viewed", e);
    }
  };

  return { recentlyViewed, addVehicle };
}
