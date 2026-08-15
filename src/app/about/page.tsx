import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about the Autovaly team and our mission.",
  openGraph: {
    title: "About Us | Autovaly",
    description: "Learn more about the Autovaly team and our mission.",
    url: "https://autovaly.com/about",
  },
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-16 lg:py-24 max-w-4xl min-h-[70vh]">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight mb-8">
        About <span className="text-accent">Autovaly</span>
      </h1>
      
      <div className="prose prose-invert prose-lg max-w-none">
        <p className="text-2xl md:text-3xl font-heading leading-tight text-text-light mb-12 border-l-[5px] border-accent pl-6 py-2">
          Autovaly is built for the new era of driving. Whether you're an EV early adopter, a combustion purist, or just looking for the perfect family SUV, we provide the data, reviews, and news you need to make informed decisions.
        </p>
        
        <h2 className="text-2xl font-bold font-heading mb-4 text-text-light">Our Mission</h2>
        <p className="mb-8 text-text-muted">
          The automotive industry is going through its biggest transition in a century. Our mission is to cut through the marketing noise and provide unbiased, data-driven comparisons and expert editorial content. We believe buying a car should be exciting, not confusing.
        </p>

        <h2 className="text-2xl font-bold font-heading mb-4 text-text-light">The Team</h2>
        <p className="mb-8 text-text-muted">
          We are a small team of automotive journalists, data engineers, and designers who share a passion for mobility. Based in Europe but with a global perspective, we drive the cars we write about and obsess over the spec sheets so you don't have to.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 mt-8 not-prose">
          {[
            { name: "Marcus", role: "Editor-in-Chief" },
            { name: "Sarah", role: "EV Specialist" },
            { name: "David", role: "Data Architect" }
          ].map((member, idx) => (
            <div key={idx} className="bg-surface border border-border-custom rounded-xl overflow-hidden group">
              <div className="h-48 bg-border-custom relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-background to-surface grayscale group-hover:grayscale-0 transition-all duration-500 flex items-center justify-center">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-heading font-bold text-lg">{member.name}</h3>
                <p className="text-accent text-xs font-bold uppercase tracking-widest">{member.role}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold font-heading mb-4 text-text-light">Our Data</h2>
        <p className="mb-8 text-text-muted">
          Our comparison engine is powered by a proprietary database of thousands of vehicles. We normalize specifications across manufacturers (converting between WLTP and EPA range, for example) to ensure our head-to-head comparisons are truly apples-to-apples.
        </p>
      </div>
    </div>
  );
}
