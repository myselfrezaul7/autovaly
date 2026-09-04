"use client";

import { useRef, useEffect } from "react";
import clsx from "clsx";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export default function TiltCard({ children, className, glowColor = "var(--accent)" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    card.style.transition = "none";
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
      cardRef.current.style.boxShadow = `0 20px 40px rgba(0,0,0,0.25), 0 0 20px color-mix(in srgb, ${glowColor} 20%, transparent)`;
      cardRef.current.style.borderColor = glowColor;
    });
  };

  const handleMouseLeave = () => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    if (!cardRef.current) return;
    cardRef.current.style.transition = "transform 200ms ease-out, box-shadow 200ms ease-out, border-color 200ms ease-out";
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    cardRef.current.style.boxShadow = "0 4px 6px -1px var(--card-shadow), 0 2px 4px -1px var(--card-shadow)";
    cardRef.current.style.borderColor = "var(--border-custom)";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={clsx(
        "will-change-transform rounded-2xl border border-border-custom bg-surface",
        className
      )}
    >
      {children}
    </div>
  );
}
