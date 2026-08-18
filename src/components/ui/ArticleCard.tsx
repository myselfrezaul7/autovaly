"use client";

import { m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { Article } from "@/lib/types";
import { getCategoryTagColor, formatDate } from "@/lib/content";

export interface ArticleCardProps {
  variant?: "large" | "compact" | "portrait" | "segment";
  article?: Article;
  slug?: string;
  tag?: string;
  tagColorClass?: string;
  headline?: string;
  excerpt?: string;
  author?: string;
  date?: string;
  readTime?: string;
  gradientFrom?: string;
  gradientTo?: string;
  coverImage?: string;
}

export default function ArticleCard({
  variant = "large",
  article,
  slug,
  tag,
  tagColorClass,
  headline,
  excerpt,
  author,
  date,
  readTime,
  gradientFrom,
  gradientTo,
  coverImage,
}: ArticleCardProps) {
  // Support either full Article object or individual props
  const finalSlug = article ? article.slug : slug;
  const finalTag = article ? article.category : tag || "News";
  const finalTagColorClass = article
    ? getCategoryTagColor(article.category)
    : tagColorClass || "bg-tag-news";
  const finalHeadline = article ? article.title : headline || "";
  const finalExcerpt = article ? article.excerpt : excerpt;
  const finalAuthor = article ? article.author.name : author || "Autovaly";
  const finalDate = article ? formatDate(article.publishedAt) : date || "";
  const finalReadTime = article ? article.readTime : readTime;
  const finalGradientFrom = article ? article.coverGradient.from : gradientFrom || "#1e293b";
  const finalGradientTo = article ? article.coverGradient.to : gradientTo || "#0f172a";
  const finalCoverImage = article ? article.coverImage : coverImage;

  const isCompact = variant === "compact";
  const isPortrait = variant === "portrait";
  const isSegment = variant === "segment";

  const content = (
    <m.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={clsx(
        "group bg-surface border border-border-custom rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex",
        {
          "flex-col": !isCompact,
          "flex-row": isCompact,
          "min-w-[280px] w-[280px] snap-center": isPortrait,
        }
      )}
    >
      <div
        className={clsx("relative overflow-hidden flex-shrink-0", {
          "w-[40%] min-h-[140px]": isCompact,
          "w-full h-[320px]": variant === "large",
          "w-full h-[180px]": isSegment,
          "w-full h-[380px]": isPortrait,
        })}
      >
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          style={{ backgroundImage: `linear-gradient(135deg, ${finalGradientFrom}, ${finalGradientTo})` }}
          aria-hidden="true"
        />
        {finalCoverImage && (
          <Image
            src={finalCoverImage}
            alt={finalHeadline}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] opacity-90 group-hover:opacity-100"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" aria-hidden="true" />
      </div>
      <div
        className={clsx("flex flex-col flex-1", {
          "p-5": variant === "large" || isSegment,
          "p-4": isCompact,
          "absolute bottom-0 left-0 w-full p-5 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent": isPortrait,
        })}
      >
        <span className={clsx("inline-block self-start text-[10px] font-bold uppercase tracking-widest rounded-sm mb-2 text-white px-2 py-0.5", finalTagColorClass)}>
          {finalTag}
        </span>
        <h3
          className={clsx("font-heading font-bold leading-[1.2] transition-colors duration-300 group-hover:text-accent text-text-light", {
            "text-xl mb-3 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 group-hover:after:w-10": variant === "large",
            "text-base mb-2": isCompact,
            "text-lg": isSegment,
            "text-xl text-white": isPortrait,
          })}
        >
          {finalHeadline}
        </h3>
        {finalExcerpt && !isCompact && !isPortrait && (
          <p className="text-sm text-text-muted leading-relaxed mb-4 flex-1 line-clamp-2">{finalExcerpt}</p>
        )}
        <div className={clsx("flex items-center gap-2 text-[13px] mt-auto flex-wrap", isPortrait ? "text-gray-300" : "text-text-muted")}>
          {!isCompact && !isPortrait && <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-red-400 flex-shrink-0" aria-hidden="true" />}
          <span className="font-medium text-text-light">{finalAuthor}</span>
          <span className="opacity-50" aria-hidden="true">·</span>
          <span>{finalDate}</span>
          {finalReadTime && (
            <>
              <span className="opacity-50" aria-hidden="true">·</span>
              <span>{finalReadTime}</span>
            </>
          )}
        </div>
      </div>
    </m.article>
  );

  if (finalSlug) return <Link href={`/articles/${finalSlug}`} className="block">{content}</Link>;
  return content;
}
