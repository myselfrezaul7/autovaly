"use client";

import { useCurrency } from "@/lib/currency-context";

interface PriceProps {
  eurAmount: number;
  usdAmount: number;
  className?: string;
}

export default function Price({ eurAmount, usdAmount, className = "" }: PriceProps) {
  const { formatPrice } = useCurrency();
  
  return (
    <span className={className}>
      {formatPrice(eurAmount, usdAmount)}
    </span>
  );
}
