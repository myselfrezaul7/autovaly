"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ReadingProgress from "./ui/ReadingProgress";

interface ArticleBodyProps {
  content: string;
  readTime: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function renderFormattedText(text: string) {
  // Regex parsing for bold **text** and inline links [text](url)
  const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-bold text-text-light">
          {part.slice(2, -2)}
        </strong>
      );
    }

    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const href = linkMatch[2];
      const isExternal = href.startsWith("http");

      if (isExternal) {
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-semibold underline underline-offset-2 hover:text-accent-dark transition-colors"
          >
            {linkText}
          </a>
        );
      }

      return (
        <Link
          key={index}
          href={href}
          className="text-accent font-semibold underline underline-offset-2 hover:text-accent-dark transition-colors"
        >
          {linkText}
        </Link>
      );
    }

    return part;
  });
}

export default function ArticleBody({ content, readTime }: ArticleBodyProps) {
  const articleRef = useRef<HTMLDivElement>(null);
  const paragraphs = content.split("\n\n").filter((p) => p.trim() !== "");

  return (
    <>
      <ReadingProgress articleRef={articleRef} readTime={readTime} />
      <div ref={articleRef} className="prose prose-lg max-w-none text-text-primary">
        {paragraphs.map((paragraph, idx) => {
          const trimmed = paragraph.trim();

          // Image block: ![Caption | Picture courtesy of Source](url)
          const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
          if (imgMatch) {
            const rawAlt = imgMatch[1];
            const src = imgMatch[2];
            const [captionPart, courtesyPart] = rawAlt.split("|").map((s) => s.trim());
            const caption = captionPart || "Vehicle Showcase";
            const courtesy = courtesyPart || "Picture courtesy of Manufacturer";

            return (
              <figure key={idx} className="my-10 overflow-hidden rounded-2xl border border-border-custom bg-surface shadow-2xl">
                <div className="relative w-full h-64 sm:h-80 md:h-[460px] bg-background">
                  <Image
                    src={src}
                    alt={caption}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 850px"
                  />
                </div>
                <figcaption className="px-5 py-3.5 bg-surface/90 border-t border-border-custom flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="text-text-light font-medium">{caption}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent tracking-wider uppercase bg-accent/10 px-2.5 py-0.5 rounded border border-accent/20 self-start sm:self-auto">
                    📷 {courtesy}
                  </span>
                </figcaption>
              </figure>
            );
          }

          // H3 Heading with ID
          if (trimmed.startsWith("###")) {
            const headingText = trimmed.replace(/^###\s*/, "");
            const headingId = slugify(headingText);
            return (
              <h3
                key={idx}
                id={headingId}
                className="font-heading font-bold text-xl sm:text-2xl mt-10 mb-4 text-text-light flex items-center gap-2 scroll-mt-24 group"
              >
                <span className="w-2 h-2 rounded-full bg-accent inline-block" />
                <span>{headingText}</span>
                <a
                  href={`#${headingId}`}
                  className="opacity-0 group-hover:opacity-60 hover:!opacity-100 text-accent ml-2 text-sm transition-opacity"
                  aria-label={`Link to ${headingText}`}
                >
                  #
                </a>
              </h3>
            );
          }

          // H2 Heading with ID
          if (trimmed.startsWith("##")) {
            const headingText = trimmed.replace(/^##\s*/, "");
            const headingId = slugify(headingText);
            return (
              <h2
                key={idx}
                id={headingId}
                className="font-heading font-bold text-2xl sm:text-3xl mt-12 mb-6 text-text-light pb-2 border-b border-border-custom/50 flex items-center justify-between scroll-mt-24 group"
              >
                <span>{headingText}</span>
                <a
                  href={`#${headingId}`}
                  className="opacity-0 group-hover:opacity-60 hover:!opacity-100 text-accent text-lg transition-opacity"
                  aria-label={`Link to ${headingText}`}
                >
                  #
                </a>
              </h2>
            );
          }

          // Blockquote
          if (trimmed.startsWith(">")) {
            return (
              <blockquote
                key={idx}
                className="border-l-[5px] border-accent pl-6 py-4 my-10 italic text-lg sm:text-xl text-text-primary/95 bg-surface/70 rounded-r-2xl font-heading shadow-inner"
              >
                &ldquo;{trimmed.replace(/^>\s*/, "")}&rdquo;
              </blockquote>
            );
          }

          // Bullet List
          if (trimmed.startsWith("-")) {
            const items = trimmed
              .split("\n")
              .map((i) => i.replace(/^-\s*/, "").trim())
              .filter(Boolean);
            return (
              <ul key={idx} className="list-disc pl-6 mb-8 space-y-2.5 text-text-primary/90">
                {items.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    {renderFormattedText(item)}
                  </li>
                ))}
              </ul>
            );
          }

          // Standard Paragraph
          return (
            <p key={idx} className="mb-8 leading-relaxed text-base sm:text-lg text-text-primary/90">
              {renderFormattedText(trimmed)}
            </p>
          );
        })}
      </div>
    </>
  );
}
