import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

export default async function FeaturedDrops() {
  const products = await getFeaturedProducts();

  if (products.length === 0) {
    return null;
  }

  const [feature, ...rest] = products;

  return (
    <section id="drops" data-tour="featured-drops" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-[1800px] px-5 sm:px-8">
        <Reveal className="max-w-xl">
          <p className="clip-ticket inline-block bg-charcoal px-4 py-2 font-tag text-[12px] font-bold uppercase tracking-[0.15em] text-teal-light">
            Drop 014 &middot; {products.length}{" "}
            {products.length === 1 ? "piece" : "pieces"}
          </p>
          <h2 className="mt-3 font-display text-4xl leading-[0.95] text-ink sm:text-5xl">
            Grab it before it&apos;s regrabbed.
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-ink/70">
            This week&apos;s rack, reworked and photographed as-is. Message
            us the piece and your size and we&apos;ll hold it for 24 hours.
          </p>
        </Reveal>

        {/*
          Two independent grid blocks instead of one dense-packed grid.
          Dense packing + a row-span-2 feature tile forced the browser to
          reconcile a 2-row-tall cell against 1-row-tall neighbors, which
          left a large blank void under whichever neighbor was shorter (see
          eval issue 1). Splitting into "feature row" + "rest row" means no
          track ever needs to serve two spans at once, and align-items
          stretch (the grid default) makes the shorter neighbor's own card
          fill its row instead of leaving empty page background.
        */}
        <div
          className={`mt-12 grid grid-cols-1 gap-7 ${rest.length > 0 ? "lg:grid-cols-3" : ""}`}
        >
          <Reveal className={rest.length > 0 ? "lg:col-span-2" : undefined}>
            <ProductCard product={feature} featured />
          </Reveal>
          {rest[0] ? (
            <Reveal delay={90}>
              <ProductCard product={rest[0]} />
            </Reveal>
          ) : null}
        </div>

        {rest.length > 1 ? (
          <div className="mt-7 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(1).map((product, i) => (
              <Reveal key={product.id} delay={(i + 2) * 90}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
