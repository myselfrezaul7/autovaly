"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGarage } from "@/lib/useGarage";

export default function MobileNav() {
  const pathname = usePathname();
  const { garageCount } = useGarage();

  const links = [
    {
      name: "Home",
      href: "/",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      name: "Vehicles",
      href: "/vehicles",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 3c-.1.2-.1.5-.1.8v4.3c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
        </svg>
      ),
    },
    {
      name: "Compare",
      href: "/compare",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      name: "Classics",
      href: "/classics",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="12 6 14.5 10.5 19.5 11.2 16 14.6 16.8 19.5 12 17.2 7.2 19.5 8 14.6 4.5 11.2 9.5 10.5 12 6" />
        </svg>
      ),
    },
    {
      name: "Garage",
      href: "/garage",
      icon: (
        <div className="relative">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          {garageCount > 0 && (
            <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-accent text-white text-[8px] rounded-full flex items-center justify-center font-extrabold">
              {garageCount}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-2xl border-t border-border-custom pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_25px_rgba(0,0,0,0.35)]">
      <nav className="flex items-center justify-around h-[58px] px-1">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full py-1 transition-all touch-press active:scale-95 ${
                isActive ? "text-accent" : "text-text-muted hover:text-text-light"
              }`}
            >
              <div className={`${isActive ? "scale-110" : ""} transition-transform`}>
                {link.icon}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
