import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Autovaly",
  description: "Review Autovaly's Terms of Service, editorial disclaimers, specification accuracy notes, and intellectual property terms.",
  openGraph: {
    title: "Terms of Service | Autovaly",
    description: "Review Autovaly's Terms of Service and editorial policies.",
    url: "https://autovaly.com/terms",
  },
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-text-light py-16 lg:py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded border border-accent/20 mb-4 inline-block">
            Terms of Use
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-text-muted">
            Last Updated: August 15, 2026 · Effective Date: January 1, 2025
          </p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-text-muted">
          <section className="bg-surface/50 border border-border-custom p-6 sm:p-8 rounded-2xl">
            <h2 className="text-xl font-heading font-bold text-text-light uppercase tracking-wider mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Autovaly (the &quot;Platform&quot;), including our vehicle database, articles, comparison tools, and mobile web applications, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="bg-surface/50 border border-border-custom p-6 sm:p-8 rounded-2xl">
            <h2 className="text-xl font-heading font-bold text-text-light uppercase tracking-wider mb-4">
              2. Vehicle Specifications & Accuracy Disclaimer
            </h2>
            <p className="mb-3">
              Autovaly makes every effort to ensure that all vehicle technical specifications, WLTP/EPA range estimates, pricing, and 0–100 km/h acceleration figures are accurate and verified against manufacturer data sheets and instrumented tests.
            </p>
            <p>
              However, automotive specifications, options packages, regional availability, and currency-converted pricing are subject to continuous manufacturer revisions. Autovaly provides all data &quot;as is&quot; for informational and research purposes. Always verify official specifications with your authorized vehicle dealer prior to making purchase decisions.
            </p>
          </section>

          <section className="bg-surface/50 border border-border-custom p-6 sm:p-8 rounded-2xl">
            <h2 className="text-xl font-heading font-bold text-text-light uppercase tracking-wider mb-4">
              3. Intellectual Property & Editorial Content
            </h2>
            <p className="mb-3">
              All original editorial articles, testing methodologies, photography credits, UI designs, and database architectures are the proprietary intellectual property of Autovaly Media.
            </p>
            <p>
              Automotive brand names, manufacturer logos, and model names are trademarks of their respective owners. Their inclusion on Autovaly is for nominative editorial identification and journalistic comparison purposes under fair use.
            </p>
          </section>

          <section className="bg-surface/50 border border-border-custom p-6 sm:p-8 rounded-2xl">
            <h2 className="text-xl font-heading font-bold text-text-light uppercase tracking-wider mb-4">
              4. Prohibited Uses
            </h2>
            <p className="mb-3">
              You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use automated scrapers, bots, or crawlers to extract Autovaly&apos;s database without prior written authorization.</li>
              <li>Attempt to bypass rate-limiting or security controls on our API endpoints or media servers.</li>
              <li>Reproduce entire articles or reviews on commercial platforms without explicit attribution and canonical linking.</li>
            </ul>
          </section>

          <section className="bg-surface/50 border border-border-custom p-6 sm:p-8 rounded-2xl">
            <h2 className="text-xl font-heading font-bold text-text-light uppercase tracking-wider mb-4">
              5. Contact Information
            </h2>
            <p>
              For legal inquiries, copyright notices (DMCA), or syndication licensing, please contact our team at <a href="mailto:itsautovaly@gmail.com" className="text-accent underline font-bold">itsautovaly@gmail.com</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-accent text-xs font-bold uppercase tracking-widest hover:underline">
            ← Return to Autovaly Home
          </Link>
        </div>
      </div>
    </div>
  );
}
