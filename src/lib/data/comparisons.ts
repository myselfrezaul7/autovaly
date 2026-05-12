import { ComparisonData } from "../types";

export const featuredComparison: ComparisonData = {
  id: "c1",
  slug: "tesla-model-3-vs-bmw-i4",
  carA: { name: "Tesla Model 3", gradient: { from: "#2563eb", to: "#1e3a8a" } },
  carB: { name: "BMW i4", gradient: { from: "#9ca3af", to: "#4b5563" } },
  specs: [
    { label: "Range (WLTP)", carA: "629 km", carB: "590 km" },
    { label: "0-100 km/h", carA: "4.4s", carB: "5.6s" },
    { label: "Base Price", carA: "€50,990", carB: "€57,500" },
  ],
  tagline: "The Standard vs The Establishment",
};
