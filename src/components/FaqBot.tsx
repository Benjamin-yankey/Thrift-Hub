"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { SITE, buildWhatsAppLink } from "@/lib/site";
import { ChatIcon, CloseIcon, WhatsAppIcon } from "./icons";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

// Kept to what's actually true of how the site works (see
// thrift-hup-system.md: "no cart or payment processing") rather than
// inventing shipping/payment policy the business hasn't actually set —
// anything outside this list routes to the WhatsApp link below instead of a
// guessed answer.
const FAQ_ITEMS: FaqItem[] = [
  {
    id: "order",
    question: "How do I order something?",
    answer:
      "Pick your size on any product page, then tap \"Order via WhatsApp.\" It opens a chat with your pick and size already filled in — and the photo too, on most phones.",
  },
  {
    id: "sizes",
    question: "What sizes do you carry?",
    answer:
      "Sizes vary by piece — check the sizes listed under \"Choose your size\" on each product page. Since everything's secondhand, stock in any one size is limited.",
  },
  {
    id: "categories",
    question: "What kind of clothing do you sell?",
    answer:
      "Everything from shirts, tees, and jeans to jackets, hoodies, sneakers, boots, and bags — browse by category on the Shop page to see what's in the current drop.",
  },
  {
    id: "stock-status",
    question: "How do I know how much stock is left?",
    answer:
      "Every piece is tagged right on its photo — New, 2 Left, Last One, Sold Out, or Coming Soon — so you always know where things stand before you message us.",
  },
  {
    id: "source",
    question: "Where does the clothing come from?",
    answer:
      "We hand-pick every piece from Kantamanto market in Accra, straight out of sealed bales — see our story on the About page for more.",
  },
  {
    id: "altered",
    question: "Is anything altered or restored?",
    answer:
      "No — every piece reaches you exactly as we found it. No patches, no repairs, no changes. What you see is what you get.",
  },
  {
    id: "drops-frequency",
    question: "How often do new pieces drop?",
    answer: `We restock in small batches rather than all at once — follow us on TikTok (${SITE.tiktokHandle}) or check the Shop page to see what's currently available.`,
  },
  {
    id: "sold-out",
    question: "What if a piece is sold out?",
    answer:
      "Each piece is one of a kind, so we don't restock the exact same item — but tap \"Ask about a restock\" on that piece, or message us, and we'll keep you posted on anything similar.",
  },
  {
    id: "payment",
    question: "How do I pay, and is there delivery?",
    answer:
      "There's no cart or online checkout — once you've picked a piece, payment and delivery/pickup are arranged directly with us over WhatsApp.",
  },
  {
    id: "location",
    question: "Where are you based?",
    answer: "We're based in Ghana — prices are listed in GHS (Ghanaian Cedis).",
  },
  {
    id: "contact",
    question: "How else can I reach you?",
    answer: `WhatsApp is fastest, but you can also email us at ${SITE.email} or find us on TikTok (${SITE.tiktokHandle}) — see the footer or our Contact page for all of it.`,
  },
];

export default function FaqBot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [asked, setAsked] = useState<string[]>([]);

  if (pathname.startsWith("/admin")) return null;

  const whatsappHref = buildWhatsAppLink(
    "Hi! I have a question that's not covered in the FAQ."
  );
  const remainingItems = FAQ_ITEMS.filter((item) => !asked.includes(item.id));

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Help and FAQ"
          className="animate-rise-in fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-orange-light to-orange text-ink shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(0,0,0,0.3)]"
        >
          <ChatIcon className="h-6 w-6" />
        </button>
      ) : (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="faq-bot-title"
          className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-h-[32rem] max-w-sm flex-col overflow-hidden rounded-lg bg-white shadow-xl sm:inset-x-auto sm:right-6 sm:w-96"
        >
          <div className="flex items-center justify-between bg-charcoal px-4 py-3">
            <div>
              <p
                id="faq-bot-title"
                className="font-tag text-xs font-bold uppercase tracking-wide text-orange-light"
              >
                Thrift Hub Help
              </p>
              <p className="font-body text-xs text-cloud/60">
                Canned answers — not a live person
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close help"
              className="flex h-8 w-8 items-center justify-center text-cloud/70 hover:text-cloud"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="rounded-lg bg-paper-dim px-3 py-2.5 font-body text-sm text-ink/80">
              Hi! Pick a question below, or message us on WhatsApp for
              anything else.
            </div>

            {asked.map((id) => {
              const item = FAQ_ITEMS.find((f) => f.id === id);
              if (!item) return null;
              return (
                <div key={id} className="mt-3 flex flex-col gap-2">
                  <div className="ml-auto max-w-[85%] rounded-lg bg-orange-deep px-3 py-2 font-body text-sm text-white">
                    {item.question}
                  </div>
                  <div className="max-w-[85%] rounded-lg bg-paper-dim px-3 py-2.5 font-body text-sm text-ink/80">
                    {item.answer}
                  </div>
                </div>
              );
            })}

            {remainingItems.length > 0 ? (
              <div className="mt-4 flex flex-col gap-2 border-t border-paper-line pt-3">
                {remainingItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setAsked((prev) => [...prev, item.id])
                    }
                    className="rounded-md border border-orange-deep/40 px-3 py-2 text-left font-tag text-[11px] font-bold uppercase tracking-wide text-orange-deep transition-colors hover:bg-orange-deep/10"
                  >
                    {item.question}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-4 border-t border-paper-line pt-3 font-body text-xs text-ink/50">
                That&apos;s everything we&apos;ve got canned — message us on
                WhatsApp for anything else.
              </p>
            )}
          </div>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-light to-orange px-4 py-3 font-tag text-xs font-bold uppercase tracking-wide text-ink"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Message us on WhatsApp
          </a>
        </div>
      )}
    </>
  );
}
