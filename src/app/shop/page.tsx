import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ShopGrid from "@/components/ShopGrid";
import { WhatsAppIcon } from "@/components/icons";
import { getAllProducts } from "@/lib/products";
import { buildWhatsAppLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop — Thrift Hub",
  description:
    "Browse the full Thrift Hub catalog — every reworked secondhand piece we've got, filterable by category, size, and price.",
};

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <div className="flex min-h-full flex-col bg-paper">
      <Nav />
      <main className="flex-1">
        <section className="bg-paper pt-14 pb-20 sm:pt-20 sm:pb-28">
          <div className="mx-auto max-w-[1800px] px-5 sm:px-8">
            <Reveal className="max-w-xl">
              <p className="clip-ticket inline-block bg-charcoal px-4 py-2 font-tag text-[12px] font-bold uppercase tracking-[0.15em] text-orange-light">
                The full rack
              </p>
              <h1 className="mt-3 font-display text-4xl leading-[0.95] text-ink sm:text-5xl">
                Every piece we&apos;ve got.
              </h1>
              <p className="mt-4 font-body text-base leading-relaxed text-ink/70">
                Filter by category, size, or price to find your next piece.
                Everything here is one of one — message us on WhatsApp
                before it&apos;s gone.
              </p>
            </Reveal>

            <div className="mt-12">
              {products.length === 0 ? (
                <p className="font-body text-base text-ink/60">
                  Nothing&apos;s in the catalog yet — check back soon.
                </p>
              ) : (
                <ShopGrid products={products} />
              )}
            </div>
          </div>
        </section>

        <section className="border-t border-paper-line bg-paper-dim py-16 sm:py-20">
          <div className="mx-auto max-w-[1800px] px-5 sm:px-8">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl leading-[0.95] text-ink sm:text-4xl">
                Didn&apos;t find your size or the exact piece?
              </h2>
              <p className="mx-auto mt-4 max-w-lg font-body text-base leading-relaxed text-ink/70">
                New drops land regularly and not everything makes it online
                first. Message us on WhatsApp and we&apos;ll let you know
                what&apos;s coming, or dig through the rack for you.
              </p>
              <a
                href={buildWhatsAppLink(
                  "Hi! I couldn't find what I was looking for on the shop page — can you help?"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="clip-ticket mt-7 inline-flex items-center gap-2 bg-gradient-to-r from-orange-light to-orange px-7 py-3.5 font-tag text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:-translate-y-0.5"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Ask on WhatsApp
              </a>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
