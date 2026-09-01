"use client";

import { useState } from "react";
import Image from "next/image";
import {
  buildWhatsAppLink,
  hasOnlyPlaceholderPhoto,
  STATUS_LABEL,
  type Product,
} from "@/lib/site";
import { shareProductToWhatsApp } from "@/lib/shareProduct";
import { useWhatsAppShareMode } from "@/lib/useWhatsAppShareMode";
import { PlayIcon, WhatsAppIcon } from "./icons";

const SHARE_MODE_HINT: Record<"share" | "clipboard", string> = {
  share: "Opens WhatsApp with this photo and message ready to send.",
  clipboard:
    "Copies this photo + opens WhatsApp with your message paste the photo in to send it.",
};

// Text color per chip is picked for AA contrast against that fill, not
// for uniformity — orange/orange-outline read too light for white text at
// this size (~2.7-2.9:1), so they pair with ink instead. "new" uses the
// darker teal-deep with white text rather than teal+ink: teal+ink only
// clears AA by a hair (~4.5:1) and reads muddy at badge size: teal-deep+
// white is both higher-contrast (~4.8:1) and a clearer "light text on a
// solid chip" read.
const STATUS_TONE: Record<Product["status"], string> = {
  new: "bg-teal-deep text-cloud",
  "low-stock": "bg-orange text-ink",
  "last-one": "bg-orange-outline text-ink",
  "sold-out": "bg-ink/70 text-cloud",
  "coming-soon": "bg-gold text-ink",
};

export default function ProductCard({
  product,
  featured = false,
}: {
  product: Product;
  featured?: boolean;
}) {
  const soldOut = product.status === "sold-out";
  const whatsappMessage = `Hi! I'm interested in the ${product.name} (size ${product.sizes[0]}). Is it still available?`;
  const whatsappHref = buildWhatsAppLink(whatsappMessage);
  const showVideoInCard = Boolean(
    product.videoUrl && hasOnlyPlaceholderPhoto(product),
  );
  const [captionNote, setCaptionNote] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const shareMode = useWhatsAppShareMode();
  const hasRealPhoto = !hasOnlyPlaceholderPhoto(product);

  async function handleOrderClick() {
    setSending(true);
    try {
      const result = await shareProductToWhatsApp({
        text: whatsappMessage,
        whatsappHref,
        imageUrl: hasOnlyPlaceholderPhoto(product) ? null : product.images[0],
      });
      if (result.imageCopiedToClipboard) {
        setCaptionNote(
          "Photo copied — paste it into the chat (Ctrl+V / Cmd+V).",
        );
        setTimeout(() => setCaptionNote(null), 6000);
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <article
      className="group flex h-full flex-col bg-paper-dim transition-transform duration-300 hover:-translate-y-1"
      style={{ transform: `rotate(${product.rotate}deg)` }}
    >
      <div
        className={`clip-tag relative mx-auto aspect-[4/5] w-full overflow-hidden bg-cloud transition-transform duration-300 group-hover:rotate-0 ${
          featured ? "max-w-[640px]" : "max-w-[420px]"
        }`}
        style={{ transform: `rotate(${-product.rotate * 0.4}deg)` }}
      >
        {showVideoInCard ? (
          <video
            src={product.videoUrl ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={product.images[0]}
            alt={product.imageAlt}
            fill
            sizes={
              featured
                ? "(min-width: 1024px) 640px, 90vw"
                : "(min-width: 1024px) 360px, 90vw"
            }
            className="object-cover"
          />
        )}
        <span className="punch-hole absolute left-[9%] top-1/2 -translate-y-1/2 text-ink/50" />
        <span
          className={`clip-ticket absolute right-3 top-3 px-3 py-1.5 font-tag text-[11px] font-bold uppercase tracking-wide ${STATUS_TONE[product.status]}`}
        >
          {STATUS_LABEL[product.status]}
        </span>
        {product.videoUrl && !showVideoInCard ? (
          <span
            className="absolute bottom-3 left-3 flex h-7 w-7 items-center justify-center rounded-full bg-ink/60 text-cloud"
            aria-hidden="true"
          >
            <PlayIcon className="h-3.5 w-3.5" />
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <h3
          className={`font-display leading-tight text-ink ${
            featured ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          {product.name}
        </h3>
        <p className="font-body text-sm leading-relaxed text-ink/70">
          {product.description}
        </p>

        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <span className="font-tag text-lg font-bold text-orange-deep">
            {product.currency} {product.price}
          </span>
          <span className="font-tag text-xs uppercase tracking-wide text-ink/65">
            Sizes {product.sizes.join(" / ")}
          </span>
        </div>

        <div className="stitch mt-2 text-ink/15" aria-hidden="true" />

        {soldOut ? (
          <p className="mt-2 font-tag text-xs uppercase tracking-wide text-ink/70">
            Restocks aren&apos;t guaranteed. Ask to be first in line.
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleOrderClick}
          disabled={sending}
          className="mt-auto inline-flex items-center gap-2 pt-2 font-tag text-[13px] font-bold uppercase tracking-wide text-teal-deep transition-colors hover:text-orange-deep disabled:opacity-60"
        >
          <WhatsAppIcon className="h-4 w-4 text-teal-deep" />
          {sending
            ? "Opening…"
            : soldOut
              ? "Ask about a restock"
              : "Ask on WhatsApp"}
        </button>
        {captionNote ? (
          <p role="status" className="font-body text-xs text-ink/50">
            {captionNote}
          </p>
        ) : shareMode && hasRealPhoto ? (
          <p className="font-body text-xs text-ink/40">
            {SHARE_MODE_HINT[shareMode]}
          </p>
        ) : null}
      </div>
    </article>
  );
}
