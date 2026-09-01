/**
 * Public, read-only product data access for the marketing site.
 *
 * This is the "thin server-side data-fetching layer" called from
 * FeaturedDrops (a Server Component) instead of importing the old static
 * `PRODUCTS` array. It reads through the cookie-free anon-key client (see
 * `@/lib/supabase/public`), which is exactly what the `products` table's
 * RLS policy allows (public SELECT) — no service-role key involved for
 * public reads, and no dependency on the visitor's session either, so these
 * pages can actually be cached instead of hitting Supabase on every request.
 */
import { createPublicClient } from "@/lib/supabase/public";
import { PLACEHOLDER_IMAGE, type Product, type ProductStatus } from "@/lib/site";

/** Row shape as it comes back from `products` (see supabase/schema.sql). */
export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  sizes: string[];
  description: string;
  images: string[];
  image_alt: string;
  material: string;
  video_url: string;
  status: ProductStatus;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const PRODUCT_COLUMNS =
  "id, slug, name, category, price, currency, sizes, description, images, image_alt, material, video_url, status, featured, sort_order, created_at, updated_at";

/**
 * The static mock data used a hand-picked `rotate` degree per card for the
 * "tossed on a table" look. That's not something an admin should have to
 * think about when adding a product, so we derive a small, stable tilt from
 * the product's id instead — same product always renders at the same angle
 * (no hydration mismatch, no randomness on every request).
 */
function rotationFor(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  // Spread across roughly -2.5deg..2.5deg, matching the original hand-tuned range.
  const magnitude = (Math.abs(hash) % 26) / 10; // 0..2.5
  const sign = hash % 2 === 0 ? 1 : -1;
  return Number((magnitude * sign).toFixed(2));
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.slug,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    currency: "GHS",
    description: row.description,
    sizes: row.sizes,
    status: row.status,
    images: row.images.length > 0 ? row.images : [PLACEHOLDER_IMAGE],
    imageAlt: row.image_alt || row.name,
    material: row.material,
    videoUrl: row.video_url || null,
    rotate: rotationFor(row.id),
  };
}

/**
 * Products for the homepage's Featured Drops section: `featured = true`,
 * ordered the way the admin arranged them. Cached like the rest of the
 * storefront — an admin publish still shows up on the next load without a
 * redeploy, via the `revalidatePath()` calls in `@/app/admin/actions`.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("featured", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load featured products:", error.message);
    return [];
  }

  return (data as ProductRow[]).map(toProduct);
}

/**
 * Every product in the catalog, for the `/shop` page — unlike
 * `getFeaturedProducts()` this is not filtered to `featured = true`. Ordered
 * the same way the admin arranged the homepage picks; the shop page's own
 * filter/sort controls then re-order client-side on top of this.
 */
export async function getAllProducts(): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load products:", error.message);
    return [];
  }

  return (data as ProductRow[]).map(toProduct);
}

/**
 * A single product by its `slug`, for `/shop/[slug]`. Returns `null` for an
 * unknown slug so the page can call `notFound()`.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Failed to load product:", error.message);
    return null;
  }
  if (!data) return null;

  return toProduct(data as ProductRow);
}
