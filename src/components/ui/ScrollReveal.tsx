"use client";

import { m } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  className?: string;
}

export default function ScrollReveal({ children, direction = "up", delay = 0, className }: ScrollRevealProps) {
  const initialVariants = {
    up: { opacity: 0, y: 30 },
    left: { opacity: 0, x: -30 },
    right: { opacity: 0, x: 30 },
  };

  const animateVariants = {
    up: { opacity: 1, y: 0 },
    left: { opacity: 1, x: 0 },
    right: { opacity: 1, x: 0 },
  };

  return (
    <m.div
      initial={initialVariants[direction]}
      whileInView={animateVariants[direction]}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={clsx(className)}
    >
      {children}
    </m.div>
  );
}
