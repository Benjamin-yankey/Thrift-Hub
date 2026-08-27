/**
 * Auth gate for the admin area.
 *
 * NOTE: this project is on Next.js 16, where the `middleware.ts` convention
 * is deprecated in favor of `proxy.ts` (same mechanism, renamed — see
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md).
 * The CMS brief asked for `src/middleware.ts`; this is the current
 * equivalent for this Next.js version.
 *
 * This performs an "optimistic" check (reads the session from cookies, no
 * DB round trip) and redirects unauthenticated visitors away from
 * `/admin/*` to `/admin/login`. It is not the only line of defense — every
 * Server Action / Route Handler under the admin area also calls
 * `getAdminUser()` itself (see src/lib/supabase/auth.ts), per Next.js's
 * guidance that Proxy matchers can silently stop covering a route.
 */
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let the login page itself through — otherwise no one could ever reach
  // it to sign in.
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
