/**
 * Cookie-free anon-key Supabase client for public, read-only queries.
 *
 * `products` has an unconditional public SELECT policy (`using (true)` for
 * `anon, authenticated` — see supabase/schema.sql), so reading it never
 * actually depends on who's visiting or their session. `@/lib/supabase/server`
 * plumbs the visitor's cookies through anyway (needed for the admin auth
 * check elsewhere), but doing that for a plain product listing has a real
 * cost: reading cookies is one of Next's "Dynamic APIs", so any page that
 * uses it is forced into fully dynamic rendering — no static/ISR caching at
 * all, meaning every single visitor pays a live round trip to Supabase.
 * This client avoids that entirely for the pages that don't need it (the
 * homepage, the shop grid, product pages), so they can be cached and
 * refreshed on demand via `revalidatePath()` (already called from every
 * product mutation in `@/app/admin/actions`) instead of on every request.
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createSupabaseClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
