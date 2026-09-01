import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import FeaturedDrops from "@/components/FeaturedDrops";
import BrandStory from "@/components/BrandStory";
import CatalogCta from "@/components/CatalogCta";
import Footer from "@/components/Footer";
import IntroSplash from "@/components/IntroSplash";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-paper">
      <IntroSplash />
      <Nav />
      <main className="flex-1">
        <Hero />
        <FeaturedDrops />
        <BrandStory />
        <CatalogCta />
      </main>
      <Footer />
    </div>
  );
}
