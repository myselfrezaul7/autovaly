import { fetchSanityData } from "./sanity.service";
import { articles as mockArticles } from "@/lib/data/articles";
import { Article, ArticleCategory, VehicleSegment } from "@/lib/types";

const ARTICLE_GROQ_FIELDS = `
  _id,
  "id": _id,
  "slug": slug.current,
  title,
  excerpt,
  body,
  category,
  segments,
  author->{name, "slug": slug.current},
  publishedAt,
  readTime,
  featured,
  editorsPick,
  heroArticle,
  coverGradient,
  "coverImage": coverImage.asset->url
`;

export async function getAllArticles(): Promise<Article[]> {
  const sanityArticles = await fetchSanityData<Article[]>(
    `*[_type == "article"] | order(publishedAt desc) { ${ARTICLE_GROQ_FIELDS} }`,
    {},
    ["articles"]
  );

  if (sanityArticles && sanityArticles.length > 0) {
    return sanityArticles;
  }

  return [...mockArticles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getHeroArticle(): Promise<Article> {
  const all = await getAllArticles();
  return all.find((a) => a.heroArticle) || all[0];
}

export async function getTopStories(limit = 4): Promise<Article[]> {
  const all = await getAllArticles();
  return all.filter((a) => a.featured).slice(0, limit);
}

export async function getArticlesBySegment(segment: VehicleSegment | "All"): Promise<Article[]> {
  const all = await getAllArticles();
  if (segment === "All") return all;
  return all.filter((a) => a.segments.includes(segment));
}

export async function getArticlesByCategory(category: ArticleCategory): Promise<Article[]> {
  const all = await getAllArticles();
  return all
    .filter((a) => a.category === category)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getEditorsPicks(): Promise<Article[]> {
  const all = await getAllArticles();
  return all.filter((a) => a.editorsPick);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const all = await getAllArticles();
  return all.find((a) => a.slug === slug);
}

export async function getRelatedArticles(articleId: string, limit = 3): Promise<Article[]> {
  const all = await getAllArticles();
  const article = all.find((a) => a.id === articleId || a.slug === articleId);
  if (!article) return [];
  return all
    .filter(
      (a) =>
        a.id !== article.id &&
        (a.category === article.category || a.segments.some((s) => article.segments.includes(s)))
    )
    .slice(0, limit);
}

export function searchArticles(query: string, articlesList: Article[] = mockArticles): Article[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return articlesList.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.author.name.toLowerCase().includes(q)
  );
}
