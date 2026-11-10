"use client";

import AeroStudioCanvas from "./AeroStudioCanvas";
import { Vehicle } from "@/lib/types";

export interface AeroStudioViewProps {
  vehicle: Vehicle;
}

export default function AeroStudioView({ vehicle }: AeroStudioViewProps) {
  return <AeroStudioCanvas vehicle={vehicle} />;
}
