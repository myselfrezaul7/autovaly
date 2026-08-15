"use client";

import { useRef, useState, useEffect } from "react";
import clsx from "clsx";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export default function TiltCard({ children, className, glowColor = "var(--accent)" }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const [, setIsHovered] = useState(false);
  const [supportsHover, setSupportsHover] = useState(true);

  useEffect(() => {
    setSupportsHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!supportsHover || !cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      boxShadow: `0 20px 40px rgba(0,0,0,0.2), 0 0 20px color-mix(in srgb, ${glowColor} 25%, transparent)`,
      borderColor: glowColor,
    });
  };

  const handleMouseLeave = () => {
    if (!supportsHover) return;
    setIsHovered(false);
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      boxShadow: "0 4px 6px -1px var(--card-shadow), 0 2px 4px -1px var(--card-shadow)",
      borderColor: "var(--border-custom)",
    });
  };

  const handleMouseEnter = () => {
    if (!supportsHover) return;
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={clsx(
        "transition-all duration-300 ease-out will-change-transform rounded-xl border border-border-custom bg-surface",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
