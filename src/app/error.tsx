"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">
      <div className="bg-surface border border-border-custom p-8 md:p-12 rounded-xl text-center max-w-lg w-full">
        <div className="w-16 h-16 bg-red-500/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="font-heading text-3xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-text-muted mb-8">
          We encountered an unexpected error while loading this page. Our team has been notified.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-accent text-white rounded-xl font-semibold uppercase tracking-wide hover:brightness-110 transition-all active:scale-95"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-surface border border-border-custom text-text-light rounded-xl font-semibold uppercase tracking-wide hover:bg-white/5 transition-all active:scale-95"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
