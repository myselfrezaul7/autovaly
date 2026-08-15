import Hero from "@/components/Hero";
import TopStories from "@/components/TopStories";
import PopularVehicles from "@/components/PopularVehicles";
import BySegment from "@/components/BySegment";
import ComparisonBanner from "@/components/ComparisonBanner";
import EVSpotlight from "@/components/EVSpotlight";
import ClassicSpotlight from "@/components/ClassicSpotlight";
import EditorsPicks from "@/components/EditorsPicks";
import SpecsPromo from "@/components/SpecsPromo";
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <>
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
    </>
  );
}
