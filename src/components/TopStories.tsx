import { getTopStories, getCategoryTagColor, formatDate } from "@/lib/content";
import ArticleCard from "./ui/ArticleCard";

export default function TopStories() {
  const stories = getTopStories(4);
  const main = stories[0];
  const side = stories.slice(1);

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background" id="top-stories">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8 md:mb-10 pb-4 border-b border-border-custom">
          <h2 className="font-heading text-2xl md:text-3xl uppercase tracking-wider pl-4 border-l-4 border-accent">Top Stories</h2>
          <a href="/news" className="text-accent text-sm font-bold uppercase tracking-widest hover:brightness-125 transition-all">View All <span aria-hidden="true">→</span></a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 lg:gap-8">
          {main && (
            <ArticleCard variant="large" slug={main.slug} tag={main.category} tagColorClass={getCategoryTagColor(main.category)} headline={main.title} excerpt={main.excerpt} author={main.author.name} date={formatDate(main.publishedAt)} readTime={main.readTime} gradientFrom={main.coverGradient.from} gradientTo={main.coverGradient.to} />
          )}
          <div className="flex flex-col gap-6 lg:gap-8">
            {side.map((a) => (
              <ArticleCard key={a.id} variant="compact" slug={a.slug} tag={a.category} tagColorClass={getCategoryTagColor(a.category)} headline={a.title} author={a.author.name} date={formatDate(a.publishedAt)} readTime={a.readTime} gradientFrom={a.coverGradient.from} gradientTo={a.coverGradient.to} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
