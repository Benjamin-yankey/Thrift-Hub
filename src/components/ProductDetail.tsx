"use client";

import "@uiw/react-markdown-preview/markdown.css";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
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
  share:
    "Tap to open WhatsApp with this photo and message ready to send.",
  clipboard:
    "We'll copy this photo to your clipboard and open WhatsApp with the message ready — paste the photo in (Ctrl+V / Cmd+V) to send it along.",
};
import WornMannequin, { wornCaptionForCategory } from "./WornMannequin";

// Same standalone Markdown renderer that powers the admin editor's preview
// pane (`@uiw/react-md-editor` depends on `@uiw/react-markdown-preview`
// directly) — reused here instead of adding a new markdown dependency.
// Touches `document` on import, so client-only, same as MDEditor itself.
const Markdown = dynamic(
  () => import("@uiw/react-markdown-preview").then((mod) => mod.default),
  { ssr: false }
);

const STATUS_TONE: Record<Product["status"], string> = {
  new: "bg-teal-deep text-cloud",
  "low-stock": "bg-orange text-ink",
  "last-one": "bg-orange-outline text-ink",
  "sold-out": "bg-ink/70 text-cloud",
  "coming-soon": "bg-gold text-ink",
};

// v1 of the brand spec's "virtual try-on" (section 2.5): a smooth 3D-style
// rotate/zoom on the product image itself, for a premium, dynamic feel
// without any per-user AI processing. Pure CSS transform, no dependency.
// Disabled under prefers-reduced-motion — a pointer-driven tilt is exactly
// the kind of motion that setting exists to opt out of, and the blanket
// transition-duration override in globals.css only kills the animation
// smoothing, not the tilt itself, so this needs its own explicit check.
const TILT_MAX_DEG = 10;
const TILT_SCALE = 1.04;
const TILT_RESET = "rotateX(0deg) rotateY(0deg) scale(1)";

type MediaItem =
  | { type: "image"; src: string }
  | { type: "video"; src: string };

