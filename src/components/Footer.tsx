"use client";

import Link from "next/link";

export default function Footer() {
  const openCookieSettings = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-cookie-settings"));
    }
  };

  return (
    <footer className="bg-footer-bg text-text-secondary pt-16 pb-12 border-t border-border-custom">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-16">
          {/* Column 1: Brand & Socials */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="font-heading font-extrabold text-2xl tracking-wide uppercase text-text-light flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="text-accent"><path d="M4 20l3-8h18l3 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 20h28v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="26" r="2.5" fill="currentColor"/><circle cx="23" cy="26" r="2.5" fill="currentColor"/></svg>
              AUTO<span className="text-accent">VALY</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-text-muted">
              Drive the Story. Enthusiast-grade depth, mainstream readability. Your definitive source for car news, reviews, and vehicle intelligence.
            </p>
            <div className="flex items-center gap-3 mt-1">
              <a href="https://twitter.com/autovaly" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-11 h-11 rounded-lg bg-surface border border-border-custom flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-all touch-press active:scale-95"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg></a>
              <a href="https://instagram.com/autovaly" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-11 h-11 rounded-lg bg-surface border border-border-custom flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-all touch-press active:scale-95"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
              <a href="https://youtube.com/@autovaly" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-11 h-11 rounded-lg bg-surface border border-border-custom flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-all touch-press active:scale-95"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg></a>
              <a href="https://facebook.com/autovaly" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-11 h-11 rounded-lg bg-surface border border-border-custom flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/40 transition-all touch-press active:scale-95"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
            </div>
          </div>

          {/* Column 2 & 3: Quick Links & Categories (Side-by-side on mobile via grid-cols-2) */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:contents">
            <div>
              <h3 className="text-text-light font-bold uppercase tracking-widest text-xs mb-4 md:mb-6 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> Quick Links
              </h3>
              <ul className="flex flex-col gap-2.5 md:gap-3 text-sm">
                <li><Link href="/news" className="hover:text-accent transition-colors">Latest News</Link></li>
                <li><Link href="/reviews" className="hover:text-accent transition-colors">In-Depth Reviews</Link></li>
                <li><Link href="/vehicles" className="hover:text-accent transition-colors">Vehicle Specs DB</Link></li>
                <li><Link href="/compare" className="hover:text-accent transition-colors">Head-to-Head Compare</Link></li>
                <li><Link href="/evs" className="hover:text-accent transition-colors">EV Spotlight Hub</Link></li>
                <li><Link href="/classics" className="hover:text-accent-gold transition-colors">Classic Cars</Link></li>
                <li><Link href="/garage" className="hover:text-accent transition-colors">My Garage</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-text-light font-bold uppercase tracking-widest text-xs mb-4 md:mb-6 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> Categories
              </h3>
              <ul className="flex flex-col gap-2.5 md:gap-3 text-sm">
                <li><Link href="/search?q=sedans" className="hover:text-accent transition-colors">Sedans</Link></li>
                <li><Link href="/search?q=SUVs" className="hover:text-accent transition-colors">SUVs & Crossovers</Link></li>
                <li><Link href="/search?q=sports" className="hover:text-accent transition-colors">Sports Cars & GTs</Link></li>
                <li><Link href="/classics" className="hover:text-accent-gold transition-colors">Heritage Classics</Link></li>
                <li><Link href="/search?q=trucks" className="hover:text-accent transition-colors">Trucks & Pickups</Link></li>
                <li><Link href="/search?q=luxury" className="hover:text-accent transition-colors">Luxury Flagships</Link></li>
                <li><Link href="/evs" className="hover:text-accent transition-colors">100% Electric (BEV)</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 4: Company Section (Full-width 2-col on mobile, normal 1-col on md+) */}
          <div className="pt-6 md:pt-0 border-t border-border-custom/60 md:border-t-0">
            <h3 className="text-text-light font-bold uppercase tracking-widest text-xs mb-4 md:mb-6 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> Company & Legal
            </h3>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-2.5 md:gap-3 text-sm">
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact & Tips</Link></li>
              <li><Link href="/contact?type=advertising" className="hover:text-accent transition-colors">Advertise With Us</Link></li>
              <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              <li>
                <button 
                  onClick={openCookieSettings}
                  className="hover:text-accent text-left transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Cookie Settings</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-custom flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-text-muted">
          <p>© 2026 Autovaly Media. All rights reserved.</p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span>Built for car enthusiasts & buyers</span>
            <span className="text-border-custom">|</span>
            <button onClick={openCookieSettings} className="hover:text-accent transition-colors underline underline-offset-2">
              Manage Preferences
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
