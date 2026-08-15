import { ComparisonData } from "../types";

export const comparisons: ComparisonData[] = [
  {
    id: "c1",
    slug: "tesla-model-3-vs-bmw-m3",
    carA: { name: "Tesla Model 3", gradient: { from: "#2563eb", to: "#1e3a8a" }, slug: "tesla-model-3-long-range" },
    carB: { name: "BMW M3 Competition", gradient: { from: "#34495e", to: "#2c3e50" }, slug: "bmw-m3-competition" },
    specs: [
      { label: "Power", carA: "490 hp", carB: "530 hp" },
      { label: "0-100 km/h", carA: "4.4s", carB: "3.4s" },
      { label: "Base Price", carA: "€50,990", carB: "€100,000" },
    ],
    tagline: "Electric Precision vs M Division Legacy",
  },
  {
    id: "c2",
    slug: "hyundai-ioniq-5-n-vs-porsche-taycan",
    carA: { name: "Hyundai IONIQ 5 N", gradient: { from: "#0abde3", to: "#222f3e" }, slug: "hyundai-ioniq-5-n" },
    carB: { name: "Porsche Taycan 4S", gradient: { from: "#9c88ff", to: "#e1b12c" }, slug: "porsche-taycan-4s" },
    specs: [
      { label: "Power", carA: "650 hp", carB: "544 hp" },
      { label: "0-100 km/h", carA: "3.4s", carB: "3.7s" },
      { label: "Base Price", carA: "€74,900", carB: "€120,900" },
    ],
    tagline: "The Upstart vs The Benchmark",
  },
  {
    id: "c3",
    slug: "ford-maverick-vs-toyota-rav4-prime",
    carA: { name: "Ford Maverick Hybrid", gradient: { from: "#2ecc71", to: "#1a5276" }, slug: "ford-maverick-hybrid" },
    carB: { name: "Toyota RAV4 Prime", gradient: { from: "#34495e", to: "#95a5a6" }, slug: "toyota-rav4-prime" },
    specs: [
      { label: "Starting Price", carA: "€35,000", carB: "€55,000" },
      { label: "Power", carA: "191 hp", carB: "302 hp" },
      { label: "Utility", carA: "Truck Bed", carB: "Enclosed Cargo" },
    ],
    tagline: "Value King vs Plug-in Pioneer",
  },
  {
    id: "c4",
    slug: "rivian-r2-vs-tesla-model-y",
    carA: { name: "Rivian R2", gradient: { from: "#f1c40f", to: "#d35400" }, slug: "rivian-r2" },
    carB: { name: "Tesla Model Y", gradient: { from: "#E8232A", to: "#111318" }, slug: "tesla-model-y-long-range" },
    specs: [
      { label: "Estimated Price", carA: "$45,000", carB: "$47,990" },
      { label: "Range", carA: "480 km", carB: "600 km" },
      { label: "Vibe", carA: "Adventure", carB: "Minimalist Tech" },
    ],
    tagline: "The Challenger vs The King",
  },
  {
    id: "c5",
    slug: "mercedes-eqs-vs-bmw-ix",
    carA: { name: "Mercedes EQS", gradient: { from: "#95a5a6", to: "#7f8c8d" }, slug: "mercedes-eqs-sedan" },
    carB: { name: "BMW iX", gradient: { from: "#7f8c8d", to: "#bdc3c7" }, slug: "bmw-ix-xdrive50" },
    specs: [
      { label: "Range (WLTP)", carA: "822 km", carB: "630 km" },
      { label: "Battery", carA: "118 kWh", carB: "105 kWh" },
      { label: "Starting Price", carA: "€110,000", carB: "€107,000" },
    ],
    tagline: "German Flagship Showdown",
  }
];

export const featuredComparison = comparisons[0];
