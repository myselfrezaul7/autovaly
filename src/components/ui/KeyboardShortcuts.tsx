"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Never intercept browser/OS shortcuts like Ctrl+C, Cmd+C, Alt+Left, etc.
      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      // Handle active input, select, or editable elements
      const activeEl = document.activeElement as HTMLElement | null;
      if (
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        activeEl?.tagName === "SELECT" ||
        activeEl?.isContentEditable
      ) {
        // Only allow Escape to blur inputs
        if (e.key === "Escape") {
          activeEl.blur();
        }
        return;
      }

      // Ignore if any modal dialog is open (e.g. SearchModal, DomainSaleModal)
      if (document.querySelector('[role="dialog"]')) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "/":
          e.preventDefault();
          const searchBtn = document.querySelector('button[aria-label="Search"]') as HTMLButtonElement;
          if (searchBtn) searchBtn.click();
          break;
        case "g":
          e.preventDefault();
          router.push("/garage");
          break;
        case "c":
          e.preventDefault();
          router.push("/compare");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
