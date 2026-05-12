export type ArticleCategory = "EV" | "Review" | "News" | "Industry" | "Comparison";
export type VehicleSegment = "Sedans" | "SUVs" | "Trucks" | "Sports Cars" | "EVs" | "Hybrids" | "Luxury" | "Budget Picks";

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
}

export interface ComparisonData {
  id: string;
  slug: string;
  carA: { name: string; gradient: { from: string; to: string } };
  carB: { name: string; gradient: { from: string; to: string } };
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
}

export interface TickerHeadline {
  id: string;
  text: string;
  url: string;
  isLive?: boolean;
}
