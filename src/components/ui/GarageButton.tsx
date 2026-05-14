"use client";

import { Vehicle } from "@/lib/types";
import { useGarage } from "@/lib/useGarage";
import { m, AnimatePresence } from "framer-motion";

export default function GarageButton({ vehicle }: { vehicle: Vehicle }) {
  const { isInGarage, addToGarage, removeFromGarage } = useGarage();
  const saved = isInGarage(vehicle.id);

  const toggleGarage = () => {
    if (saved) {
      removeFromGarage(vehicle.id);
    } else {
      addToGarage(vehicle);
    }
  };

  return (
    <m.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleGarage}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-bold text-sm transition-colors border ${
        saved 
          ? "bg-accent/10 border-accent text-accent hover:bg-accent/20" 
          : "bg-surface border-border-custom hover:border-accent hover:text-accent"
      }`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {saved ? (
            <m.svg
              key="saved"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="absolute"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </m.svg>
          ) : (
            <m.svg
              key="unsaved"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="absolute"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </m.svg>
          )}
        </AnimatePresence>
      </div>
      {saved ? "Saved to Garage" : "Save to Garage"}
    </m.button>
  );
}
