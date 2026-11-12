import { Article, Vehicle, ClassicSpotlightItem } from "./types";

/**
 * Checks if a slug or text contains a needle bounded by string boundaries or hyphens.
 */
function slugContainsPart(haystack: string, needle: string): boolean {
  if (!needle || !haystack) return false;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|-)${escaped}(-|$)`).test(haystack);
}

/**
 * Finds the primary matching vehicle for a given article.
 * Compares article slug, title, and keywords against vehicle properties.
 * E.g., matches Taycan, F40, R1S, Mission X, Mission S, Roadster, etc.
 */
export function getMatchingVehicleForArticle(
  article: Article,
  allVehicles: Vehicle[]
): Vehicle | undefined {
  const artSlug = article.slug.toLowerCase();
  const artTitle = article.title.toLowerCase();
  const artExcerpt = (article.excerpt || "").toLowerCase();

  let bestVehicle: Vehicle | undefined;
  let highestScore = 0;

  for (const v of allVehicles) {
    let score = 0;
    const vSlug = v.slug.toLowerCase();
    const vMake = v.make.toLowerCase();
    const vModel = v.model.toLowerCase();
    const vTrim = (v.trim || "").toLowerCase();
    const vYear = v.year.toString();

    // 1. Direct exact slug match
    if (artSlug === vSlug) {
      score += 1000;
    } else if (slugContainsPart(artSlug, vSlug)) {
      score += 600;
    } else if (slugContainsPart(vSlug, artSlug)) {
      score += 500;
    }

    // 2. Make + Model slug match
    const makeModelSlug = `${vMake}-${vModel}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (slugContainsPart(artSlug, makeModelSlug)) {
      score += 400;
    }

    // 3. Make + Model in title
    const makeModelText = `${vMake} ${vModel}`;
    if (artTitle.includes(makeModelText)) {
      score += 350;
    }

    // 4. Model alone in slug (requires boundary and either length > 3 or make also present)
    const modelSlug = vModel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const hasMake = artTitle.includes(vMake) || slugContainsPart(artSlug, vMake.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    if ((modelSlug.length > 3 || (hasMake && modelSlug.length >= 2)) && slugContainsPart(artSlug, modelSlug)) {
      score += 200;
    }

    // 5. Model in title as distinct word
    if (vModel.length > 3 || (hasMake && vModel.length >= 2)) {
      const modelRegex = new RegExp(`\\b${vModel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (modelRegex.test(artTitle)) {
        score += 180;
      }
    }

    // 6. Make in title or slug
    if (hasMake) {
      score += 60;
    }

    // 7. Year match bonus if make/model matched
    if (score > 100 && (artTitle.includes(vYear) || artSlug.includes(vYear))) {
      score += 60;
    }

    // 8. Trim match bonus
    if (vTrim && vTrim.length > 2 && (artTitle.includes(vTrim) || artSlug.includes(vTrim))) {
      score += 80;
    }

    // 9. Excerpt secondary confirmation
    if (score > 0 && (artExcerpt.includes(makeModelText) || artExcerpt.includes(vSlug))) {
      score += 40;
    }

    if (score > highestScore) {
      highestScore = score;
      bestVehicle = v;
    }
  }

  // Minimum score threshold for genuine vehicle match
  if (highestScore >= 200 && bestVehicle) {
    return bestVehicle;
  }
  return undefined;
}

/**
 * Finds related editorial road tests and analysis articles for a vehicle.
 * Checks articles and classic spotlight items, matching vehicle's slug or model name.
 * Falls back to segment-related articles to guarantee at least `limit` articles.
 */
export function getRelatedArticlesForVehicle(
  vehicle: Vehicle,
  allArticles: Article[],
  classicSpotlightItems: ClassicSpotlightItem[] = [],
  limit = 3
): Article[] {
  const vSlug = vehicle.slug.toLowerCase();
  const vMake = vehicle.make.toLowerCase();
  const vModel = vehicle.model.toLowerCase();
  const vTrim = (vehicle.trim || "").toLowerCase();
  const vYear = vehicle.year.toString();

  // Find if there is a classic spotlight item for this vehicle
  const classicMatch = classicSpotlightItems.find(
    (c) => c.slug === vSlug || slugContainsPart(c.slug, vSlug) || slugContainsPart(vSlug, c.slug)
  );

  const scoredArticles = allArticles.map((article) => {
    let score = 0;
    const artSlug = article.slug.toLowerCase();
    const artTitle = article.title.toLowerCase();

    // 1. Direct slug match (e.g. classic car article or dedicated review)
    if (artSlug === vSlug || (classicMatch && artSlug === classicMatch.slug)) {
      score += 1000;
    } else if (slugContainsPart(artSlug, vSlug) || slugContainsPart(vSlug, artSlug)) {
      score += 600;
    }

    // 2. Make + Model in slug
    const makeModelSlug = `${vMake}-${vModel}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (slugContainsPart(artSlug, makeModelSlug)) {
      score += 400;
    }

    // 3. Make + Model in title
    if (artTitle.includes(vMake) && artTitle.includes(vModel)) {
      score += 350;
    }

    // 4. Model in title or slug
    const modelWords = vModel.split(/[\s-]+/).filter((w) => w.length > 2);
    for (const w of modelWords) {
      const regex = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (regex.test(artTitle)) score += 150;
      if (slugContainsPart(artSlug, w)) score += 150;
    }

    // 5. Make in title or slug
    if (artTitle.includes(vMake) || slugContainsPart(artSlug, vMake.replace(/[^a-z0-9]+/g, "-"))) {
      score += 50;
    }

    // 6. Year match bonus
    if (artTitle.includes(vYear) || artSlug.includes(vYear)) {
      score += 40;
    }

    // 7. Trim match bonus
    if (vTrim && vTrim.length > 2 && (artTitle.includes(vTrim) || artSlug.includes(vTrim))) {
      score += 50;
    }

    // 8. Segment overlap (sports cars, EVs, etc.)
    const segOverlap = article.segments.filter((s) => vehicle.segments.includes(s)).length;
    score += segOverlap * 20;

    // 9. Category bonus (Reviews and comparisons get slight boost)
    if (article.category === "Review" || article.category === "Comparison") {
      score += 15;
    }

    return { article, score };
  });

  // Sort by highest score first, break ties with most recent date
  scoredArticles.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.article.publishedAt).getTime() - new Date(a.article.publishedAt).getTime();
  });

  return scoredArticles.slice(0, limit).map((s) => s.article);
}
