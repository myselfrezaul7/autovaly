import { Metadata } from "next";
import Link from "next/link";
import CookieSettingsButton from "@/components/ui/CookieSettingsButton";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Rights — Autovaly",
  description: "Learn how Autovaly protects reader privacy, manages local telemetry, and complies with GDPR and CCPA data standards.",
  openGraph: {
    title: "Privacy Policy & Data Rights | Autovaly",
    description: "Learn how Autovaly protects reader privacy and complies with GDPR and CCPA standards.",
    url: "https://autovaly.com/privacy",
    images: [{ url: "https://autovaly.com/og-image.jpg", width: 1200, height: 630, alt: "Autovaly Privacy Policy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy & Data Rights | Autovaly",
    description: "Learn how Autovaly protects reader privacy and complies with GDPR and CCPA standards.",
  },
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/privacy" },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-background text-text-light py-16 lg:py-24">
      <BreadcrumbJsonLd crumbs={crumbs} />
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <Breadcrumbs crumbs={crumbs} />

        {/* Header */}
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded border border-accent/20 mb-4 inline-block">
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-4">
            Privacy Policy & Data Rights
          </h1>
          <p className="text-sm text-text-muted">
            Last Updated: August 15, 2026 · Effective Date: January 1, 2025
          </p>
        </div>

        {/* Quick Action Cookie Banner */}
        <div className="p-6 rounded-2xl bg-surface border border-border-custom mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-bold text-base text-text-light">Manage Your Cookie Preferences</h2>
            <p className="text-xs text-text-muted mt-1">
              You can adjust your analytics, personalization, and functional cookie preferences at any time.
            </p>
          </div>
          <CookieSettingsButton />
        </div>

        {/* Policy Body */}
        <div className="space-y-10 text-sm leading-relaxed text-text-muted">
          <section className="bg-surface/50 border border-border-custom p-6 sm:p-8 rounded-2xl">
            <h2 className="text-xl font-heading font-bold text-text-light uppercase tracking-wider mb-4">
              1. Information We Collect
            </h2>
            <p className="mb-3">
              Autovaly is committed to collecting only minimal, necessary information to provide enthusiast-grade automotive news, specifications, and comparison tools:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-text-light">Local Client Storage:</strong> Theme preferences (light/dark mode), currency settings (USD/EUR), and vehicles saved in your personal &quot;My Garage&quot; are stored entirely on your device in browser localStorage.</li>
              <li><strong className="text-text-light">Aggregated Analytics:</strong> Anonymized telemetry (pageviews, device type, geographic region) to understand readership trends without tracking individual identities.</li>
              <li><strong className="text-text-light">Voluntary Inquiries:</strong> Contact form submissions, newsletter subscriptions, and feedback messages provided directly by you.</li>
            </ul>
          </section>

          <section className="bg-surface/50 border border-border-custom p-6 sm:p-8 rounded-2xl">
            <h2 className="text-xl font-heading font-bold text-text-light uppercase tracking-wider mb-4">
              2. How We Use Your Data
            </h2>
            <p className="mb-3">
              Data collected across Autovaly is strictly utilized to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Maintain and personalize your session settings across visits.</li>
              <li>Improve site performance, search indexing, and mobile responsiveness.</li>
              <li>Respond to direct editorial tips, press inquiries, and reader feedback.</li>
              <li>Prevent spam, security exploits, and automated scraping of our proprietary spec database.</li>
            </ul>
          </section>

          <section className="bg-surface/50 border border-border-custom p-6 sm:p-8 rounded-2xl">
            <h2 className="text-xl font-heading font-bold text-text-light uppercase tracking-wider mb-4">
              3. GDPR & CCPA Compliance
            </h2>
            <p className="mb-3">
              Under the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Request full disclosure of any personal data stored about you.</li>
              <li>Request erasure of your communication history or newsletter subscription.</li>
              <li>Opt out of non-essential analytics tracking at any time using our Cookie Settings.</li>
              <li>We do <strong className="text-text-light">not</strong> sell, rent, or trade reader personal data to third-party data brokers under any circumstances.</li>
            </ul>
          </section>

          <section className="bg-surface/50 border border-border-custom p-6 sm:p-8 rounded-2xl">
            <h2 className="text-xl font-heading font-bold text-text-light uppercase tracking-wider mb-4">
              4. Contact Our Data Protection Officer
            </h2>
            <p>
              If you have questions regarding this Privacy Policy or wish to exercise your data rights, please contact our team directly at <a href="mailto:itsautovaly@gmail.com" className="text-accent underline font-bold">itsautovaly@gmail.com</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-accent text-xs font-bold uppercase tracking-widest hover:underline">
            ← Return to Autovaly Home
          </Link>
        </div>
      </div>
    </main>
  );
}
