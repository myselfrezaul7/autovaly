import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-16 lg:py-24 max-w-4xl min-h-[70vh]">
      <h1 className="text-4xl font-heading font-extrabold mb-8">Privacy Policy</h1>
      <div className="prose prose-invert prose-lg max-w-none text-text-light/90 leading-relaxed">
        <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-bold uppercase tracking-widest rounded mb-8">Last updated: May 12, 2026</span>
        <p>We take your privacy seriously. This privacy policy describes what personal information we collect and how we use it. See this primer to learn more about privacy policies in general.</p>
        <h2>Information Collection</h2>
        <p>We track basic analytics (like Vercel Web Analytics) to understand our traffic. We do not sell your personal data. We use local storage to save your theme and currency preferences.</p>
        <h2>Newsletter</h2>
        <p>If you subscribe to our newsletter, we store your email securely via Formspree/third-party providers. We will only use this to send you the content you requested.</p>
      </div>
    </div>
  );
}
