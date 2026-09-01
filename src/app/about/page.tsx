import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { WhatsAppIcon, ArrowIcon } from "@/components/icons";
import { buildWhatsAppLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "About  Thrift Hub",
  description:
    "Thrift Hub sources secondhand clothing from Kantamanto in Accra, reworks it by hand, and drops it in small batches no two pieces alike.",
};

export default function AboutPage() {
  const whatsappHref = buildWhatsAppLink(
    "Hi! I'd like to know more about Thrift Hub.",
  );

  return (
    <div className="flex min-h-full flex-col bg-paper">
      <Nav />
      <main className="flex-1">
        {/* Intro */}
        <section className="relative overflow-hidden bg-paper pt-14 pb-16 sm:pt-20 sm:pb-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-[0.35]"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--color-teal-light) 1.6px, transparent 1.6px)",
              backgroundSize: "14px 14px",
            }}
          />
          <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
            <Reveal>
              <p className="clip-ticket inline-block bg-charcoal px-4 py-2 font-tag text-[12px] font-bold uppercase tracking-[0.15em] text-orange-light">
                Our story
              </p>
              <h1 className="mt-4 font-display text-[clamp(2.5rem,9vw,4rem)] leading-[0.95] text-ink">
                We don&apos;t make clothes.
                <br />
                <span className="text-orange-deep">
                  We give them a second life.
                </span>
              </h1>
              <p className="mt-6 max-w-xl font-body text-lg leading-relaxed text-ink/75">
                Our thrift clothing store offers stylish, affordable, and
                high-quality fashion for everyone. We carefully select unique
                pre-loved clothing that allows customers to express their
                personal style while saving money.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Kantamanto sourcing */}
        <section id="sourcing" className="bg-cloud py-20 sm:py-24">
          <div className="mx-auto grid max-w-[1800px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
            <Reveal className="order-2 lg:order-1">
              <div
                className="relative mx-auto max-w-sm lg:mx-0"
                style={{ transform: "rotate(2deg)" }}
              >
                <div className="stitch-v absolute -right-4 top-3 bottom-3 hidden text-ink/20 sm:block" />
                <Image
                  src="/hero/flat-lay.svg"
                  alt="Flat-lay illustration of a reworked varsity jacket, wide-leg denim, sneakers, and a swing hangtag"
                  width={720}
                  height={720}
                  className="w-full"
                />
              </div>
            </Reveal>

            <Reveal delay={100} className="order-1 lg:order-2">
              <p className="font-tag text-xs font-bold uppercase tracking-[0.15em] text-teal-deep">
                Where it starts
              </p>
              <h2 className="mt-2 font-display text-4xl leading-[0.95] text-ink sm:text-5xl">
                One bale at a time.
              </h2>
              <div className="mt-6 space-y-4 font-body text-base leading-relaxed text-ink/75 sm:text-lg">
                <p>
                  The market we source from moves more secondhand clothing in a
                  week than most warehouses see in a year bales arrive sealed,
                  and nobody knows exactly what&apos;s inside until they&apos;re
                  cut open. We go in person, dig through bale after bale by
                  hand, and pull out the pieces worth saving: the ones with good
                  bones, real fabric, and a little damage we know how to fix.
                </p>
                <p>
                  Most of what we find never makes a drop. What does has already
                  survived one life somewhere else someone else&apos;s closet,
                  someone else&apos;s decade before it ever reaches our bench.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* The bench / rework process */}
        <section id="bench" className="bg-paper py-20 sm:py-24">
          <div className="mx-auto grid max-w-[1800px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
            <Reveal>
              <p className="font-tag text-xs font-bold uppercase tracking-[0.15em] text-orange-deep">
                Where it ends up
              </p>
              <h2 className="mt-2 font-display text-4xl leading-[0.95] text-ink sm:text-5xl">
                The bench does the rest.
              </h2>
              <div className="mt-6 space-y-4 font-body text-base leading-relaxed text-ink/75 sm:text-lg">
                <p>
                  Every piece reaches you exactly as we found it. Nothing added,
                  nothing changed no needle, no patch, no shortcut. If it made
                  the cut, it was already right.
                </p>
                <p>
                  We&apos;re not hiding where a piece has been, and we&apos;re
                  not touching it either. The fade stays true to whoever wore it
                  before. That&apos;s the whole point not new, not altered, just
                  already perfect, exactly as it came to us.
                </p>
              </div>
              <div className="stitch mt-8 text-ink/15" aria-hidden="true" />
            </Reveal>

            <Reveal delay={100}>
              <div
                className="relative mx-auto max-w-sm"
                style={{ transform: "rotate(-2deg)" }}
              >
                <Image
                  src="/brand/rework-bench.svg"
                  alt="Illustration of a reworking bench with a needle, thread, and a jacket sleeve mid-repair"
                  width={720}
                  height={720}
                  className="w-full"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Why small drops */}
        <section
          id="small-drops"
          className="bg-charcoal py-20 text-cloud sm:py-24"
        >
          <Reveal className="mx-auto max-w-3xl px-5 text-center sm:px-8">
            <p className="font-tag text-xs font-bold uppercase tracking-[0.15em] text-teal-light">
              Why drops, not a warehouse
            </p>
            <h2 className="mt-3 font-display text-4xl leading-[0.95] sm:text-5xl">
              Small on purpose. Gone on purpose.
            </h2>
            <p className="mx-auto mt-5 max-w-xl font-body text-base leading-relaxed text-cloud/75 sm:text-lg">
              We could scale up, source more, move faster. We&apos;d rather keep
              drops small and sizing one piece deep, because that&apos;s what
              makes each find worth finding. When a piece sells, we don&apos;t
              restock the exact same jacket we&apos;re out looking for the next
              one. That&apos;s the whole model: no cart, no warehouse, just us
              and whatever the next bale hands us.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/shop"
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
                Say hi on WhatsApp
              </a>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
}
