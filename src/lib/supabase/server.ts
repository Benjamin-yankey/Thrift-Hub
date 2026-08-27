/**
 * Server-side Supabase client — anon key + the visitor's own session cookies
 * (via `@supabase/ssr`). Use this in Server Components, Route Handlers, and
 * Server Actions for anything that should respect Row Level Security:
 * public product reads, and checking "is someone logged in" for the admin
 * area. It cannot write to `products` (no RLS policy allows it) — writes go
 * through `createAdminClient` in `./admin.ts` instead, after this client has
 * confirmed the caller is authenticated.
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component that can't set cookies (e.g.
            // rendering a page, not handling a request). Harmless as long
            // as proxy.ts is also refreshing the session on navigation.
          }
        },
      },
    }
  );
}
