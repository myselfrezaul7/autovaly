"use client";

import { m, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}

export default function AnimatedCounter({
  value,
  suffix = "",
  duration = 1.5,
  decimals,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: duration * 1000,
  });

  const displayDecimals = decimals ?? (Number.isInteger(value) ? 0 : 1);
  const display = useTransform(spring, (current) => {
    return (displayDecimals > 0 ? current.toFixed(displayDecimals) : Math.round(current).toString()) + suffix;
  });

  useEffect(() => {
    if (inView) {
      spring.set(value);
    }
  }, [inView, spring, value]);

  return <m.span ref={ref} className={className ? `tabular-nums ${className}` : "tabular-nums"}>{display}</m.span>;
}
