import { Metadata } from "next";
import { classicSpotlightItems } from "@/lib/data/classic-spotlight";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ItemListJsonLd from "@/components/ItemListJsonLd";
import ClassicsClientHub from "@/components/ClassicsClientHub";

export const metadata: Metadata = {
  title: "Classic Cars & Heritage Archive — Legendary Automotive Icons",
  description: "Explore the greatest classic cars in automotive history. From the Shelby GT500 and Mercedes 300 SL Gullwing to the Ferrari F40 and McLaren F1.",
  openGraph: {
    title: "Classic Cars & Heritage Archive | Autovaly",
    description: "Explore the greatest classic cars in automotive history with in-depth specs, historical context, and photography.",
    url: "https://autovaly.com/classics",
  },
  alternates: { canonical: "/classics" },
};

export default function ClassicsPage() {
  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Classics", url: "/classics" }
  ];

  const itemList = classicSpotlightItems.map((c, i) => ({
    position: i + 1,
    name: c.name,
    url: `https://autovaly.com/articles/${c.slug}`,
  }));

  return (
    <div className="min-h-screen bg-background text-text-light py-12 md:py-16">
      <BreadcrumbJsonLd crumbs={crumbs} />
      <ItemListJsonLd items={itemList} />

      <main className="container mx-auto px-4 md:px-6">
        <Breadcrumbs crumbs={crumbs} />

        {/* Hero Header */}
        <div className="mb-10 pb-6 border-b border-border-custom">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] bg-[#d4af37]/10 px-3 py-1 rounded border border-[#d4af37]/25 inline-flex items-center gap-1.5">
              🏆 Heritage & Collector Archive
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-tight mb-4">
            Legendary <span className="text-[#d4af37]">Classic Cars</span>
          </h1>
          <p className="text-base sm:text-lg text-text-muted max-w-3xl leading-relaxed">
            The defining machines of automotive history: homologation race specials, golden-era muscle, and analog supercars that shaped modern driving.
          </p>
        </div>

        {/* Interactive Filterable Fleet */}
        <ClassicsClientHub initialItems={classicSpotlightItems} />
      </main>
    </div>
  );
}
