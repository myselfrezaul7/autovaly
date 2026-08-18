"use client";

interface CookieSettingsButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function CookieSettingsButton({
  className = "px-6 py-2.5 rounded-xl bg-accent text-white font-heading font-bold uppercase tracking-wider text-xs shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all touch-press active:scale-95 flex-shrink-0 cursor-pointer",
  children = "Open Cookie Settings",
}: CookieSettingsButtonProps) {
  const openCookieSettings = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-cookie-settings"));
    }
  };

  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className={className}
      aria-label="Manage cookie and privacy preferences"
    >
      {children}
    </button>
  );
}