export default function ProductDetail({ product }: { product: Product }) {
  // A product with no real photos yet still gets a synthetic placeholder
  // slide (see toProduct() in lib/products.ts), so grid/card thumbnails
  // elsewhere on the site always have something to show. In this gallery
  // specifically, drop that placeholder once there's a real video to show
  // instead — a video-only product should open straight on its video, not
  // a "photo coming soon" graphic wedged in front of it.
  const photos =
    hasOnlyPlaceholderPhoto(product) && product.videoUrl ? [] : product.images;

  // The video (if any) is appended after the photos as one more gallery
  // slide, rather than living in its own separate player — one active
  // index covers both, so the thumbnail row and the tilt/zoom photo
  // interaction don't need two parallel pieces of state.
  const media: MediaItem[] = [
    ...photos.map((src): MediaItem => ({ type: "image", src })),
    ...(product.videoUrl
      ? [{ type: "video" as const, src: product.videoUrl }]
      : []),
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMedia = media[activeIndex] ?? media[0];
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");
  const tiltRef = useRef<HTMLDivElement>(null);
  const [tiltTransform, setTiltTransform] = useState(TILT_RESET);
  const [captionNote, setCaptionNote] = useState<string | null>(null);
  const shareMode = useWhatsAppShareMode();

  function handleTiltMove(e: React.PointerEvent<HTMLDivElement>) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTiltTransform(
      `rotateX(${(-py * TILT_MAX_DEG).toFixed(2)}deg) rotateY(${(px * TILT_MAX_DEG).toFixed(2)}deg) scale(${TILT_SCALE})`
    );
  }

  const unorderable =
    product.status === "sold-out" || product.status === "coming-soon";

  const whatsappMessage = unorderable
    ? product.status === "sold-out"
      ? `Hi! I'm interested in a restock of the ${product.name}. Can you let me know if it comes back?`
      : `Hi! I'd like to be notified when the ${product.name} drops. Can you keep me posted?`
    : `Hi, I'm interested in ${product.name}, size ${selectedSize}.`;
  const whatsappHref = buildWhatsAppLink(whatsappMessage);

  // Share whichever photo is currently on screen (falls back to the cover
  // photo for the video-slide case) — skipped entirely for a product that
  // only has the synthetic "photo coming soon" placeholder.
  const shareImageUrl = hasOnlyPlaceholderPhoto(product)
    ? null
    : activeMedia.type === "image"
      ? activeMedia.src
      : product.images[0];

  async function handleOrderClick() {
    const result = await shareProductToWhatsApp({
      text: whatsappMessage,
      whatsappHref,
      imageUrl: shareImageUrl,
    });
    if (result.imageCopiedToClipboard) {
      setCaptionNote("Photo copied — paste it into the chat (Ctrl+V / Cmd+V).");
      setTimeout(() => setCaptionNote(null), 6000);
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
      {/* Gallery */}
      <div>
        <div
          className="mx-auto w-full max-w-[640px]"
          style={{ perspective: "1200px" }}
        >
          <div
            ref={tiltRef}
            onPointerMove={handleTiltMove}
            onPointerLeave={() => setTiltTransform(TILT_RESET)}
            className="clip-tag relative aspect-square w-full overflow-hidden bg-cloud transition-transform duration-300 ease-out"
            style={{ transform: tiltTransform, transformStyle: "preserve-3d" }}
          >
          {activeMedia.type === "video" ? (
            <video
              key={activeMedia.src}
              src={activeMedia.src}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={activeMedia.src}
              alt={product.imageAlt}
              fill
              sizes="(min-width: 1024px) 640px, 90vw"
              priority
              className="object-cover"
            />
          )}
          <span className="punch-hole absolute left-[6%] top-1/2 -translate-y-1/2 text-ink/50" />
          <span
            className={`clip-ticket absolute right-4 top-4 px-3.5 py-2 font-tag text-[12px] font-bold uppercase tracking-wide ${STATUS_TONE[product.status]}`}
          >
            {STATUS_LABEL[product.status]}
          </span>
          </div>
        </div>

        {media.length > 1 ? (
          <div className="mt-4 flex flex-wrap gap-3">
            {media.map((item, i) => (
              <button
                key={item.src + i}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={
                  item.type === "video"
                    ? `Play video of ${product.name}`
                    : `Show photo ${i + 1} of ${product.name}`
                }
                aria-current={activeIndex === i}
                className={`relative h-20 w-20 overflow-hidden rounded-sm bg-cloud transition-opacity ${
                  activeIndex === i
                    ? "ring-2 ring-orange-deep ring-offset-2 ring-offset-paper"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                {item.type === "video" ? (
                  <>
                    <video
                      src={item.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-ink/30">
                      <PlayIcon className="h-6 w-6 text-cloud" />
                    </span>
                  </>
                ) : (
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        ) : null}

        <div className="mx-auto mt-6 flex w-full max-w-[640px] items-center gap-4 rounded-md border border-paper-line bg-paper-dim/60 p-4">
          <div
            className="h-28 w-24 shrink-0 overflow-hidden rounded-sm bg-cloud"
            style={{ perspective: "500px" }}
          >
            <WornMannequin category={product.category} />
          </div>
          <div>
            <p className="font-tag text-xs font-bold uppercase tracking-wide text-ink/50">
              See it worn — {wornCaptionForCategory(product.category)}
            </p>
            <p className="mt-1 font-body text-sm text-ink/70">
              An illustrated preview of roughly where this piece sits, not
              a photo of this exact item.
            </p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div>
        <p className="font-tag text-xs font-bold uppercase tracking-[0.15em] text-orange-deep">
          {product.category}
        </p>
        <h1 className="mt-2 font-display text-4xl leading-[0.95] text-ink sm:text-5xl">
          {product.name}
        </h1>
        <p className="mt-4 font-tag text-2xl font-bold text-orange-deep">
          {product.currency} {product.price}
        </p>

        <div className="stitch mt-6 text-ink/15" aria-hidden="true" />

        {product.description ? (
          <div className="mt-6" data-color-mode="light">
            <Markdown
              source={product.description}
              className="!bg-transparent !font-body !text-[15px] !leading-relaxed !text-ink/80"
            />
          </div>
        ) : null}

        {product.material ? (
          <p className="mt-6 font-body text-sm text-ink/70">
            <span className="font-tag text-xs font-bold uppercase tracking-wide text-ink/50">
              Material —{" "}
            </span>
            {product.material}
          </p>
        ) : null}

        <div className="mt-8">
          <p className="font-tag text-xs font-bold uppercase tracking-wide text-ink/50">
            {unorderable ? "Sizes" : "Choose your size"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                disabled={unorderable}
                onClick={() => setSelectedSize(s)}
                aria-pressed={selectedSize === s}
                className={`clip-ticket min-w-[3.25rem] px-4 py-2 font-tag text-sm font-bold uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  !unorderable && selectedSize === s
                    ? "bg-charcoal text-cloud"
                    : "bg-paper-dim text-ink/70"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {product.status === "sold-out" ? (
          <p className="mt-4 font-tag text-xs uppercase tracking-wide text-ink/60">
            Restocks aren&apos;t guaranteed. Ask to be first in line.
          </p>
        ) : null}
        {product.status === "coming-soon" ? (
          <p className="mt-4 font-tag text-xs uppercase tracking-wide text-ink/60">
            Not dropped yet. Ask us to notify you the moment it lands.
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleOrderClick}
          className="clip-ticket mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-orange-light to-orange px-7 py-3.5 font-tag text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:-translate-y-0.5"
        >
          <WhatsAppIcon className="h-4 w-4" />
          {product.status === "sold-out"
            ? "Ask about a restock"
            : product.status === "coming-soon"
              ? "Ask to be notified"
              : "Order via WhatsApp"}
        </button>
        {captionNote ? (
          <p role="status" className="mt-2 font-body text-xs text-ink/60">
            {captionNote}
          </p>
        ) : shareMode && shareImageUrl ? (
          <p className="mt-2 font-body text-xs text-ink/50">
            {SHARE_MODE_HINT[shareMode]}
          </p>
        ) : null}
      </div>
    </div>
  );
}
