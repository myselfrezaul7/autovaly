import TopBar from "@/components/TopBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BreakingTicker from "@/components/BreakingTicker";
import TopStories from "@/components/TopStories";
import BySegment from "@/components/BySegment";
import ComparisonBanner from "@/components/ComparisonBanner";
import EVSpotlight from "@/components/EVSpotlight";
import EditorsPicks from "@/components/EditorsPicks";
import SpecsPromo from "@/components/SpecsPromo";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        <Hero />
        <BreakingTicker />
        <TopStories />
        <BySegment />
        <ComparisonBanner />
        <EVSpotlight />
        <EditorsPicks />
        <SpecsPromo />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
