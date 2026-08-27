import { createClient } from "@/lib/supabase/server";

/**
 * Returns the signed-in admin user, or `null`. Used both by pages (which
 * redirect to /admin/login when this is null) and by every Server Action /
 * Route Handler that mutates products, since proxy.ts alone isn't a
 * guaranteed line of defense for Server Functions (see the Next.js auth
 * guide's note on matcher changes silently losing coverage).
 */
export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
