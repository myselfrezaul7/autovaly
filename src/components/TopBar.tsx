export default function TopBar() {
  return (
    <div className="bg-accent h-9 flex items-center overflow-hidden relative z-50">
      <div className="flex items-center whitespace-nowrap animate-[ticker_30s_linear_infinite]">
        {/* We repeat the ticker items to create a seamless loop */}
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center">
            <span className="flex items-center gap-2 text-xs font-medium text-white px-6">
              <span className="inline-flex items-center gap-1 font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                LIVE
              </span>
              <span className="mx-1">|</span>
              Tesla cuts prices again across European markets
            </span>
            <span className="flex items-center gap-2 text-xs font-medium text-white px-6">
              Rivian R2 pre-orders exceed 100,000 in first week
            </span>
            <span className="flex items-center gap-2 text-xs font-medium text-white px-6">
              Mercedes announces EQS price cuts across all markets
            </span>
            <span className="flex items-center gap-2 text-xs font-medium text-white px-6">
              Ferrari reveals first hybrid V12 for 296 GTB successor
            </span>
          </div>
        ))}
      </div>
      
      <div className="absolute right-0 top-0 bottom-0 flex items-center gap-4 text-xs text-white font-medium bg-accent px-6 z-10 before:content-[''] before:absolute before:-left-5 before:top-0 before:bottom-0 before:w-5 before:bg-gradient-to-r before:from-transparent before:to-accent hidden md:flex">
        <span>May 12, 2025</span>
        <span>|</span>
        <button className="cursor-pointer font-bold hover:text-white/80 transition-colors">EN ▾</button>
      </div>
    </div>
  );
}
