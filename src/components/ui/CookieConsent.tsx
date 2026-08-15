"use client";

import { useState, useEffect } from "react";
import { m, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = "autovaly_cookie_consent_v1";

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    } else {
      try {
        setPreferences(JSON.parse(saved));
      } catch {
        // ignore parse error
      }
    }
  }, []);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setShowDetails(true);
    };

    window.addEventListener("open-cookie-settings", handleOpen);
    return () => window.removeEventListener("open-cookie-settings", handleOpen);
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = { essential: true, analytics: true, marketing: true };
    setPreferences(allAccepted);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allAccepted));
    setIsOpen(false);
  };

  const handleRejectAll = () => {
    const allRejected: CookiePreferences = { essential: true, analytics: false, marketing: false };
    setPreferences(allRejected);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allRejected));
    setIsOpen(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <m.aside
          role="region"
          aria-label="Cookie consent banner"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ type: "spring", damping: 28, stiffness: 260 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 pointer-events-auto"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/20 dark:border-white/10 bg-surface/85 dark:bg-black/80 backdrop-blur-2xl p-5 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45)] ring-1 ring-white/10 text-text-light">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/20 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-start gap-3.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent flex-shrink-0 text-lg">
                🍪
              </div>
              <div>
                <h3 className="font-heading font-bold text-base md:text-lg leading-tight tracking-wide">
                  Your Privacy Preferences
                </h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  We use cookies and local storage to remember your theme & currency, analyze site traffic, and deliver enthusiast-grade automotive journalism.
                </p>
              </div>
            </div>

            {/* Expandable Granular Controls */}
            {showDetails && (
              <m.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="my-4 space-y-2.5 pt-3 border-t border-border-custom/60 text-xs"
              >
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface/60 border border-border-custom/40">
                  <div>
                    <span className="font-bold text-text-light block">Strictly Necessary</span>
                    <span className="text-[11px] text-text-muted">Required for Garage, theme & currency preferences.</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                    Always Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface/60 border border-border-custom/40">
                  <div>
                    <span className="font-bold text-text-light block">Analytics & Performance</span>
                    <span className="text-[11px] text-text-muted">Anonymized traffic metrics for performance optimization.</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences.analytics}
                    aria-label="Toggle analytics cookies"
                    onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${preferences.analytics ? 'bg-accent' : 'bg-border-custom'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${preferences.analytics ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface/60 border border-border-custom/40">
                  <div>
                    <span className="font-bold text-text-light block">Marketing & Social</span>
                    <span className="text-[11px] text-text-muted">Personalized partner spotlights & automotive social embeds.</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences.marketing}
                    aria-label="Toggle marketing cookies"
                    onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${preferences.marketing ? 'bg-accent' : 'bg-border-custom'}`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${preferences.marketing ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </m.div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleRejectAll}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-surface border border-border-custom hover:bg-surface/80 text-text-light transition-all touch-press active:scale-95 text-center cursor-pointer"
                >
                  Reject All
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/25 transition-all touch-press active:scale-95 text-center cursor-pointer"
                >
                  Accept All
                </button>
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] text-text-muted">
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="hover:text-text-light transition-colors underline underline-offset-2 cursor-pointer"
                  aria-expanded={showDetails}
                >
                  {showDetails ? "Hide options" : "Customize choices"}
                </button>

                {showDetails && (
                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    className="font-bold text-accent hover:underline cursor-pointer"
                  >
                    Save Preferences
                  </button>
                )}

                <Link href="/privacy" className="hover:text-text-light transition-colors">
                  Privacy Policy →
                </Link>
              </div>
            </div>
          </div>
        </m.aside>
      )}
    </AnimatePresence>
  );
}
