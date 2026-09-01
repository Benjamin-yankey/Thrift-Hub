"use client";

import { useSyncExternalStore } from "react";
import { whatsAppShareMode } from "./shareProduct";

// The capability never changes after the page loads, so there's nothing to
// actually subscribe to — this just exists to satisfy useSyncExternalStore's
// signature.
function subscribe() {
  return () => {};
}

function getSnapshot(): "share" | "clipboard" {
  return whatsAppShareMode();
}

// `navigator` doesn't exist during server rendering — null here (matching
// what the client renders on its first pass, before this hook can read the
// real capability) avoids a hydration mismatch.
function getServerSnapshot(): "share" | "clipboard" | null {
  return null;
}

export function useWhatsAppShareMode(): "share" | "clipboard" | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
