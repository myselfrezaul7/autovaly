export default function Loading() {
  return (
    <div className="flex-1 min-h-[50vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-border-custom border-t-accent rounded-full animate-spin"></div>
        <p className="font-heading uppercase tracking-widest text-sm text-text-muted font-bold animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
