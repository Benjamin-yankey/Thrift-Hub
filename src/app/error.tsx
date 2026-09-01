"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-5 text-center">
      <p className="font-tag text-xs font-bold uppercase tracking-[0.15em] text-orange-deep">
        Something went wrong
      </p>
      <h1 className="font-display text-3xl text-ink">
        That didn&apos;t go through.
      </h1>
      <p className="max-w-sm font-body text-sm text-ink/70">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-2 rounded-md bg-charcoal px-5 py-2.5 font-tag text-sm font-bold uppercase tracking-wide text-cloud transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
