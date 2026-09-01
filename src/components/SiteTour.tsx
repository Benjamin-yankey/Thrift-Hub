"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useWhatsAppShareMode } from "@/lib/useWhatsAppShareMode";

const STORAGE_KEY = "thrift-hub-tour-seen";

type Step = {
  /** Page the step's target lives on; null = shown wherever the tour currently is. */
  path: string | null;
  /** CSS selector to spotlight; null = a plain centered/bottom card, no spotlight. */
  target: string | null;
  title: string;
  body: (shareMode: "share" | "clipboard" | null) => string;
};

const STEPS: Step[] = [
  {
    path: "/",
    target: '[data-tour="hero"]',
    title: "Welcome to Thrift Hub",
    body: () =>
      "One curated drop of reworked secondhand pieces at a time. Here's a quick look at how to shop.",
  },
  {
    path: "/",
    target: '[data-tour="featured-drops"]',
    title: "This week's picks",
    body: () => "The current drop's featured pieces live right here on the homepage.",
  },
  {
    path: "/",
    target: '[data-tour="catalog-shop-link"]',
    title: "See everything",
    body: () => "Tap Shop the drop to browse the full catalog — let's go there now.",
  },
  {
    path: "/shop",
    target: '[data-tour="shop-filters"]',
    title: "Find your size and price",
    body: () =>
      "Search by name, or filter by category, size, and price to narrow things down.",
  },
  {
    path: "/shop",
    target: '[data-tour="shop-grid"]',
    title: "Tap a piece",
    body: () => "Tap any piece to see more photos, pick a size, and read the details.",
  },
  {
    path: null,
    target: null,
    title: "Ready to order",
    body: (shareMode) =>
      shareMode === "share"
        ? "On a piece's page, pick your size and tap \"Order via WhatsApp\" — it opens WhatsApp with the photo and your message ready to send."
        : "On a piece's page, pick your size and tap \"Order via WhatsApp\" — it copies the photo to your clipboard and opens WhatsApp with your message, ready to paste in.",
  },
];

type Rect = { top: number; left: number; width: number; height: number };

function waitForElement(
  selector: string,
  timeoutMs: number
): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLElement>(selector);
    if (existing) {
      resolve(existing);
      return;
    }
    const start = Date.now();
    function poll() {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) {
        resolve(el);
        return;
      }
      if (Date.now() - start > timeoutMs) {
        resolve(null);
        return;
      }
      requestAnimationFrame(poll);
    }
    poll();
  });
}

