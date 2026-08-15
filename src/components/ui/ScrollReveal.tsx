"use client";

import { m, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const initialVariants = {
    up: { opacity: 0, y: 25 },
    left: { opacity: 0, x: -25 },
    right: { opacity: 0, x: 25 },
  };

  const animateVariants = {
    up: { opacity: 1, y: 0 },
    left: { opacity: 1, x: 0 },
    right: { opacity: 1, x: 0 },
  };

  if (shouldReduceMotion) {
    return <div className={clsx(className)}>{children}</div>;
  }

  return (
    <m.div
      initial={initialVariants[direction]}
      whileInView={animateVariants[direction]}
      viewport={{ once: true, margin: "-25px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
      className={clsx(className)}
    >
      {children}
    </m.div>
  );
}
