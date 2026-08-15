import { articles } from "./data/articles";
import { vehicles } from "./data/vehicles";
import { Article, ArticleCategory, VehicleSegment, Vehicle, FuelType, BodyStyle } from "./types";

const TAG_COLORS: Record<ArticleCategory, string> = {
  EV: "bg-tag-ev",
  Review: "bg-tag-review",
  News: "bg-tag-news",
  Industry: "bg-tag-industry text-black",
  Comparison: "bg-tag-comparison",
};

export function getAllArticles(): Article[] {
  return [...articles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getHeroArticle(): Article {
  return articles.find((a) => a.heroArticle) || articles[0];
}

export function getHeroArticles(limit = 4): Article[] {
  const hero = articles.find((a) => a.heroArticle) || articles[0];
  const others = articles.filter((a) => a.id !== hero.id && a.featured).slice(0, limit - 1);
  return [hero, ...others];
}

export function getTopStories(limit = 4): Article[] {
  return articles.filter((a) => a.featured).slice(0, limit);
}

export function getArticlesBySegment(segment: VehicleSegment | "All"): Article[] {
  if (segment === "All") return getAllArticles();
  return articles.filter((a) => a.segments.includes(segment));
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return articles.filter((a) => a.category === category).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getEditorsPicks(): Article[] {
  return articles.filter((a) => a.editorsPick);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(articleId: string, limit = 3): Article[] {
  const article = articles.find((a) => a.id === articleId);
  if (!article) return [];
  return articles
    .filter((a) => a.id !== articleId && (a.category === article.category || a.segments.some((s) => article.segments.includes(s))))
    .slice(0, limit);
}

export function getCategoryTagColor(category: ArticleCategory): string {
  return TAG_COLORS[category] || "bg-tag-news";
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function searchArticles(query: string): Article[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.author.name.toLowerCase().includes(q)
  );
}

// Vehicle utilities
export function getAllVehicles(): Vehicle[] {
  return [...vehicles].sort((a, b) => a.make.localeCompare(b.make));
}

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return vehicles.find((v) => v.slug === slug);
}

export function getVehiclesByFuelType(fuelType: FuelType): Vehicle[] {
  return vehicles.filter((v) => v.fuelType === fuelType);
}

export function getVehiclesByBodyStyle(bodyStyle: BodyStyle): Vehicle[] {
  return vehicles.filter((v) => v.bodyStyle === bodyStyle);
}

export function getFeaturedVehicles(): Vehicle[] {
  return vehicles.filter((v) => v.featured);
}

export function getNew2025Vehicles(): Vehicle[] {
  return vehicles.filter((v) => v.new2025);
}

export function searchVehicles(query: string): Vehicle[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return vehicles.filter(
    (v) =>
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.trim.toLowerCase().includes(q) ||
      v.fuelType.toLowerCase().includes(q) ||
      v.bodyStyle.toLowerCase().includes(q) ||
      v.segments.some((s) => s.toLowerCase().includes(q)) ||
      v.year.toString().includes(q)
  );
}
