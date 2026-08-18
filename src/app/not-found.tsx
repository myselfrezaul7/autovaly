import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="min-h-[80vh] bg-background text-text-light flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-surface pointer-events-none animated-grid gradient-mesh opacity-50" aria-hidden="true" />

      <div className="relative z-10 max-w-2xl w-full">
        <div className="relative inline-block">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/20 rounded-full blur-[80px] pointer-events-none animate-pulse" aria-hidden="true" />
          <h1
            className="relative z-10 font-heading text-8xl md:text-[150px] font-extrabold mb-2 tracking-tighter drop-shadow-2xl"
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </h1>
        </div>
        <h2 className="font-heading text-2xl md:text-4xl font-bold mb-4 uppercase tracking-wider">
          Looks like you took a wrong turn <span aria-hidden="true">🏎️</span>
        </h2>
        <p className="text-text-muted text-lg mb-10">
          We can&apos;t find the page you&apos;re looking for. It might have been moved or never existed.
        </p>

        <form action="/search" method="GET" className="w-full max-w-md mx-auto relative mb-16">
          <label htmlFor="404-search-input" className="sr-only">
            Search Autovaly
          </label>
          <input
            id="404-search-input"
            type="text"
            name="q"
            placeholder="Search Autovaly..."
            className="w-full bg-surface border-2 border-border-custom rounded-full px-6 py-4 outline-none focus:border-accent transition-colors text-text-light"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-accent text-white px-6 rounded-full font-bold uppercase tracking-wide text-sm hover:bg-accent-dark transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface border border-border-custom rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-300 hover:border-accent hover:text-accent touch-press active:scale-95"
          >
            Go to Homepage
          </Link>
          <Link
            href="/garage"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-white rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-300 hover:bg-accent-dark touch-press active:scale-[0.98]"
          >
            View My Garage
          </Link>
        </div>
      </div>
    </main>
  );
}
