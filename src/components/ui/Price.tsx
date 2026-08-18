"use client";

import { useCurrency, eurFormatter } from "@/lib/currency-context";

interface PriceProps {
  eurAmount: number;
  usdAmount: number;
  className?: string;
}

export default function Price({ eurAmount, usdAmount, className = "" }: PriceProps) {
  const { formatPrice, mounted } = useCurrency();

  if (!mounted) {
    return (
      <span className={className} aria-label={`Price: ${eurFormatter.format(eurAmount)}`}>
        {eurFormatter.format(eurAmount)}
      </span>
    );
  }

  const formatted = formatPrice(eurAmount, usdAmount);

  return (
    <span className={className} aria-label={`Price: ${formatted}`}>
      {formatted}
    </span>
  );
}
