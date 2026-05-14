import { Metadata } from "next";
import GarageView from "@/components/GarageView";

export const metadata: Metadata = {
  title: "My Garage",
  description: "Your saved vehicles and dream cars.",
};

export default function GaragePage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 md:px-6 pt-12 pb-8 border-b border-border-custom">
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold uppercase tracking-tight flex items-center gap-3">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          My Garage
        </h1>
        <p className="text-muted mt-2 text-lg">Your personal collection of dream cars and saved vehicles.</p>
      </div>
      
      <GarageView />
    </div>
  );
}
