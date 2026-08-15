"use client";

import { m } from "framer-motion";
import { useState } from "react";

export default function Newsletter() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const subscriberEmail = formData.get("email")?.toString() || "";

    formData.append("access_key", "3281e53d-d6de-433b-ac48-98dc9f829145");
    formData.append("from_name", "Autovaly Newsletter");
    formData.append("subject", `New Newsletter Subscriber: ${subscriberEmail}`);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        try {
          localStorage.setItem("autovaly_newsletter_subscribed", "true");
        } catch {
          // ignore localStorage error
        }
        form.reset();
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Failed to subscribe. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please check your internet connection.");
    }
  };

  return (
    <section className="w-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent to-accent-dark" />
      <div className="absolute inset-0 gradient-mesh opacity-30 mix-blend-screen" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      
      <div className="container mx-auto px-4 md:px-6 py-16 md:py-20 relative z-10">
        <m.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="flex flex-col items-center text-center max-w-3xl mx-auto text-white">
          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-md flex items-center justify-center mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold leading-tight mb-4 tracking-wide">
            Stay in the Fast Lane.
          </h2>
          <p className="text-base md:text-lg text-white/85 mb-8 max-w-xl leading-relaxed">
            Weekly enthusiast-grade car news, instrumented road test telemetry, and market intelligence delivered directly to your inbox.
          </p>

          {status === "success" ? (
            <m.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl px-8 py-6 text-lg font-bold flex flex-col sm:flex-row items-center justify-center gap-3 shadow-2xl">
              <div className="w-8 h-8 rounded-full bg-white text-accent flex items-center justify-center text-base font-extrabold">✓</div>
              <span>You&apos;re in! Welcome to the Autovaly Inner Circle.</span>
            </m.div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-3 max-w-lg mb-3">
              {/* Anti-bot */}
              <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />
              
              <input
                type="email"
                name="email"
                placeholder="Enter your email (e.g. driver@domain.com)"
                className="flex-1 bg-white/15 backdrop-blur-xl border border-white/25 text-white placeholder:text-white/60 px-5 py-3.5 rounded-xl outline-none focus:bg-white/25 focus:border-white/50 transition-all text-sm"
                required
                disabled={status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-white text-accent font-heading font-bold uppercase tracking-wider text-xs px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-all whitespace-nowrap touch-press active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg"
              >
                {status === "loading" ? "Subscribing..." : "Join Newsletter →"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="text-xs font-semibold text-red-200 mb-4 bg-red-900/40 px-4 py-2 rounded-lg border border-red-500/30">
              {errorMessage}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-white/80 mt-3">
            <span>Verified Subscribers</span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span>Zero Spam · Unsubscribe Anytime</span>
          </div>
        </m.div>
      </div>
    </section>
  );
}