export default function SiteTour() {
  const pathname = usePathname();
  const router = useRouter();
  const shareMode = useWhatsAppShareMode();

  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);
  const [ready, setReady] = useState(false);
  const targetElRef = useRef<HTMLElement | null>(null);

  const markSeen = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Private browsing / storage disabled — the tour just won't remember
      // it's been seen, which is a harmless degradation.
    }
  }, []);

  // Auto-start once, on a visitor's first-ever homepage load. Deliberately
  // re-checks localStorage on every run rather than gating on a "have I
  // already tried" ref — a ref guard here would get tripped by React's
  // dev-mode double effect invocation (mount, cleanup, mount again), which
  // cancels the first run's timer and then skips scheduling a replacement.
  //
  // Also waits out IntroSplash: it renders on top of everything (higher
  // z-index) for a first-time visitor too, so starting the tour on a fixed
  // timer regardless would mount it invisibly behind the intro video —
  // nothing would ever draw the visitor's eye back to it once the video
  // ends. Polling for IntroSplash's own "Skip intro" button to be gone from
  // the DOM (it unmounts itself once dismissed/finished, or never renders
  // at all under prefers-reduced-motion or a repeat visit this session)
  // keeps the two features honest without one needing to import the other.
  useEffect(() => {
    if (pathname !== "/" || open) return;
    let seen: string | null = null;
    try {
      seen = localStorage.getItem(STORAGE_KEY);
    } catch {
      // Treat as unseen if storage isn't readable.
    }
    if (seen) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    function waitForIntroToClear() {
      if (cancelled) return;
      const introShowing = document.querySelector('[aria-label="Skip intro"]');
      if (introShowing) {
        timer = setTimeout(waitForIntroToClear, 300);
        return;
      }
      timer = setTimeout(() => {
        if (!cancelled) {
          setStepIndex(0);
          setOpen(true);
        }
      }, 400);
    }

    // IntroSplash decides whether to render itself via useSyncExternalStore,
    // which (correctly, to avoid a hydration mismatch) renders nothing on
    // the client's very first pass and only reveals the intro a moment
    // later. Checking immediately risks catching that narrow window and
    // wrongly concluding "no intro to wait for" — so the first check is
    // itself delayed, giving that reveal a chance to happen first.
    timer = setTimeout(waitForIntroToClear, 200);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [pathname, open]);

  // Navigate to the active step's page if needed, then find + measure its
  // target. Re-runs once `pathname` catches up after a router.push.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const step = STEPS[stepIndex];

    (async () => {
      setReady(false);
      setRect(null);
      targetElRef.current = null;

      if (step.path && step.path !== pathname) {
        router.push(step.path);
        return;
      }
      if (!step.target) {
        if (!cancelled) setReady(true);
        return;
      }
      // A target that's going to appear is already in the DOM the instant
      // this runs (Next serves fully-formed HTML; a client-side route
      // transition adds at most a render tick), so this is a short grace
      // window for that, not a real wait — not a multi-second hang for a
      // step whose target doesn't exist right now (e.g. Featured Drops or
      // the shop grid when the catalog's empty).
      const el = await waitForElement(step.target, 600);
      if (cancelled) return;
      if (!el) {
        setReady(true);
        return;
      }
      targetElRef.current = el;
      // Instant, not "smooth" — globals.css sets `scroll-behavior: smooth`
      // site-wide, which this explicit "instant" overrides. A smooth scroll
      // would need an artificial wait afterward for the animation to
      // finish before it's safe to measure the target's position; instant
      // scrolling settles layout within a frame, so a single
      // requestAnimationFrame is enough instead of a fixed guess.
      el.scrollIntoView({ behavior: "instant", block: "center" });
      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (cancelled) return;
      setRect(el.getBoundingClientRect());
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [open, stepIndex, pathname, router]);

  // Keep the spotlight aligned with its target as the page scrolls/resizes.
  useEffect(() => {
    if (!open) return;
    function update() {
      if (targetElRef.current) {
        setRect(targetElRef.current.getBoundingClientRect());
      }
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    setOpen(false);
    markSeen();
  }

  function next() {
    if (stepIndex >= STEPS.length - 1) {
      close();
      return;
    }
    // Reset in the same batch as the step change, not left to the effect
    // that runs after — otherwise React can commit one render with the new
    // step's title alongside the previous step's now-stale spotlight
    // position before the effect gets a chance to clear it.
    setReady(false);
    setRect(null);
    setStepIndex((i) => i + 1);
  }

  function back() {
    setReady(false);
    setRect(null);
    setStepIndex((i) => Math.max(0, i - 1));
  }

  // Storefront only — the admin CMS has its own workflow, not this tour.
  if (pathname.startsWith("/admin") || !open) return null;

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50">
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-ink/60"
        onClick={close}
      />

      {rect ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed rounded-lg transition-all duration-300"
          style={{
            top: rect.top - 8,
            left: rect.left - 8,
            width: rect.width + 16,
            height: rect.height + 16,
            boxShadow:
              "0 0 0 4px rgba(255,255,255,0.9), 0 0 0 6px var(--color-orange-light, #ffb37a), 0 0 24px rgba(0,0,0,0.35)",
            borderRadius: "0.5rem",
          }}
        />
      ) : null}

      {ready ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-title"
          className="fixed inset-x-4 bottom-4 z-10 mx-auto max-w-sm rounded-lg bg-white p-5 shadow-xl sm:inset-x-auto sm:right-6 sm:w-96"
        >
          <p className="font-tag text-[11px] font-bold uppercase tracking-wide text-orange-deep">
            Step {stepIndex + 1} of {STEPS.length}
          </p>
          <h2 id="tour-title" className="mt-1 font-display text-xl text-ink">
            {step.title}
          </h2>
          <p className="mt-2 font-body text-sm text-ink/70">
            {step.body(shareMode)}
          </p>
          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={close}
              className="font-tag text-xs font-bold uppercase tracking-wide text-ink/50 hover:text-ink"
            >
              Skip
            </button>
            <div className="flex items-center gap-2">
              {stepIndex > 0 ? (
                <button
                  type="button"
                  onClick={back}
                  className="rounded-md border border-paper-line px-3 py-1.5 text-sm font-medium text-ink hover:bg-paper-dim"
                >
                  Back
                </button>
              ) : null}
              <button
                type="button"
                onClick={next}
                className="rounded-md bg-orange-deep px-4 py-1.5 text-sm font-semibold text-white hover:opacity-90"
              >
                {isLast ? "Got it" : "Next"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
