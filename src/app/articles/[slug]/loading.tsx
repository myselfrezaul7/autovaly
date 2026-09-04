export default function ArticleDetailLoading() {
  return (
    <div className="min-h-screen bg-background text-text-light pb-20 animate-pulse">
      {/* Hero Banner Placeholder */}
      <div className="w-full h-72 sm:h-96 lg:h-[420px] relative overflow-hidden skeleton-shimmer border-b border-border-custom">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      {/* Article Content Container */}
      <main className="container mx-auto px-4 md:px-6 -mt-28 relative z-10 max-w-6xl">
        {/* Breadcrumb Skeleton */}
        <div className="mb-6 flex items-center gap-2">
          <div className="w-16 h-4 rounded skeleton-shimmer" />
          <span className="text-border-custom">/</span>
          <div className="w-20 h-4 rounded skeleton-shimmer" />
          <span className="text-border-custom">/</span>
          <div className="w-48 h-4 rounded skeleton-shimmer" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Body Column */}
          <article className="lg:col-span-8 bg-surface border border-border-custom rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl space-y-6">
            {/* Category Tag */}
            <div className="w-24 h-6 rounded-md skeleton-shimmer" />

            {/* Title */}
            <div className="space-y-3">
              <div className="w-full h-10 rounded-xl skeleton-shimmer" />
              <div className="w-4/5 h-10 rounded-xl skeleton-shimmer" />
            </div>

            {/* Author Byline */}
            <div className="flex items-center gap-3.5 border-b border-border-custom pb-6 pt-2">
              <div className="w-10 h-10 rounded-full skeleton-shimmer flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="w-32 h-4 rounded skeleton-shimmer" />
                <div className="w-44 h-3 rounded skeleton-shimmer" />
              </div>
            </div>

            {/* Body Paragraphs */}
            <div className="space-y-4 pt-2">
              <div className="w-full h-4 rounded skeleton-shimmer" />
              <div className="w-full h-4 rounded skeleton-shimmer" />
              <div className="w-11/12 h-4 rounded skeleton-shimmer" />
              <div className="w-4/5 h-4 rounded skeleton-shimmer" />
            </div>

            {/* Inline Figure / Image placeholder */}
            <div className="w-full h-64 sm:h-80 rounded-2xl skeleton-shimmer border border-border-custom my-8" />

            {/* Subsequent Paragraphs */}
            <div className="space-y-4">
              <div className="w-full h-4 rounded skeleton-shimmer" />
              <div className="w-full h-4 rounded skeleton-shimmer" />
              <div className="w-5/6 h-4 rounded skeleton-shimmer" />
              <div className="w-3/4 h-4 rounded skeleton-shimmer" />
            </div>
          </article>

          {/* Sidebar Column: Table of Contents & Quick Meta */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-6">
            {/* TOC Placeholder */}
            <div className="p-6 rounded-2xl bg-surface border border-border-custom shadow-lg space-y-4">
              <div className="w-36 h-5 rounded skeleton-shimmer" />
              <div className="space-y-2.5 pt-2">
                <div className="w-48 h-4 rounded skeleton-shimmer" />
                <div className="w-40 h-4 rounded skeleton-shimmer" />
                <div className="w-52 h-4 rounded skeleton-shimmer" />
                <div className="w-36 h-4 rounded skeleton-shimmer" />
              </div>
            </div>

            {/* Author Credibility Card Placeholder */}
            <div className="p-6 rounded-2xl bg-surface border border-border-custom shadow-lg space-y-3">
              <div className="w-24 h-3 rounded skeleton-shimmer" />
              <div className="w-36 h-5 rounded skeleton-shimmer" />
              <div className="space-y-2 pt-1">
                <div className="w-full h-3 rounded skeleton-shimmer" />
                <div className="w-5/6 h-3 rounded skeleton-shimmer" />
                <div className="w-4/5 h-3 rounded skeleton-shimmer" />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
