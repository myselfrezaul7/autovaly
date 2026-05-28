import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Autovaly",
  description: "Get in touch with the Autovaly editorial team.",
  openGraph: {
    title: "Contact Us | Autovaly",
    description: "Get in touch with the Autovaly editorial team.",
    url: "https://autovaly.com/contact",
  },
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const formspreeUrl = process.env.NEXT_PUBLIC_FORM_ID 
    ? `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORM_ID}`
    : "#";

  return (
    <div className="container mx-auto px-4 md:px-6 py-16 lg:py-24 max-w-3xl min-h-[70vh]">
      <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight mb-4">
        Contact Us
      </h1>
      <p className="text-xl text-muted mb-12">
        Have a tip, feedback, or business inquiry? We'd love to hear from you.
      </p>

      <form action={formspreeUrl} method="POST" className="space-y-6 bg-surface p-8 rounded-xl border border-border-custom">
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
        </div>

        <button 
          type="submit" 
          className="w-full bg-accent text-white font-bold uppercase tracking-wide text-sm px-8 py-4 rounded hover:bg-accent-dark transition-all touch-press active:scale-[0.98]"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
