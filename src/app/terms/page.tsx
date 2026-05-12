import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-16 lg:py-24 max-w-4xl min-h-[70vh]">
      <h1 className="text-4xl font-heading font-extrabold mb-8">Terms of Service</h1>
      <div className="prose prose-invert max-w-none text-muted">
        <p>Last updated: May 12, 2026</p>
        <h2>1. Terms</h2>
        <p>By accessing the website at Autovaly.com, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
        <h2>2. Content Accuracy</h2>
        <p>While we strive for 100% accuracy in our vehicle database, specifications can change by region and model year. Autovaly is not liable for purchasing decisions made based on our data.</p>
        <h2>3. Copyright</h2>
        <p>All editorial content and site design are copyright Autovaly. Vehicle images are property of their respective manufacturers unless otherwise noted.</p>
      </div>
    </div>
  );
}
