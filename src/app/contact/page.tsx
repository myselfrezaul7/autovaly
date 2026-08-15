import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Autovaly — Editorial Inquiries, Press & Tips",
  description: "Get in touch with Autovaly's editorial team, submit automotive news tips, or discuss advertising and partnership opportunities.",
  openGraph: {
    title: "Contact Autovaly | Editorial Inquiries & Press",
    description: "Get in touch with Autovaly's editorial team, submit automotive news tips, or discuss advertising opportunities.",
    url: "https://autovaly.com/contact",
  },
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-text-light py-16 lg:py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded border border-accent/20 mb-4 inline-block">
            Global Newsroom
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight leading-tight mb-4">
            Connect With Our Team
          </h1>
          <p className="text-base sm:text-lg text-text-muted max-w-2xl leading-relaxed">
            Have a scoop, spy photos, press release, or vehicle specification correction? Choose your department below or send a message directly to our editorial desk.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-surface border border-border-custom rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
            <h2 className="font-heading font-bold text-xl uppercase tracking-wider mb-6 flex items-center gap-2">
              <span className="text-accent">✉️</span> Send a Direct Message
            </h2>
            <ContactForm />
          </div>

          {/* Right Column: Office Bureaus & Hotlines */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Department Routing Card */}
            <div className="p-6 rounded-2xl bg-surface border border-border-custom">
              <h3 className="font-heading font-bold text-base uppercase tracking-wider text-text-light mb-4 flex items-center gap-2">
                <span>📁</span> Direct Inboxes
              </h3>
              <ul className="space-y-3.5 text-xs">
                <li className="pb-3 border-b border-border-custom/50">
                  <span className="text-text-muted uppercase tracking-wider block font-bold">News & Confidential Tips</span>
                  <a href="mailto:tips@autovaly.com" className="text-accent font-bold text-sm hover:underline">tips@autovaly.com</a>
                </li>
                <li className="pb-3 border-b border-border-custom/50">
                  <span className="text-text-muted uppercase tracking-wider block font-bold">Press & Automaker PR</span>
                  <a href="mailto:press@autovaly.com" className="text-text-light font-bold text-sm hover:text-accent">press@autovaly.com</a>
                </li>
                <li className="pb-3 border-b border-border-custom/50">
                  <span className="text-text-muted uppercase tracking-wider block font-bold">Advertising & Sponsorships</span>
                  <a href="mailto:partnerships@autovaly.com" className="text-text-light font-bold text-sm hover:text-accent">partnerships@autovaly.com</a>
                </li>
                <li>
                  <span className="text-text-muted uppercase tracking-wider block font-bold">Database & Corrections</span>
                  <a href="mailto:corrections@autovaly.com" className="text-text-light font-bold text-sm hover:text-accent">corrections@autovaly.com</a>
                </li>
              </ul>
            </div>

            {/* Global Editorial Bureaus */}
            <div className="p-6 rounded-2xl bg-surface border border-border-custom">
              <h3 className="font-heading font-bold text-base uppercase tracking-wider text-text-light mb-4 flex items-center gap-2">
                <span>🌍</span> Editorial Bureaus
              </h3>
              <div className="space-y-3 text-xs text-text-muted">
                <div>
                  <p className="font-bold text-text-light text-sm">London Newsroom (HQ)</p>
                  <p>100 Bishopsgate, London EC2N 4AG, United Kingdom</p>
                </div>
                <div className="pt-2 border-t border-border-custom/40">
                  <p className="font-bold text-text-light text-sm">Frankfurt Automotive Test Desk</p>
                  <p>Mainzer Landstraße 180, 60327 Frankfurt am Main, Germany</p>
                </div>
                <div className="pt-2 border-t border-border-custom/40">
                  <p className="font-bold text-text-light text-sm">Tokyo Asia-Pacific Bureau</p>
                  <p>Roppongi Hills Mori Tower, Minato City, Tokyo 106-6108, Japan</p>
                </div>
              </div>
            </div>

            {/* Encrypted Whistleblower Notice */}
            <div className="p-5 rounded-2xl bg-accent/10 border border-accent/25 text-xs text-text-light">
              <p className="font-bold text-accent mb-1 flex items-center gap-1.5">
                <span>🔒</span> Confidential Whistleblower Protection
              </p>
              <p className="text-text-muted leading-relaxed">
                For sensitive internal automotive documents or whistleblower submissions, please use Signal or encrypted ProtonMail to reach our investigative desk securely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
