"use client";

import { useRef } from "react";
import Image from "next/image";
import ReadingProgress from "./ui/ReadingProgress";

interface ArticleBodyProps {
  content: string;
  readTime: string;
}

function renderFormattedText(text: string) {
  // Simple markdown parser for **bold** text
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-text-light">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function ArticleBody({ content, readTime }: ArticleBodyProps) {
  const articleRef = useRef<HTMLDivElement>(null);

  // Split content by double newline to create paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim() !== '');

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
            const [captionPart, courtesyPart] = rawAlt.split('|').map(s => s.trim());
            const caption = captionPart || "Vehicle Showcase";
            const courtesy = courtesyPart || "Picture courtesy of Manufacturer";

            return (
              <figure key={idx} className="my-10 overflow-hidden rounded-xl border border-border-custom bg-surface shadow-xl">
                <div className="relative w-full h-64 sm:h-80 md:h-[440px] bg-background">
                  <Image
                    src={src}
                    alt={caption}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 850px"
                  />
                </div>
                <figcaption className="px-4 py-3 bg-surface/90 border-t border-border-custom flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="text-text-light font-medium">{caption}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent tracking-wider uppercase bg-accent/10 px-2.5 py-0.5 rounded border border-accent/20 self-start sm:self-auto">
                    📷 {courtesy}
                  </span>
                </figcaption>
              </figure>
            );
          }

          if (trimmed.startsWith('###')) {
            return (
              <h3 key={idx} className="font-heading font-bold text-2xl mt-10 mb-4 text-text-light flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent inline-block"></span>
                {trimmed.replace(/^###\s*/, '')}
              </h3>
            );
          }

          if (trimmed.startsWith('##')) {
            return (
              <h2 key={idx} className="font-heading font-bold text-2xl md:text-3xl mt-12 mb-6 text-text-light pb-2 border-b border-border-custom/50">
                {trimmed.replace(/^##\s*/, '')}
              </h2>
            );
          }

          if (trimmed.startsWith('>')) {
            return (
              <blockquote key={idx} className="border-l-[5px] border-accent pl-6 py-4 my-10 italic text-xl md:text-2xl text-text-primary/95 bg-surface/60 rounded-r-xl font-heading shadow-inner">
                &ldquo;{trimmed.replace(/^>\s*/, '')}&rdquo;
              </blockquote>
            );
          }

          if (trimmed.startsWith('-')) {
            const items = trimmed.split('\n').map(i => i.replace(/^-\s*/, '').trim()).filter(Boolean);
            return (
              <ul key={idx} className="list-disc pl-6 mb-8 space-y-2.5 text-text-primary">
                {items.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    {renderFormattedText(item)}
                  </li>
                ))}
              </ul>
            );
          }

          return (
            <p key={idx} className="mb-8 leading-relaxed text-base md:text-lg text-text-primary/90">
              {renderFormattedText(trimmed)}
            </p>
          );
        })}
      </div>
    </>
  );
}
