import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-footer-bg text-gray-400 pt-16 pb-8 border-t border-border-custom">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <Link href="/" className="font-heading font-extrabold text-2xl tracking-wide uppercase text-text-light flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="text-accent"><path d="M4 20l3-8h18l3 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 20h28v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2"/><circle cx="9" cy="26" r="2.5" fill="currentColor"/><circle cx="23" cy="26" r="2.5" fill="currentColor"/></svg>
              AUTO<span className="text-accent">VALY</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">Drive the Story. Enthusiast-grade depth, mainstream readability. Your definitive source for car news, reviews, and industry trends.</p>
            <div className="flex items-center gap-4 mt-2">
              <a href="https://twitter.com/autovaly" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-accent transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg></a>
              <a href="https://instagram.com/autovaly" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-accent transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
              <a href="https://youtube.com/@autovaly" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-gray-400 hover:text-accent transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg></a>
              <a href="https://facebook.com/autovaly" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-accent transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
            </div>
          </div>
          <div>
            <h3 className="text-text-light font-bold uppercase tracking-widest text-sm mb-6">Quick Links</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/news" className="hover:text-accent transition-colors">News</Link></li>
              <li><Link href="/reviews" className="hover:text-accent transition-colors">Reviews</Link></li>
              <li><Link href="/evs" className="hover:text-accent transition-colors">EVs</Link></li>
              <li><Link href="/search" className="hover:text-accent transition-colors">Search</Link></li>
              <li><Link href="#specs" className="hover:text-accent transition-colors">Specs DB</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-text-light font-bold uppercase tracking-widest text-sm mb-6">Categories</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/search?q=sedans" className="hover:text-accent transition-colors">Sedans</Link></li>
              <li><Link href="/search?q=SUVs" className="hover:text-accent transition-colors">SUVs</Link></li>
              <li><Link href="/search?q=sports" className="hover:text-accent transition-colors">Sports Cars</Link></li>
              <li><Link href="/search?q=trucks" className="hover:text-accent transition-colors">Trucks</Link></li>
              <li><Link href="/search?q=luxury" className="hover:text-accent transition-colors">Luxury</Link></li>
              <li><Link href="/evs" className="hover:text-accent transition-colors">Electric</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-text-light font-bold uppercase tracking-widest text-sm mb-6">Company</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Advertise</Link></li>
              <li><Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border-custom flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
          <p>© 2025 Autovaly. All rights reserved.</p>
          <p className="flex items-center gap-1">Built for car people <span className="text-accent">♥</span></p>
        </div>
      </div>
    </footer>
  );
}
