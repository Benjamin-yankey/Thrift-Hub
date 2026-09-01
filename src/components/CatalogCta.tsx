import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/site";
import { WhatsAppIcon, ArrowIcon } from "./icons";
import Reveal from "./Reveal";

export default function CatalogCta() {
  const whatsappHref = buildWhatsAppLink(
    "Hi! I'd like to know more about the current Thrift Hub drop."
  );

  return (
    <section className="relative overflow-hidden bg-charcoal py-20 text-cloud sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-teal-light) 1.6px, transparent 1.6px)",
          backgroundSize: "16px 16px",
        }}
      />
      <Reveal className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <h2 className="font-display text-4xl leading-[0.95] sm:text-5xl">
          Every piece here says
          <br />
          it&apos;s the only one.
        </h2>
        <p className="mx-auto mt-5 max-w-lg font-body text-base leading-relaxed text-cloud/70 sm:text-lg">
          Browse the full catalog, filter by category, size, and price, and
          message us the piece and your size when you find the one.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            data-tour="catalog-shop-link"
            className="clip-ticket inline-flex items-center gap-2 bg-cloud px-7 py-3.5 font-tag text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:-translate-y-0.5"
          >
            Shop the drop
            <ArrowIcon className="h-4 w-4" />
          </Link>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="clip-ticket inline-flex items-center gap-2 bg-gradient-to-r from-orange-light to-orange px-7 py-3.5 font-tag text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Order via WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  );
}
