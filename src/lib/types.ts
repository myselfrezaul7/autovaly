export type ArticleCategory = "EV" | "Review" | "News" | "Industry" | "Comparison";
export type VehicleSegment = "Sedans" | "SUVs" | "Trucks" | "Sports Cars" | "EVs" | "Hybrids" | "Luxury" | "Budget Picks";
export type FuelType = "BEV" | "PHEV" | "Hybrid" | "Gasoline" | "Diesel";
export type BodyStyle = "Sedan" | "SUV" | "Truck" | "Hatchback" | "Wagon" | "Coupe" | "Convertible";

export interface Author {
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: ArticleCategory;
  segments: VehicleSegment[];
  author: Author;
  publishedAt: string;
  readTime: string;
  featured: boolean;
  editorsPick: boolean;
  heroArticle: boolean;
  coverGradient: { from: string; to: string };
  coverImage?: string;
}

export interface ComparisonData {
  id: string;
  slug: string;
  carA: { name: string; gradient: { from: string; to: string }; slug?: string };
  carB: { name: string; gradient: { from: string; to: string }; slug?: string };
  specs: { label: string; carA: string; carB: string }[];
  tagline: string;
}

export interface EVSpotlightItem {
  id: string;
  slug: string;
  range: string;
  chargingSpeed: string;
  headline: string;
  excerpt: string;
  gradient: { from: string; to: string };
  coverImage?: string;
}

export interface ClassicSpotlightItem {
  id: string;
  slug: string;
  year: number;
  engine: string;
  power: string;
  topSpeed?: string;
  acceleration?: string;
  era: string;
  eraCategory: "all" | "50s-60s" | "70s" | "80s-90s";
  name: string;
  headline: string;
  excerpt: string;
  gradient: { from: string; to: string };
  status: string;
  coverImage?: string;
}

export interface TickerHeadline {
  id: string;
  text: string;
  url: string;
  isLive?: boolean;
}

export interface VehicleSpecs {
  powerHp: number;
  torqueNm: number;
  acceleration060: number;    // 0-100 km/h or 0-60 mph in seconds
  topSpeedKmh: number;
  weightKg: number;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  wheelbaseMm: number;
  cargoLiters: number;
  seatingCapacity: number;
  drivetrain: "FWD" | "RWD" | "AWD";
}

export interface EVSpecs {
  batteryKwh: number;
  rangeKm: number;             // WLTP
  rangeMiles: number;          // EPA
  chargingSpeedKw: number;     // Peak DC
  chargingTime1080: string;    // e.g. "18 min"
  efficiency: string;          // e.g. "15.2 kWh/100km"
}

export interface Vehicle {
  id: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  fuelType: FuelType;
  bodyStyle: BodyStyle;
  priceEur: number;
  priceUsd: number;
  specs: VehicleSpecs;
  evSpecs?: EVSpecs;
  highlights: string[];
  prosAndCons: { pros: string[]; cons: string[] };
  coverGradient: { from: string; to: string };
  coverImage?: string;
  segments: VehicleSegment[];
  featured: boolean;
  new2025: boolean;
}
