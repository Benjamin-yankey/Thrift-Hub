"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const SEEN_KEY = "thrift-hub-intro-seen";

// No external event ever changes whether the intro should play once the
// page has mounted, so subscribe is a no-op — useSyncExternalStore still
// gives us the right thing here: a browser-only read (matchMedia,
// sessionStorage) that returns a fixed, mismatch-free value during SSR
// instead of computing it in an effect and setState-ing the result in.
function subscribe() {
  return () => {};
}

function getSnapshot() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const alreadySeen = sessionStorage.getItem(SEEN_KEY) != null;
  return !reduceMotion && !alreadySeen;
}

function getServerSnapshot() {
  return false;
}

/**
 * Plays the brand's animated logo reveal once per browser session when
 * someone lands on the homepage — a "welcome" moment rather than a
 * background loop, since the clip is a 6-second logo sting, not lifestyle
 * footage. Skips entirely under prefers-reduced-motion or on repeat visits
 * within the same session (sessionStorage, not localStorage — it should
 * play again on a fresh visit later, not be gone forever after once).
 */
export default function IntroSplash() {
  const shouldPlay = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [dismissed, setDismissed] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (shouldPlay) sessionStorage.setItem(SEEN_KEY, "1");
  }, [shouldPlay]);

  function dismiss() {
    setFading(true);
    window.setTimeout(() => setDismissed(true), 300);
  }

  if (!shouldPlay || dismissed) return null;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Skip intro"
      onClick={dismiss}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") dismiss();
      }}
      className={`fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-paper transition-opacity duration-300 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        src="/brand/intro.mp4"
        autoPlay
        muted
        playsInline
        onEnded={dismiss}
        className="h-full w-full object-cover"
      />
      <span className="absolute bottom-10 font-tag text-xs uppercase tracking-wide text-ink/40">
        Tap to skip
      </span>
    </div>
  );
}
