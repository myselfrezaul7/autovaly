"use client";

import { m } from "framer-motion";
import { useState } from "react";

export default function Newsletter() {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  return (
    <section className="w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent-dark" />
      <div className="absolute inset-0 gradient-mesh opacity-30 mix-blend-screen" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 relative z-10">
        <m.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex flex-col items-center text-center max-w-3xl mx-auto text-white">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-6 opacity-80"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold leading-tight mb-4 tracking-wide">Stay in the Fast Lane.</h2>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl">Weekly car news digest, deep-dive reviews, and industry insights. No spam, just the good stuff.</p>

          {status === "success" ? (
            <m.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/20 backdrop-blur-md border border-white/30 rounded-md px-8 py-6 text-lg font-bold flex flex-col sm:flex-row items-center justify-center gap-3">
              <m.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"/></m.svg>
              <span>You&apos;re in! Welcome to the fast lane.</span>
            </m.div>
          ) : (
            <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" onSubmit={(e) => { e.preventDefault(); setTimeout(() => setStatus("success"), 500); }} className="w-full flex flex-col sm:flex-row gap-3 max-w-lg mb-6">
              <input type="email" name="email" placeholder="Enter your email address" className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 px-5 py-4 rounded-md outline-none focus:bg-white/20 focus:border-white/40 focus-visible:ring-2 focus-visible:ring-white/50 transition-all" required />
              <button type="submit" className="bg-white text-accent font-bold uppercase tracking-wide px-8 py-4 rounded-md hover:bg-gray-100 transition-colors whitespace-nowrap touch-press">Subscribe</button>
            </form>
          )}

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/90 mt-4">
            <span>Join 48,000+ readers</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span>Unsubscribe anytime</span>
          </div>
        </m.div>
      </div>
    </section>
  );
}
