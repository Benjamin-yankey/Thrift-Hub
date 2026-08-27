"use client";

/**
 * Browser Supabase client — anon key only. Used from Client Components,
 * currently just the admin login form (`supabase.auth.signInWithPassword`).
 * `@supabase/ssr`'s browser client persists the session in cookies (not
 * just localStorage), which is what lets the server client / proxy read it.
 */
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
