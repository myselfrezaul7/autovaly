import { Metadata } from "next";
import GarageView from "@/components/GarageView";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "My Garage — Saved Vehicles & Fleets",
  description: "View, manage, and compare your saved vehicles in your personal Autovaly garage.",
  robots: { index: false },
  alternates: { canonical: "/garage" },
};

export default function GaragePage() {
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "My Garage", url: "/garage" },
  ];

  return (
    <main id="main-content" className="min-h-screen bg-background pb-20 text-text-light">
      <BreadcrumbJsonLd crumbs={crumbs} />
      <div className="container mx-auto px-4 md:px-6 pt-6">
        <Breadcrumbs crumbs={crumbs} />
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-8 pb-8 border-b border-border-custom">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold uppercase tracking-tight flex items-center gap-3 border-l-[5px] border-accent pl-4 text-text-light">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent" aria-hidden="true">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          My Garage
        </h1>
        <p className="text-text-muted mt-2 text-lg">Your personal collection of dream cars and saved vehicles.</p>
      </div>
      
      <GarageView />
    </main>
  );
}
