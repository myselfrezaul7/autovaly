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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
      )
    },
    {
      name: "Search",
      href: "/search",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      )
    },
    {
      name: "Garage",
      href: "/garage",
      icon: (
        <div className="relative">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          {garageCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent text-white text-[10px] rounded-full flex items-center justify-center font-bold">
              {garageCount}
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border-custom pb-[env(safe-area-inset-bottom)]">
      <nav className="flex items-center justify-around h-[60px] px-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors touch-press active:scale-95 ${isActive ? 'text-accent' : 'text-muted hover:text-text-light'}`}
            >
              <div className={`${isActive ? 'scale-110' : ''} transition-transform`}>
                {link.icon}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
