"use client";

import { useCurrency } from "@/lib/currency-context";

interface PriceProps {
  eurAmount: number;
  usdAmount: number;
  className?: string;
}

export default function Price({ eurAmount, usdAmount, className = "" }: PriceProps) {
  const { formatPrice, mounted } = useCurrency();
  
  if (!mounted) {
    return (
      <span className={className}>
        {new Intl.NumberFormat("en-US", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(eurAmount)}
      </span>
    );
  }

  return (
    <span className={className}>
      {formatPrice(eurAmount, usdAmount)}
    </span>
  );
}
