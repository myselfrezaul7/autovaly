import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Contact Autovaly — Direct Inquiries & News Tips",
  description: "Get in touch with the Autovaly team, submit automotive news tips, or discuss advertising and partnership opportunities at itsautovaly@gmail.com.",
  openGraph: {
    title: "Contact Autovaly | Direct Inquiries & News Tips",
    description: "Get in touch with the Autovaly team at itsautovaly@gmail.com.",
    url: "https://autovaly.com/contact",
    images: [{ url: "https://autovaly.com/og-image.png", width: 1200, height: 630, alt: "Contact Autovaly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Autovaly | Direct Inquiries & News Tips",
    description: "Get in touch with the Autovaly team at itsautovaly@gmail.com.",
  },
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Contact & Tips", url: "/contact" },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-background text-text-light py-16 lg:py-24">
      <BreadcrumbJsonLd crumbs={crumbs} />
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="mb-8">
          <Breadcrumbs crumbs={crumbs} />
        </div>

        {/* Header */}
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded border border-accent/20 mb-4 inline-block">
            Direct Communication
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight leading-tight mb-4">
            Get In Touch
          </h1>
          <p className="text-base sm:text-lg text-text-muted max-w-2xl leading-relaxed">
            Have an editorial tip, scoop, spy photo, partnership proposal, or vehicle spec correction? Send us a direct message below or email us directly at <strong className="text-text-light">itsautovaly@gmail.com</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Interactive Web3Forms Contact Form */}
          <div className="lg:col-span-7 bg-surface border border-border-custom rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
            <h2 className="font-heading font-bold text-xl uppercase tracking-wider mb-6 flex items-center gap-2 text-text-light">
              <span className="text-accent" aria-hidden="true">✉️</span> Send a Direct Message
            </h2>
            <ContactForm />
          </div>

          {/* Right Column: Direct Contact Details & Guidelines */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Primary Email Card */}
            <div className="p-6 rounded-2xl bg-surface border border-border-custom">
              <h3 className="font-heading font-bold text-base uppercase tracking-wider text-text-light mb-3 flex items-center gap-2">
                <span aria-hidden="true">📧</span> Official Email Address
              </h3>
              <p className="text-xs text-text-muted mb-3 leading-relaxed">
                For general queries, business inquiries, editorial scoops, and corrections:
              </p>
              <a
                href="mailto:itsautovaly@gmail.com"
                aria-label="Send email to itsautovaly@gmail.com"
                className="text-base sm:text-lg font-bold text-accent hover:underline break-all block p-3 rounded-xl bg-accent/10 border border-accent/25 text-center"
              >
                itsautovaly@gmail.com
              </a>
            </div>

            {/* Inquiries & Topics Covered */}
            <div className="p-6 rounded-2xl bg-surface border border-border-custom">
              <h3 className="font-heading font-bold text-base uppercase tracking-wider text-text-light mb-4 flex items-center gap-2">
                <span aria-hidden="true">⚡</span> Inquiries We Welcome
              </h3>
              <ul className="space-y-3 text-xs text-text-muted">
                <li className="flex items-start gap-2.5">
                  <span className="text-accent font-bold" aria-hidden="true">✓</span>
                  <span><strong className="text-text-light">Automotive News Tips & Leaks:</strong> Spy shots, insider industry updates, and embargoed announcements.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-accent font-bold" aria-hidden="true">✓</span>
                  <span><strong className="text-text-light">Advertising & Sponsorships:</strong> High-impact display sponsorships and custom content partnerships.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-accent font-bold" aria-hidden="true">✓</span>
                  <span><strong className="text-text-light">Specification Corrections:</strong> Community-sourced corrections to keep our 1,200+ car database 100% accurate.</span>
                </li>
              </ul>
            </div>

            {/* Response Time Guarantee */}
            <div className="p-5 rounded-2xl bg-surface border border-border-custom text-xs text-text-muted">
              <p className="font-bold text-text-light mb-1 flex items-center gap-1.5">
                <span aria-hidden="true">⏱️</span> Typical Response Time
              </p>
              <p className="leading-relaxed">
                Our editorial team monitors incoming messages 7 days a week. We aim to respond to all inquiries within 24–48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
