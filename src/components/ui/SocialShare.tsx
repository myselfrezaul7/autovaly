"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";

export default function SocialShare({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const fullUrl = `https://autovaly.com${url}`;

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out "${title}" on Autovaly`,
          url: fullUrl,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed bottom-[84px] lg:bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {copied && (
          <m.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            className="mb-2 px-4 py-1.5 rounded-full bg-black/85 dark:bg-white/90 text-white dark:text-black text-xs font-bold shadow-xl border border-white/20 backdrop-blur-xl flex items-center gap-1.5 tracking-wide"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#00cec9]"><polyline points="20 6 9 17 4 12"/></svg>
            Link Copied to Clipboard
          </m.div>
        )}
      </AnimatePresence>

      {/* iOS 27 Glassmorphic Floating Dock */}
      <div className="relative group flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl sm:rounded-full bg-white/[0.12] dark:bg-black/60 backdrop-blur-3xl border border-white/30 dark:border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/15">
        {/* Specular Ambient Glow */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-full bg-gradient-to-r from-accent/15 via-white/5 to-accent/15 opacity-60 pointer-events-none" />

        <span className="text-[11px] font-extrabold uppercase tracking-widest text-text-light/80 hidden sm:inline-block pl-2 pr-1 select-none">
          Share
        </span>

        {/* Copy Link */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy Article Link"
          className="relative p-2 rounded-xl sm:rounded-full bg-surface/60 hover:bg-surface border border-white/15 text-text-light hover:text-accent transition-all touch-press active:scale-90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>

        {/* Native Web Share */}
        <button
          type="button"
          onClick={handleNativeShare}
          aria-label="Share options"
          className="relative p-2 rounded-xl sm:rounded-full bg-surface/60 hover:bg-surface border border-white/15 text-text-light hover:text-accent transition-all touch-press active:scale-90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </button>

        <div className="w-px h-5 bg-white/20 mx-0.5" />

        {/* Twitter / X */}
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          className="p-2 rounded-xl sm:rounded-full bg-surface/60 hover:bg-surface border border-white/15 text-text-light hover:text-[#1DA1F2] hover:border-[#1DA1F2]/40 transition-all touch-press active:scale-90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + " - " + fullUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className="p-2 rounded-xl sm:rounded-full bg-surface/60 hover:bg-surface border border-white/15 text-text-light hover:text-[#25D366] hover:border-[#25D366]/40 transition-all touch-press active:scale-90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        </a>

        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className="p-2 rounded-xl sm:rounded-full bg-surface/60 hover:bg-surface border border-white/15 text-text-light hover:text-[#0A66C2] hover:border-[#0A66C2]/40 transition-all touch-press active:scale-90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>
        </a>

        {/* Reddit */}
        <a
          href={`https://reddit.com/submit?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Reddit"
          className="p-2 rounded-xl sm:rounded-full bg-surface/60 hover:bg-surface border border-white/15 text-text-light hover:text-[#FF4500] hover:border-[#FF4500]/40 transition-all touch-press active:scale-90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none"/><path d="M16.5 13.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5zm-6 0c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5zm4.5 3c-.75.75-2.25.75-3 0"/></svg>
        </a>
      </div>
    </div>
  );
}
