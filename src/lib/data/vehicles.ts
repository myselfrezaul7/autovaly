import { Vehicle } from "../types";
import { existingVehicles } from "./vehicles-existing";
import { modernVehicles } from "./vehicles-modern";
import { retroVehicles } from "./vehicles-retro";

export const vehicles: Vehicle[] = [
  ...existingVehicles,
  ...modernVehicles,
  ...retroVehicles,
];
