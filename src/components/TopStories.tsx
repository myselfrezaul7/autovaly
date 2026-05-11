"use client";

import ArticleCard from "./ui/ArticleCard";

export default function TopStories() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background" id="top-stories">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8 md:mb-10 pb-4 border-b border-border-custom">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider pl-4 border-l-4 border-accent">
            Top Stories
          </h2>
          <a href="#" className="text-accent text-sm font-bold uppercase tracking-widest hover:brightness-125 transition-all">
            View All <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 lg:gap-8">
          {/* Main Story */}
          <ArticleCard
            variant="large"
            tag="EV"
            tagColorClass="bg-tag-ev"
            headline="Tesla Model Y Long Range Refresh — Everything Changed"
            excerpt="From a redesigned front end to a new powertrain architecture, Tesla's best-seller gets its most significant update yet. We break down what's new and what it means for buyers."
            author="James Mercer"
            date="May 10, 2025"
            readTime="6 min read"
            gradientFrom="#00B894"
            gradientTo="#16213e"
          />

          {/* Side Stories */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <ArticleCard
              variant="compact"
              tag="Review"
              tagColorClass="bg-tag-review"
              headline="BMW M5 Touring: The Last Great Combustion Wagon?"
              author="Sarah Lin"
              date="May 9, 2025"
              gradientFrom="#6C5CE7"
              gradientTo="#a29bfe"
            />
            
            <ArticleCard
              variant="compact"
              tag="Industry"
              tagColorClass="bg-tag-industry text-black"
              headline="How BYD Plans to Take 30% of Europe's EV Market by 2027"
              author="Ryo Tanaka"
              date="May 8, 2025"
              gradientFrom="#FDCB6E"
              gradientTo="#f39c12"
            />
            
            <ArticleCard
              variant="compact"
              tag="Comparison"
              tagColorClass="bg-tag-comparison"
              headline="Porsche Taycan vs Audi e-tron GT: Which One Actually Wins?"
              author="Mia Okafor"
              date="May 7, 2025"
              gradientFrom="#0984E3"
              gradientTo="#74b9ff"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
