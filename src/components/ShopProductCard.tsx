"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
    "Copies this photo + opens WhatsApp with your message — paste the photo in to send it.",
};

// Same tone map as ProductCard — kept in sync deliberately rather than
// imported, since ProductCard doesn't export it.
const STATUS_TONE: Record<Product["status"], string> = {
  new: "bg-teal-deep text-cloud",
  "low-stock": "bg-orange text-ink",
  "last-one": "bg-orange-outline text-ink",
  "sold-out": "bg-ink/70 text-cloud",
  "coming-soon": "bg-gold text-ink",
};

/**
 * Catalog-grid variant of ProductCard: the whole card is a link to the
 * product's detail page (`/shop/[slug]`) instead of a card that immediately
 * opens WhatsApp. The WhatsApp quick-order action still exists, but sits
 * outside the card's own `<Link>` so it isn't a nested anchor.
 */
export default function ShopProductCard({ product }: { product: Product }) {
  const soldOut = product.status === "sold-out";
  const whatsappMessage = `Hi! I'm interested in the ${product.name} (size ${product.sizes[0]}). Is it still available?`;
  const whatsappHref = buildWhatsAppLink(whatsappMessage);
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
          "Photo copied — paste it into the chat (Ctrl+V / Cmd+V)."
        );
        setTimeout(() => setCaptionNote(null), 6000);
      }
    } finally {
      setSending(false);
    }
  }
  // A video-only product (no real photos) plays its clip right in the
  // grid instead of a "photo coming soon" graphic — with real photos,
  // the card still shows the cover photo and the play badge below just
  // signals a video is available on the product page.
  const showVideoInCard = Boolean(
    product.videoUrl && hasOnlyPlaceholderPhoto(product)
  );

  return (
    <article
      className="group flex h-full flex-col bg-paper-dim transition-transform duration-300 hover:-translate-y-1"
      style={{ transform: `rotate(${product.rotate}deg)` }}
    >
      <Link href={`/shop/${product.id}`} className="flex flex-1 flex-col">
        <div
          className="clip-tag relative mx-auto aspect-[4/5] w-full max-w-[420px] overflow-hidden bg-cloud transition-transform duration-300 group-hover:rotate-0"
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
              sizes="(min-width: 1024px) 360px, 90vw"
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
          <p className="font-tag text-[11px] uppercase tracking-wide text-ink/50">
            {product.category}
          </p>
          <h3 className="font-display text-xl leading-tight text-ink">
            {product.name}
          </h3>

          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <span className="font-tag text-lg font-bold text-orange-deep">
              {product.currency} {product.price}
            </span>
            <span className="font-tag text-xs uppercase tracking-wide text-ink/65">
              Sizes {product.sizes.join(" / ")}
            </span>
          </div>

          <div className="stitch mt-2 text-ink/15" aria-hidden="true" />

          <span className="mt-auto inline-flex items-center gap-1 pt-2 font-tag text-[13px] font-bold uppercase tracking-wide text-ink/70 transition-colors group-hover:text-orange-deep">
            View piece &rarr;
          </span>
        </div>
      </Link>

      <div className="px-5 pb-5">
        <button
          type="button"
          onClick={handleOrderClick}
          disabled={sending}
          className="inline-flex items-center gap-2 font-tag text-[13px] font-bold uppercase tracking-wide text-teal-deep transition-colors hover:text-orange-deep disabled:opacity-60"
        >
          <WhatsAppIcon className="h-4 w-4 text-teal-deep" />
          {sending
            ? "Opening…"
            : soldOut
              ? "Ask about a restock"
              : "Ask on WhatsApp"}
        </button>
        {captionNote ? (
          <p role="status" className="mt-1 font-body text-xs text-ink/50">
            {captionNote}
          </p>
        ) : shareMode && hasRealPhoto ? (
          <p className="mt-1 font-body text-xs text-ink/40">
            {SHARE_MODE_HINT[shareMode]}
          </p>
        ) : null}
      </div>
    </article>
  );
}
