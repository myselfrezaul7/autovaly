import { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "About Us — Autovaly Editorial & Testing Standards",
  description: "Learn about Autovaly's independent testing methodology, editorial team, and data-driven automotive journalism.",
  openGraph: {
    title: "About Us | Autovaly",
    description: "Learn about Autovaly's independent testing methodology, editorial team, and data-driven automotive journalism.",
    url: "https://autovaly.com/about",
    images: [{ url: "https://autovaly.com/og-image.jpg", width: 1200, height: 630, alt: "About Autovaly" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Autovaly",
    description: "Learn about Autovaly's independent testing methodology and editorial team.",
  },
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-background text-text-light py-16 lg:py-24">
      <BreadcrumbJsonLd crumbs={crumbs} />
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="mb-8">
          <Breadcrumbs crumbs={crumbs} />
        </div>

        {/* Hero Header */}
        <div className="mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded border border-accent/20 mb-4 inline-block">
            Our Mission & Philosophy
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-[1.1] mb-6">
            Drive the Story. <br />
            <span className="text-accent">Independent. Instrumented. Uncompromised.</span>
          </h1>
          <p className="text-lg md:text-xl text-text-muted leading-relaxed max-w-3xl">
            Autovaly was founded on a simple premise: in an era of unprecedented automotive transformation, enthusiasts and car buyers deserve data-driven testing, deep engineering context, and uncompromising editorial integrity.
          </p>
        </div>

        {/* Key Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20">
          {[
            { label: "Vehicles Tested", value: "350+" },
            { label: "Spec Database", value: "1,200+" },
            { label: "Global Readership", value: "250K/mo" },
            { label: "Editorial Independence", value: "100%" },
          ].map((stat, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-surface/70 border border-border-custom backdrop-blur-xl">
              <p className="text-3xl lg:text-4xl font-heading font-extrabold text-accent mb-1">{stat.value}</p>
              <p className="text-xs uppercase tracking-widest text-text-muted font-bold">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Section 1: Testing Protocols */}
        <section className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold uppercase tracking-wider pl-4 border-l-[5px] border-accent mb-8">
            How We Test: The Autovaly Standard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-surface border border-border-custom">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-xl mb-4 font-bold" aria-hidden="true">
                ⚡
              </div>
              <h3 className="font-heading font-bold text-lg text-text-light mb-2">Real-World Range & Charging</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                We conduct 130 km/h constant-speed GPS highway range loops and log real-time DC fast charging curves from 10% to 80% state-of-charge on 350 kW hardware.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border-custom">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-xl mb-4 font-bold" aria-hidden="true">
                ⏱️
              </div>
              <h3 className="font-heading font-bold text-lg text-text-light mb-2">VBOX GPS Acceleration</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                All 0–100 km/h and quarter-mile times are measured with Racelogic VBOX 100 Hz differential GPS telemetry on closed test circuits with 1-foot rollout standardized.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border-custom">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-xl mb-4 font-bold" aria-hidden="true">
                🛡️
              </div>
              <h3 className="font-heading font-bold text-lg text-text-light mb-2">Zero Paid Reviews</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                We maintain strict separation between advertising and editorial. Automakers never pay for review scores or receive editorial copy for pre-approval.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Editorial Team */}
        <section className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold uppercase tracking-wider pl-4 border-l-[5px] border-accent mb-8">
            Editorial Leadership
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "James Mercer",
                role: "Editor-in-Chief & Track Tester",
                bio: "15 years covering endurance motorsport, supercar dynamics, and high-performance engineering.",
              },
              {
                name: "Sarah Lin",
                role: "EV & Battery Systems Editor",
                bio: "Former battery telemetry engineer turned investigative journalist covering solid-state and EV architectures.",
              },
              {
                name: "Ryo Tanaka",
                role: "JDM & Heritage Specialist",
                bio: "Tokyo-based correspondent focused on Japanese sports cars, homologation specials, and classic restoration.",
              },
              {
                name: "Mia Okafor",
                role: "Powertrain & Tech Editor",
                bio: "Specializes in autonomous driving software (FSD), electrical architectures, and connected vehicle ecosystems.",
              },
              {
                name: "Dan Kowalski",
                role: "Trucks & Utility Lead",
                bio: "Automotive durability tester who evaluates trucks, off-road towing dynamics, and hybrid commercial haulers.",
              },
            ].map((member, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-surface border border-border-custom flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-red-400 flex items-center justify-center text-white font-bold text-lg mb-4" aria-hidden="true">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="font-heading font-bold text-lg text-text-light">{member.name}</h3>
                  <p className="text-accent text-xs font-bold uppercase tracking-wider mb-3">{member.role}</p>
                  <p className="text-xs text-text-muted leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Contact & Tip Hotline CTA */}
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-r from-surface via-surface to-accent/10 border border-border-custom flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading font-bold text-2xl mb-2">Have a Leak, Scoop, or Vehicle Inquiry?</h3>
            <p className="text-sm text-text-muted max-w-xl">
              Our editorial inbox is open 24/7. We review embargoed press materials, spy shots, and insider tips with complete source confidentiality.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-8 py-3.5 bg-accent hover:bg-accent/90 text-white font-heading font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-accent/25 transition-all touch-press active:scale-95 flex-shrink-0"
          >
            Get In Touch →
          </Link>
        </div>
      </div>
    </main>
  );
}
