export default function VehicleDetailLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="container mx-auto px-4 md:px-6 pt-6">
        <div className="flex items-center gap-2">
          <div className="w-16 h-4 rounded skeleton-shimmer" />
          <span className="text-border-custom">/</span>
          <div className="w-20 h-4 rounded skeleton-shimmer" />
          <span className="text-border-custom">/</span>
          <div className="w-36 h-4 rounded skeleton-shimmer" />
        </div>
      </div>

      {/* Hero Section Placeholder */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 md:px-6 border-b border-border-custom bg-surface/50">
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-16 h-6 rounded skeleton-shimmer" />
              <div className="w-20 h-6 rounded skeleton-shimmer" />
              <div className="w-16 h-6 rounded skeleton-shimmer" />
            </div>

            {/* Title / Make & Model */}
            <div className="space-y-3">
              <div className="w-32 h-6 rounded skeleton-shimmer" />
              <div className="w-3/4 h-12 sm:h-16 rounded-2xl skeleton-shimmer" />
            </div>

            {/* Trim */}
            <div className="w-52 h-6 rounded skeleton-shimmer" />

            {/* Action Bar / Price */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="w-36 h-10 rounded-xl skeleton-shimmer" />
              <div className="w-36 h-10 rounded-xl skeleton-shimmer" />
              <div className="w-48 h-10 rounded-xl skeleton-shimmer" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Specs Column */}
          <div className="lg:col-span-2 space-y-16">
            {/* Key Highlights Skeleton */}
            <div>
              <div className="w-40 h-7 rounded skeleton-shimmer mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 bg-surface p-4 rounded-lg border border-border-custom">
                    <div className="w-5 h-5 rounded-full skeleton-shimmer flex-shrink-0" />
                    <div className="w-3/4 h-4 rounded skeleton-shimmer" />
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Table Skeleton */}
            <div>
              <div className="w-48 h-7 rounded skeleton-shimmer mb-6" />
              <div className="bg-surface rounded-xl border border-border-custom overflow-hidden p-6 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-border-custom last:border-0">
                    <div className="w-32 h-4 rounded skeleton-shimmer" />
                    <div className="w-24 h-4 rounded skeleton-shimmer" />
                  </div>
                ))}
              </div>
            </div>

            {/* Battery & Charging Table Skeleton */}
            <div>
              <div className="w-56 h-7 rounded skeleton-shimmer mb-6" />
              <div className="bg-surface rounded-xl border border-border-custom overflow-hidden p-6 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-border-custom last:border-0">
                    <div className="w-36 h-4 rounded skeleton-shimmer" />
                    <div className="w-20 h-4 rounded skeleton-shimmer" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Placeholder */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-surface border border-border-custom rounded-2xl p-6 space-y-4">
              <div className="w-36 h-6 rounded skeleton-shimmer" />
              <div className="space-y-2">
                <div className="w-full h-4 rounded skeleton-shimmer" />
                <div className="w-5/6 h-4 rounded skeleton-shimmer" />
                <div className="w-4/5 h-4 rounded skeleton-shimmer" />
              </div>
              <div className="w-full h-10 rounded-xl skeleton-shimmer mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
