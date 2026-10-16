"use client";

import { useState, useEffect, useCallback } from "react";
import { m, AnimatePresence } from "framer-motion";
import { submitDomainOffer } from "@/app/actions/domain-offer";

const STORAGE_KEY = "autovaly_domain_sale_dismissed";
const PRESET_OFFERS = ["$5,000", "$10,000", "$25,000", "$50,000+"];
const OFFICIAL_EMAIL = "itsautovaly@gmail.com";

export default function DomainSaleModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"offer" | "direct">("offer");
  const [offerAmount, setOfferAmount] = useState("$10,000");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [copied, setCopied] = useState(false);

  // Auto-open after 1800ms timer on first mount unless dismissed or in automated test runner
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Do not auto-popup during automated test suites (Playwright/Puppeteer/Selenium)
    if (typeof navigator !== "undefined" && navigator.webdriver) {
      return;
    }

    try {
      const dismissed = sessionStorage.getItem(STORAGE_KEY);
      if (dismissed === "true") return;
    } catch {
      // sessionStorage unavailable
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  // Listen for custom trigger event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-domain-sale-modal", handleOpen);
    return () => window.removeEventListener("open-domain-sale-modal", handleOpen);
  }, []);

  // Dismiss callback
  const handleDismiss = useCallback(() => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore storage access errors
    }
  }, []);

  // Escape key handler & body overflow lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleDismiss();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleDismiss]);

  // Copy email to clipboard
  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(OFFICIAL_EMAIL);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = OFFICIAL_EMAIL;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Guarantee offerAmount is populated
    if (!formData.get("offerAmount")) {
      formData.set("offerAmount", offerAmount);
    }

    const emailValue = (formData.get("email") as string) || "";

    try {
      const result = await submitDomainOffer(formData);
      if (result.success) {
        setSubmittedEmail(emailValue);
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Unable to submit your proposal. Please try again.");
      }
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Network error. Please try again or use direct email."
      );
    }
  };

  const mailtoUrl = `mailto:${OFFICIAL_EMAIL}?subject=Inquiry:%20Acquisition%20of%20Autovaly.com&body=Hello%20Autovaly%20Team,%0A%0AI%20am%20interested%20in%20acquiring%20Autovaly.com%20and%20its%20platform.%0A%0AOffer%20Amount:%20${encodeURIComponent(
    offerAmount
  )}%0AProposed%20Terms:%20`;

  return (
    <>
      {/* Floating Pill Trigger: Rendered when modal is closed */}
      <AnimatePresence>
        {!isOpen && (
          <m.button
            key="domain-sale-pill"
            type="button"
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            aria-label="Open domain and platform sale acquisition modal"
            className="fixed bottom-20 lg:bottom-6 left-4 lg:left-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-surface/90 dark:bg-black/85 backdrop-blur-xl border border-accent-gold/40 shadow-xl hover:border-accent-gold hover:scale-105 transition-all cursor-pointer text-[11px] sm:text-xs font-heading font-bold uppercase tracking-wider text-text-light group"
          >
            <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse group-hover:scale-125 transition-transform shrink-0" />
            <span className="truncate sm:hidden">For Sale • Make Offer</span>
            <span className="hidden sm:inline">Domain & Site For Sale • Make Offer</span>
          </m.button>
        )}
      </AnimatePresence>

      {/* Domain Acquisition Modal */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto"
            onClick={handleDismiss}
          >
            <m.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="domain-sale-title"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-accent/30 dark:border-white/15 bg-surface/95 dark:bg-[#121318]/95 p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.7)] text-text-light my-auto"
            >
              {/* Subtle ambient gradient flare */}
              <div
                aria-hidden="true"
                className="absolute -top-24 -right-24 w-48 h-48 bg-accent-gold/15 dark:bg-accent-gold/10 rounded-full blur-3xl pointer-events-none"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/15 dark:bg-accent/10 rounded-full blur-3xl pointer-events-none"
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Close modal"
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-background/80 dark:bg-white/5 border border-border-custom hover:bg-border-custom/50 flex items-center justify-center transition-all cursor-pointer text-text-muted hover:text-text-light"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Top Badge with Pulsing Live Amber Dot */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-heading font-bold uppercase tracking-widest bg-accent-gold/15 text-accent-gold border border-accent-gold/30 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-gold" />
                </span>
                <span>Official Asset Sale</span>
              </div>

              {/* Headline */}
              <h2
                id="domain-sale-title"
                className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-wider text-text-light leading-tight mb-2"
              >
                Autovaly.com & Platform For Sale
              </h2>
              <p className="text-xs md:text-sm text-text-muted leading-relaxed mb-4">
                Rare opportunity to acquire an ultra-premium, memorable automotive exact-match domain alongside an turnkey, production-grade Next.js 16 WebGL platform.
              </p>

              {/* Value Proposition Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background/80 dark:bg-white/5 border border-border-custom text-[11px] leading-tight">
                  <span className="text-base flex-shrink-0">🌐</span>
                  <span>
                    Exact-Match <strong className="font-semibold block text-text-light">autovaly.com</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background/80 dark:bg-white/5 border border-border-custom text-[11px] leading-tight">
                  <span className="text-base flex-shrink-0">⚡</span>
                  <span>
                    Next.js 16 + WebGL <strong className="font-semibold block text-text-light">167+ SSG Pages</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background/80 dark:bg-white/5 border border-border-custom text-[11px] leading-tight">
                  <span className="text-base flex-shrink-0">🏎️</span>
                  <span>
                    Catalog & Reviews <strong className="font-semibold block text-text-light">74 Cars • 35+ Reviews</strong>
                  </span>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-background/80 dark:bg-white/5 border border-border-custom mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("offer");
                    setStatus("idle");
                  }}
                  className={`py-2 px-3 rounded-xl font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center ${
                    activeTab === "offer"
                      ? "bg-accent text-white shadow-md shadow-accent/20"
                      : "text-text-muted hover:text-text-light"
                  }`}
                >
                  💰 Make an Offer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("direct");
                    setStatus("idle");
                  }}
                  className={`py-2 px-3 rounded-xl font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer text-center ${
                    activeTab === "direct"
                      ? "bg-accent text-white shadow-md shadow-accent/20"
                      : "text-text-muted hover:text-text-light"
                  }`}
                >
                  ✉️ Direct Email Inquiry
                </button>
              </div>

              {/* Tab Content 1: Make an Offer */}
              {activeTab === "offer" && (
                <div>
                  {status === "success" ? (
                    <div className="text-center py-6 px-4 rounded-2xl bg-background/80 dark:bg-white/5 border border-border-custom">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                        ✓
                      </div>
                      <h3 className="font-heading text-xl font-bold uppercase tracking-wider text-emerald-400 mb-2">
                        Offer Received!
                      </h3>
                      <p className="text-xs md:text-sm text-text-secondary max-w-md mx-auto leading-relaxed mb-6">
                        Thank you. We have logged your proposal. We will review your offer and respond to{" "}
                        <strong className="text-text-light underline decoration-accent/50 underline-offset-2">
                          {submittedEmail || "your email"}
                        </strong>{" "}
                        within 24 hours.
                      </p>
                      <button
                        type="button"
                        onClick={handleDismiss}
                        className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-white font-heading font-bold rounded-xl uppercase tracking-wider text-xs transition-all cursor-pointer"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Honeypot field for bot suppression */}
                      <input
                        type="text"
                        name="_hp_domain_offer"
                        tabIndex={-1}
                        autoComplete="off"
                        className="hidden"
                        aria-hidden="true"
                      />

                      {/* Quick Offer Presets */}
                      <div>
                        <label className="block text-[11px] font-heading font-bold uppercase tracking-wider text-text-muted mb-2">
                          Quick Offer Presets
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {PRESET_OFFERS.map((preset) => {
                            const isSelected = offerAmount === preset;
                            return (
                              <button
                                key={preset}
                                type="button"
                                onClick={() => setOfferAmount(preset)}
                                className={`py-2 px-1 text-center rounded-xl font-heading text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-accent-gold/20 border-accent-gold text-accent-gold shadow-sm"
                                    : "bg-background/80 dark:bg-white/5 border border-border-custom text-text-secondary hover:text-text-light hover:border-accent/40"
                                }`}
                              >
                                {preset}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Inputs Row 1: Name & Email */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label
                            htmlFor="domain-offer-name"
                            className="block text-[11px] font-heading font-bold uppercase tracking-wider text-text-muted mb-1.5"
                          >
                            Full Name / Organization *
                          </label>
                          <input
                            id="domain-offer-name"
                            name="name"
                            type="text"
                            required
                            placeholder="e.g. Alex Morgan or Apex Media"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 dark:bg-white/5 border border-border-custom text-text-light placeholder:text-text-muted/60 text-xs focus:outline-none focus:border-accent transition-colors"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="domain-offer-email"
                            className="block text-[11px] font-heading font-bold uppercase tracking-wider text-text-muted mb-1.5"
                          >
                            Email Address *
                          </label>
                          <input
                            id="domain-offer-email"
                            name="email"
                            type="email"
                            required
                            placeholder="investor@domain.com"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 dark:bg-white/5 border border-border-custom text-text-light placeholder:text-text-muted/60 text-xs focus:outline-none focus:border-accent transition-colors"
                          />
                        </div>
                      </div>

                      {/* Inputs Row 2: Offer Amount & Optional Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label
                            htmlFor="domain-offer-amount"
                            className="block text-[11px] font-heading font-bold uppercase tracking-wider text-text-muted mb-1.5"
                          >
                            Offer Amount ($ USD) *
                          </label>
                          <input
                            id="domain-offer-amount"
                            name="offerAmount"
                            type="text"
                            required
                            value={offerAmount}
                            onChange={(e) => setOfferAmount(e.target.value)}
                            placeholder="$10,000"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 dark:bg-white/5 border border-border-custom text-text-light font-bold text-xs focus:outline-none focus:border-accent transition-colors"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="domain-offer-phone"
                            className="block text-[11px] font-heading font-bold uppercase tracking-wider text-text-muted mb-1.5"
                          >
                            Phone / WhatsApp (Optional)
                          </label>
                          <input
                            id="domain-offer-phone"
                            name="phone"
                            type="tel"
                            placeholder="+1 (555) 012-3456"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 dark:bg-white/5 border border-border-custom text-text-light placeholder:text-text-muted/60 text-xs focus:outline-none focus:border-accent transition-colors"
                          />
                        </div>
                      </div>

                      {/* Optional Notes */}
                      <div>
                        <label
                          htmlFor="domain-offer-notes"
                          className="block text-[11px] font-heading font-bold uppercase tracking-wider text-text-muted mb-1.5"
                        >
                          Proposed Terms / Escrow Notes (Optional)
                        </label>
                        <textarea
                          id="domain-offer-notes"
                          name="message"
                          rows={2}
                          placeholder="Include terms, escrow preference, or acquisition timeline..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background/80 dark:bg-white/5 border border-border-custom text-text-light placeholder:text-text-muted/60 text-xs focus:outline-none focus:border-accent transition-colors resize-none"
                        />
                      </div>

                      {/* Error Banner */}
                      {status === "error" && errorMessage && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                          <span className="font-bold">⚠️</span>
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      {/* Submit CTA */}
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full py-3.5 bg-accent hover:bg-accent/90 text-white font-heading font-bold rounded-xl uppercase tracking-wider text-sm shadow-lg shadow-accent/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {status === "loading" ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                              />
                            </svg>
                            <span>Submitting Proposal...</span>
                          </>
                        ) : (
                          <span>Submit Acquisition Offer</span>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Tab Content 2: Direct Email Inquiry */}
              {activeTab === "direct" && (
                <div className="space-y-4 py-2">
                  <div className="p-4 rounded-2xl bg-background/80 dark:bg-white/5 border border-border-custom">
                    <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-text-light mb-1">
                      Direct Principal Communication
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed mb-4">
                      Interested parties, brokers, or strategic buyers can reach the ownership team directly. Escrow.com and Sedo verified transfers are fully supported for global transactions.
                    </p>

                    {/* Email Display & Actions */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-background/80 dark:bg-white/5 border border-border-custom">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <span className="text-accent text-lg flex-shrink-0">✉️</span>
                        <span className="font-mono text-xs md:text-sm text-text-light select-all truncate font-semibold">
                          {OFFICIAL_EMAIL}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-heading font-bold uppercase tracking-wider text-text-light transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          {copied ? (
                            <>
                              <span className="text-emerald-400 font-bold">✓</span>
                              <span className="text-emerald-400 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <span>📋</span>
                              <span>Copy Email</span>
                            </>
                          )}
                        </button>
                        <a
                          href={mailtoUrl}
                          className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-accent hover:bg-accent/90 text-xs font-heading font-bold uppercase tracking-wider text-white transition-all text-center flex items-center justify-center gap-1"
                        >
                          <span>Open Mail</span>
                          <span>↗</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-text-muted">
                    <div className="p-2.5 rounded-xl bg-background/80 dark:bg-white/5 border border-border-custom flex items-center gap-2">
                      <span className="text-accent-gold text-sm">🔒</span>
                      <span>Verified Buyer Escrow Available</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-background/80 dark:bg-white/5 border border-border-custom flex items-center gap-2">
                      <span className="text-accent-cyan text-sm">⚡</span>
                      <span>24-Hour Confidential Response</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Dismiss Link */}
              <button
                type="button"
                onClick={handleDismiss}
                className="text-xs text-text-muted hover:text-text-light transition-colors underline underline-offset-4 mt-5 block mx-auto text-center cursor-pointer"
              >
                Maybe later — explore website
              </button>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}