"use client";

import { useState } from "react";
import { submitContact } from "@/app/actions/contact";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const res = await submitContact(formData);

    if (res.success) {
      setStatus("success");
      setMessage(res.message);
    } else {
      setStatus("error");
      setMessage(res.error);
      if (res.errors) {
        setFieldErrors(res.errors);
      }
    }
  };

  if (status === "success") {
    return (
      <div className="p-8 rounded-xl border border-accent/30 bg-accent/10 text-center flex flex-col items-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent mb-4"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <h3 className="text-2xl font-bold font-heading mb-2">Message Sent!</h3>
        <p className="text-text-muted mb-6">{message}</p>
        <button onClick={() => setStatus("idle")} className="px-6 py-2 bg-accent text-white font-bold rounded uppercase text-sm">Send Another Message</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-8 rounded-xl border border-border-custom">
      {status === "error" && (
        <div className="p-4 rounded border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-text-muted">Name</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            required
            className="w-full bg-background border border-border-custom rounded-md px-4 py-3 text-text-light focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/50 outline-none transition-colors" 
            placeholder="Jane Doe"
          />
          {fieldErrors.name && <p className="text-xs text-red-400">{fieldErrors.name[0]}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-bold uppercase tracking-widest text-text-muted">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required
            className="w-full bg-background border border-border-custom rounded-md px-4 py-3 text-text-light focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/50 outline-none transition-colors" 
            placeholder="jane@example.com"
          />
          {fieldErrors.email && <p className="text-xs text-red-400">{fieldErrors.email[0]}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-bold uppercase tracking-widest text-text-muted">Subject</label>
        <select 
          id="subject" 
          name="subject"
          className="w-full bg-background border border-border-custom rounded-md px-4 py-3 text-text-light focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/50 outline-none transition-colors"
        >
          <option value="General Inquiry">General Inquiry</option>
          <option value="Editorial Pitch">Editorial Pitch</option>
          <option value="Advertising">Advertising & Partnerships</option>
          <option value="Bug Report">Report a Bug/Error</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-bold uppercase tracking-widest text-text-muted">Message</label>
        <textarea 
          id="message" 
          name="message" 
          required
          rows={6}
          className="w-full bg-background border border-border-custom rounded-md px-4 py-3 text-text-light focus:border-accent focus-visible:ring-2 focus-visible:ring-accent/50 outline-none transition-colors resize-y" 
          placeholder="How can we help you?"
        ></textarea>
        {fieldErrors.message && <p className="text-xs text-red-400">{fieldErrors.message[0]}</p>}
      </div>

      <button 
        type="submit" 
        disabled={status === "loading"}
        className="w-full bg-accent text-white font-bold uppercase tracking-wide text-sm px-8 py-4 rounded hover:bg-accent-dark transition-all touch-press active:scale-[0.98] disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
