"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/lib/useRecentlyViewed";
import { Vehicle } from "@/lib/types";

export default function TrackView({ vehicle }: { vehicle: Vehicle }) {
  const { addVehicle } = useRecentlyViewed();

  useEffect(() => {
    addVehicle(vehicle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle.id]);

  return null;
}
