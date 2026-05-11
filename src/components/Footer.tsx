export default function Footer() {
  return (
    <footer className="bg-footer-bg text-gray-400 pt-16 pb-8 border-t border-border-custom">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Col 1: Brand & Social */}
          <div className="flex flex-col gap-6">
            <a href="/" className="font-heading font-extrabold text-2xl tracking-wide uppercase text-text-light">
              AUTO<span className="text-accent">VALY</span>
            </a>
            <p className="text-sm leading-relaxed max-w-xs">
              Drive the Story. Enthusiast-grade depth, mainstream readability. Your definitive source for car news, reviews, and industry trends.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-accent transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-accent transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-accent transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-accent transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-text-light font-bold uppercase tracking-widest text-sm mb-6">Quick Links</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">News</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Reviews</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">EVs</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Comparisons</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Specs DB</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">About</a></li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h3 className="text-text-light font-bold uppercase tracking-widest text-sm mb-6">Categories</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Sedans</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">SUVs</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Sports Cars</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Trucks</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Luxury</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Electric</a></li>
            </ul>
          </div>

          {/* Col 4: Company */}
          <div>
            <h3 className="text-text-light font-bold uppercase tracking-widest text-sm mb-6">Company</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Advertise</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-custom flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium">
          <p>© 2025 Autovaly. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for car people <span className="text-accent">♥</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
