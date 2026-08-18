import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import TopStories from "@/components/TopStories";
import SpecsPromo from "@/components/SpecsPromo";
import PopularVehicles from "@/components/PopularVehicles";

// Dynamic imports for below-the-fold sections
const BySegment = dynamic(() => import("@/components/BySegment"), {
  loading: () => <div className="min-h-[400px] bg-background/50 animate-pulse" />,
});

const ComparisonBanner = dynamic(() => import("@/components/ComparisonBanner"), {
  loading: () => <div className="min-h-[300px] bg-background/50 animate-pulse" />,
});

const EVSpotlight = dynamic(() => import("@/components/EVSpotlight"), {
  loading: () => <div className="min-h-[450px] bg-background/50 animate-pulse" />,
});

const ClassicSpotlight = dynamic(() => import("@/components/ClassicSpotlight"), {
  loading: () => <div className="min-h-[450px] bg-background/50 animate-pulse" />,
});

const EditorsPicks = dynamic(() => import("@/components/EditorsPicks"), {
  loading: () => <div className="min-h-[350px] bg-background/50 animate-pulse" />,
});

const Newsletter = dynamic(() => import("@/components/Newsletter"), {
  loading: () => <div className="min-h-[250px] bg-background/50 animate-pulse" />,
});

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <TopStories />
      <SpecsPromo />
      <PopularVehicles />
      <BySegment />
      <ComparisonBanner />
      <EVSpotlight />
      <ClassicSpotlight />
      <EditorsPicks />
      <Newsletter />
    </main>
  );
}
