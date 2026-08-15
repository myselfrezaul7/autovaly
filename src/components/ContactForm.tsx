"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", "3281e53d-d6de-433b-ac48-98dc9f829145");
    formData.append("from_name", "Autovaly Reader Inquiry");
    formData.append("subject", `New message from ${formData.get("name") || "Autovaly User"} - ${formData.get("subject") || "Contact Form"}`);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Failed to deliver message. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please check your internet connection or email us directly at itsautovaly@gmail.com.");
    }
  };

  if (status === "success") {
    return (
      <div className="p-8 rounded-2xl border border-accent/40 bg-accent/10 text-center flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent flex items-center justify-center text-accent text-2xl mb-4 font-bold">
          ✓
        </div>
        <h3 className="text-2xl font-bold font-heading mb-2 text-text-light">Message Delivered!</h3>
        <p className="text-sm text-text-muted mb-6 max-w-md">
          Thank you for reaching out. Your message has been routed to our team at <strong className="text-text-light">itsautovaly@gmail.com</strong>. We will review your inquiry shortly.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="px-6 py-2.5 bg-accent text-white font-heading font-bold rounded-xl uppercase tracking-wider text-xs shadow-lg shadow-accent/25 hover:bg-accent/90 transition-all touch-press active:scale-95 cursor-pointer"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form id="form" onSubmit={handleSubmit} className="space-y-5">
      {status === "error" && (
        <div className="p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      {/* Anti-bot Honeypot */}
      <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Your Name <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 text-sm text-text-light placeholder:text-text-muted/50 focus:border-accent focus:outline-none transition-colors"
            placeholder="Jane Doe"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-text-muted">
            Your Email <span className="text-accent">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 text-sm text-text-light placeholder:text-text-muted/50 focus:border-accent focus:outline-none transition-colors"
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Subject / Topic
        </label>
        <select
          id="subject"
          name="subject"
          className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 text-sm text-text-light focus:border-accent focus:outline-none transition-colors"
        >
          <option value="General Inquiry">General Inquiry & Feedback</option>
          <option value="Editorial Tips / Leaks">Confidential News Tip / Spy Shot</option>
          <option value="Advertising & Partnerships">Advertising & Sponsorships</option>
          <option value="Vehicle Spec Correction">Vehicle Specification Correction</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Message <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full bg-background border border-border-custom rounded-xl px-4 py-3 text-sm text-text-light placeholder:text-text-muted/50 focus:border-accent focus:outline-none transition-colors resize-y"
          placeholder="Type your message or news tip here..."
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-accent hover:bg-accent/90 text-white font-heading font-bold uppercase tracking-wider text-xs py-4 rounded-xl shadow-lg shadow-accent/25 transition-all touch-press active:scale-[0.98] disabled:opacity-50 cursor-pointer"
      >
        {status === "loading" ? "Sending Message..." : "Send Direct Message →"}
      </button>
    </form>
  );
}
