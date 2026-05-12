import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-text-light flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-heading text-8xl md:text-9xl font-extrabold text-accent mb-4">404</h1>
      <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4 uppercase tracking-wider">Wrong Turn</h2>
      <p className="text-muted text-lg mb-10 max-w-md">The page you&apos;re looking for has either been moved, removed, or never existed. Let&apos;s get you back on track.</p>
      <Link href="/" className="inline-flex items-center gap-2 px-7 py-3 bg-accent text-white rounded-md font-semibold text-sm uppercase tracking-wide transition-all duration-300 hover:scale-[1.03] hover:brightness-110">
        ← Back to Home
      </Link>
    </div>
  );
}
