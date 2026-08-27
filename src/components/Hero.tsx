"use client";

import { useSyncExternalStore } from "react";
import { buildWhatsAppLink } from "@/lib/site";
import { WhatsAppIcon, ArrowIcon } from "./icons";

// useSyncExternalStore just for a mismatch-free read of a browser-only API
// (matchMedia doesn't exist during SSR).
function subscribe() {
  return () => {};
}
function getSnapshot() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function getServerSnapshot() {
  return false;
}

export default function Hero() {
  const allowMotion = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const whatsappHref = buildWhatsAppLink(
    "Hi! I'd like to know more about the current Thrift Hub drop."
  );

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-charcoal py-20 sm:min-h-[680px] lg:min-h-[760px]"
    >
      {allowMotion ? (
        <video
          src="/brand/intro.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      ) : null}
      {/* scrim: keeps headline copy readable over the looping video regardless
          of how bright a given frame is */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/45" />

      <div className="relative z-10 mx-auto w-full max-w-[1800px] px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="animate-rise-in clip-ticket inline-block bg-orange px-4 py-2 font-tag text-[12px] font-bold uppercase tracking-[0.15em] text-ink">
            Accra-sourced, one rack at a time
          </p>

          <h1
            className="animate-rise-in mt-4 font-display text-[clamp(2.75rem,11vw,4rem)] leading-[0.92] tracking-tight text-cloud sm:text-6xl lg:text-[5.2rem]"
            style={{ animationDelay: "80ms" }}
          >
            Secondhand.
            <br />
            <span className="text-orange-light">First pick.</span>
          </h1>

          <p
            className="animate-rise-in mt-6 max-w-md font-body text-base leading-relaxed text-cloud/80 sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            We rework what Kantamanto has already worn in. Every drop is
            small, every piece is one of one, and once it&apos;s gone,
            it&apos;s actually gone.
          </p>

          <div
            className="animate-rise-in mt-9 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "240ms" }}
          >
            <a
              href="#drops"
              className="clip-ticket inline-flex items-center gap-2 bg-cloud px-7 py-3.5 font-tag text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:-translate-y-0.5"
            >
              Shop the drop
              <ArrowIcon className="h-4 w-4" />
            </a>
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
        </div>
      </div>
    </section>
  );
}
