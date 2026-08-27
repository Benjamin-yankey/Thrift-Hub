import type { NextConfig } from "next";

// Product photos uploaded through /admin live in Supabase Storage's public
// `product-images` bucket and are served from the project's own subdomain —
// next/image needs that host allow-listed to optimize them.
const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  // Hides the floating dev-mode route/bundler indicator badge.
  devIndicators: false,
  images: {
    // All SVGs served here are locally generated brand/product illustrations
    // (public/brand, public/products, public/hero) — none are user-uploaded,
    // so it's safe to let next/image optimize them. The CSP below still
    // sandboxes them as a defense-in-depth measure per Next.js guidance.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
