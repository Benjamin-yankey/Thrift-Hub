import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import FeaturedDrops from "@/components/FeaturedDrops";
import BrandStory from "@/components/BrandStory";
import CatalogCta from "@/components/CatalogCta";
import Footer from "@/components/Footer";
import IntroSplash from "@/components/IntroSplash";

// Featured Drops reads from Supabase on every request (see
// src/lib/products.ts) — no caching, so an admin publish shows up on the
// next load without a redeploy.
export const revalidate = 0;

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
