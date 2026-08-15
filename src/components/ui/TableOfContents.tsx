"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const lines = content.split("\n\n");
    const extracted: TocItem[] = [];

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("## ")) {
        const text = trimmed.replace(/^##\s*/, "");
        extracted.push({ id: slugify(text), text, level: 2 });
      } else if (trimmed.startsWith("### ")) {
        const text = trimmed.replace(/^###\s*/, "");
        extracted.push({ id: slugify(text), text, level: 3 });
      }
    });

    setHeadings(extracted);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="p-5 rounded-2xl bg-surface border border-border-custom text-xs shadow-lg">
      <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-text-light mb-3 flex items-center gap-1.5">
        <span>📑</span> Table of Contents
      </h4>
      <ul className="space-y-2 text-text-muted">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;
          return (
            <li
              key={heading.id}
              className={heading.level === 3 ? "pl-3 text-[11px]" : "font-medium"}
            >
              <a
                href={`#${heading.id}`}
                className={`block transition-colors hover:text-accent ${
                  isActive ? "text-accent font-bold pl-1 border-l-2 border-accent" : ""
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
