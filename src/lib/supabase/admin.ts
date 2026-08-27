/**
 * Service-role Supabase client — bypasses Row Level Security entirely.
 *
 * `products` has a SELECT-only RLS policy for anon/authenticated (see
 * supabase/schema.sql), so every write (create/update/delete product,
 * upload/delete storage objects) has to go through this client instead.
 *
 * SAFETY: only import this from server-only code (Server Actions, Route
 * Handlers, Server Components) that has already verified the caller has a
 * valid admin session via `@/lib/supabase/server`. Never import it from a
 * "use client" file, and never let SUPABASE_SERVICE_ROLE_KEY be read by
 * anything prefixed NEXT_PUBLIC_.
 */
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error(
      "createAdminClient() must never be called from the browser."
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
