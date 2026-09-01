import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { WhatsAppIcon, TikTokIcon, MailIcon } from "@/components/icons";
import { SITE, buildWhatsAppLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact — Thrift Hub",
  description:
    "Get in touch with Thrift Hub for wholesale, collabs, or anything else — or message us directly on WhatsApp.",
};

export default function ContactPage() {
  const whatsappHref = buildWhatsAppLink(
    "Hi! I'd like to get in touch with Thrift Hub."
  );

  return (
    <div className="flex min-h-full flex-col bg-paper">
      <Nav />
      <main className="flex-1">
        <section className="bg-paper pt-14 pb-20 sm:pt-20 sm:pb-28">
          <div className="mx-auto max-w-[1800px] px-5 sm:px-8">
            <Reveal className="max-w-xl">
              <p className="clip-ticket inline-block bg-charcoal px-4 py-2 font-tag text-[12px] font-bold uppercase tracking-[0.15em] text-orange-light">
                Get in touch
              </p>
              <h1 className="mt-4 font-display text-4xl leading-[0.95] text-ink sm:text-5xl">
                Wholesale, collab,
                <br />
                or just say hi.
              </h1>
              <p className="mt-4 font-body text-base leading-relaxed text-ink/70">
                For ordering a specific piece, message us on WhatsApp
                straight from the product page — it&apos;s faster. For
                everything else, drop us a line below.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <Reveal>
                <div className="bg-paper-dim p-6 sm:p-8">
                  <ContactForm />
                </div>
              </Reveal>

              <Reveal delay={100}>
                <p className="font-tag text-xs font-bold uppercase tracking-[0.15em] text-ink/50">
                  Reach us directly
                </p>
                <ul className="mt-4 flex flex-col gap-4">
                  <li>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 font-body text-base text-ink/80 transition-colors hover:text-orange-deep"
                    >
                      <WhatsAppIcon className="h-5 w-5 text-teal-deep" />
                      {SITE.whatsappDisplay}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="flex items-center gap-3 font-body text-base text-ink/80 transition-colors hover:text-orange-deep"
                    >
                      <MailIcon className="h-5 w-5 text-teal-deep" />
                      {SITE.email}
                    </a>
                  </li>
                  <li>
                    <a
                      href={SITE.tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 font-body text-base text-ink/80 transition-colors hover:text-orange-deep"
                    >
                      <TikTokIcon className="h-5 w-5 text-teal-deep" />
                      {SITE.tiktokHandle}
                    </a>
                  </li>
                </ul>

                <div className="stitch mt-8 text-ink/15" aria-hidden="true" />

                <p className="mt-6 font-body text-sm leading-relaxed text-ink/60">
                  No cart, no checkout — every order is confirmed by hand
                  over chat. Expect a reply within a day.
                </p>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
