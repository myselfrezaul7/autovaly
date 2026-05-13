import { getHeroArticle, getCategoryTagColor, formatDate } from "@/lib/content";
import Link from "next/link";

export default function Hero() {
  const article = getHeroArticle();
  const tagColor = getCategoryTagColor(article.category);

  return (
    <section className="flex flex-col lg:flex-row w-full min-h-[min(85vh,640px)] overflow-hidden">
      <div className="flex-shrink-0 lg:w-[60%] h-[280px] lg:h-auto relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]" role="img" aria-label={`${article.title} editorial image`}>
        <div className="absolute inset-0 opacity-50 bg-center bg-no-repeat" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400'%3E%3Cellipse cx='400' cy='340' rx='320' ry='40' fill='%23111318' opacity='.4'/%3E%3Cpath d='M180 280Q200 200 300 210L320 210Q340 180 380 175L420 175Q460 170 500 180L540 200Q580 200 620 220L640 240Q650 260 640 280Z' fill='%2316213e' stroke='%23E8232A' stroke-width='.5' opacity='.5'/%3E%3Ccircle cx='260' cy='285' r='30' fill='%230f0f1a' stroke='%23333' stroke-width='2'/%3E%3Ccircle cx='560' cy='275' r='30' fill='%230f0f1a' stroke='%23333' stroke-width='2'/%3E%3C/svg%3E")`, backgroundSize: "80%", backgroundPosition: "center 60%" }} />
        <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-10 font-heading font-extrabold text-5xl lg:text-7xl tracking-[0.1em] text-white/5 pointer-events-none uppercase">AUTOVALY</div>
      </div>
      <div className="flex-shrink-0 lg:w-[40%] bg-text-light text-background flex flex-col justify-center p-6 md:p-8 lg:p-14">
        <span className={`inline-block self-start px-3 py-1 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm mb-4 ${tagColor}`}>{article.category} News</span>
        <h1 className="font-heading text-4xl md:text-5xl lg:text-[52px] font-bold leading-[1.08] text-background mb-6">{article.title}</h1>
        <p className="text-base lg:text-[18px] text-text-muted leading-relaxed mb-8">{article.excerpt}</p>
        <div className="flex items-center gap-3 text-sm text-text-muted mb-10 flex-wrap">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-red-400 flex-shrink-0" />
          <span className="font-medium">{article.author.name}</span>
          <span className="text-text-muted/60 font-bold">·</span>
          <span>{formatDate(article.publishedAt)}</span>
          <span className="text-text-muted/60 font-bold">·</span>
          <span>{article.readTime}</span>
        </div>
        <Link href={`/articles/${article.slug}`} className="inline-flex items-center gap-2 self-start px-7 py-3 bg-accent text-white rounded-md font-semibold text-sm uppercase tracking-wide transition-all duration-300 hover:scale-[1.03] hover:brightness-110">
          Read Full Story <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
