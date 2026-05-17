"use client";

import { useRef } from "react";
import ReadingProgress from "./ui/ReadingProgress";

interface ArticleBodyProps {
  content: string;
  readTime: string;
}

export default function ArticleBody({ content, readTime }: ArticleBodyProps) {
  const articleRef = useRef<HTMLDivElement>(null);

  // Split content by double newline to create paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim() !== '');

  return (
    <>
      <ReadingProgress articleRef={articleRef} readTime={readTime} />
      <div ref={articleRef} className="prose prose-invert prose-lg max-w-none text-text-light/90">
        {paragraphs.map((paragraph, idx) => {
          if (paragraph.startsWith('##')) {
            return <h2 key={idx} className="font-heading font-bold text-3xl mt-12 mb-6 text-white">{paragraph.replace('##', '').trim()}</h2>;
          }
          if (paragraph.startsWith('>')) {
            return (
              <blockquote key={idx} className="border-l-[5px] border-accent pl-6 py-3 my-10 italic text-xl md:text-2xl text-white/90 bg-surface/50 rounded-r-lg font-heading">
                "{paragraph.replace('>', '').trim()}"
              </blockquote>
            );
          }
          if (paragraph.startsWith('-')) {
            const items = paragraph.split('\n').map(i => i.replace('-', '').trim());
            return (
              <ul key={idx} className="list-disc pl-6 mb-8 space-y-2">
                {items.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            );
          }
          return <p key={idx} className="mb-8 leading-relaxed">{paragraph}</p>;
        })}
      </div>
    </>
  );
}
