import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Autovaly",
  description: "Learn about Autovaly, the ultimate automotive discovery and comparison engine.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-16 lg:py-24 max-w-4xl min-h-[70vh]">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight mb-8">
        About <span className="text-accent">Autovaly</span>
      </h1>
      
      <div className="prose prose-invert prose-lg max-w-none">
        <p className="text-xl text-muted font-medium mb-12">
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

        <h2 className="text-2xl font-bold font-heading mb-4 text-text-light">Our Data</h2>
        <p className="mb-8 text-text-muted">
          Our comparison engine is powered by a proprietary database of thousands of vehicles. We normalize specifications across manufacturers (converting between WLTP and EPA range, for example) to ensure our head-to-head comparisons are truly apples-to-apples.
        </p>
      </div>
    </div>
  );
}
