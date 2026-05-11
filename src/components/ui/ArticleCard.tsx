import { m } from "framer-motion";
import clsx from "clsx";

interface ArticleCardProps {
  variant?: "large" | "compact" | "portrait" | "segment";
  tag: string;
  tagColorClass?: string;
  headline: string;
  excerpt?: string;
  author: string;
  date: string;
  readTime?: string;
  gradientFrom: string;
  gradientTo: string;
}

export default function ArticleCard({
  variant = "large",
  tag,
  tagColorClass = "bg-tag-news",
  headline,
  excerpt,
  author,
  date,
  readTime,
  gradientFrom,
  gradientTo,
}: ArticleCardProps) {
  const isCompact = variant === "compact";
  const isPortrait = variant === "portrait";
  const isSegment = variant === "segment";

  return (
    <m.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={clsx(
        "group bg-surface border border-border-custom rounded-md overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 flex",
        {
          "flex-col": !isCompact,
          "flex-row": isCompact,
          "min-w-[280px] w-[280px] snap-center": isPortrait,
        }
      )}
    >
      {/* Image Area */}
      <div 
        className={clsx(
          "relative overflow-hidden flex-shrink-0",
          {
            "w-[40%] min-h-[140px]": isCompact,
            "w-full h-[320px]": variant === "large",
            "w-full h-[180px]": isSegment,
            "w-full h-[380px]": isPortrait,
          }
        )}
      >
        <div 
          className="absolute inset-0 bg-gradient-to-br transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          style={{ backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
        />
        {/* Subtle overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* Content Area */}
      <div 
        className={clsx(
          "flex flex-col flex-1",
          {
            "p-5": variant === "large" || isSegment,
            "p-4": isCompact,
            "absolute bottom-0 left-0 w-full p-5 z-10 bg-gradient-to-t from-[#111318] to-transparent": isPortrait,
          }
        )}
      >
        <span 
          className={clsx(
            "inline-block self-start text-[10px] font-bold uppercase tracking-widest rounded-sm mb-2 text-white px-2 py-0.5",
            tagColorClass
          )}
        >
          {tag}
        </span>
        
        <h3 
          className={clsx(
            "font-heading font-bold leading-[1.2] transition-colors duration-300 group-hover:text-accent",
            {
              "text-xl mb-3 relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 group-hover:after:w-10": variant === "large",
              "text-base mb-2": isCompact,
              "text-lg": isSegment,
              "text-xl text-white": isPortrait,
            }
          )}
        >
          {headline}
        </h3>
        
        {excerpt && !isCompact && !isPortrait && (
          <p className="text-sm text-muted leading-relaxed mb-4 flex-1">
            {excerpt}
          </p>
        )}
        
        <div className={clsx(
          "flex items-center gap-2 text-[13px] mt-auto flex-wrap",
          isPortrait ? "text-gray-300" : "text-muted"
        )}>
          {!isCompact && !isPortrait && <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-500 to-gray-300 flex-shrink-0" />}
          <span className="font-medium">{author}</span>
          <span className="opacity-50">·</span>
          <span>{date}</span>
          {readTime && (
            <>
              <span className="opacity-50">·</span>
              <span>{readTime}</span>
            </>
          )}
        </div>
      </div>
    </m.article>
  );
}
