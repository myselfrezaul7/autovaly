export default function Loading() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-6xl">
      {/* Top Banner Skeleton */}
      <div className="w-full h-64 sm:h-80 rounded-3xl skeleton-shimmer border border-border-custom mb-10 overflow-hidden" />

      {/* Header Skeleton */}
      <div className="space-y-4 mb-10">
        <div className="w-28 h-5 rounded-md skeleton-shimmer" />
        <div className="w-3/4 h-10 rounded-xl skeleton-shimmer" />
        <div className="w-1/2 h-4 rounded-md skeleton-shimmer" />
      </div>

      {/* Grid of 3 Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-border-custom bg-surface overflow-hidden p-4 space-y-4">
            <div className="w-full h-44 rounded-xl skeleton-shimmer" />
            <div className="w-20 h-4 rounded skeleton-shimmer" />
            <div className="w-full h-6 rounded skeleton-shimmer" />
            <div className="w-3/4 h-4 rounded skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
