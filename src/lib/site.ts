/**
 * Shared brand + contact constants.
 *
 * Email and Instagram are still placeholders (see thrift-hup-system.md,
 * section 6) — swap them for the real values when available. WhatsApp is
 * the real number. Every component below reads from here rather than
 * hardcoding a number, so updating any of these is a one-line change.
 */

export const SITE = {
  name: "Thrift Hub",
  whatsappNumber: "233240061132", // real Ghana number, wa.me format (no +, no spaces)
  whatsappDisplay: "+233 24 006 1132",
  email: "hello@thrifthub.com",
  instagramHandle: "@thrifthub",
  instagramUrl: "https://instagram.com/thrifthub",
};

/**
 * Builds a wa.me deep link with an optional pre-filled message, per the
 * "Order via WhatsApp" flow described in the brand spec (section 2.2).
 */
export function buildWhatsAppLink(message?: string) {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export type ProductStatus =
  | "new"
  | "low-stock"
  | "last-one"
  | "sold-out"
  | "coming-soon";

/**
 * Shape the homepage components render. Product data itself now lives in
 * Supabase (see `supabase/schema.sql`) and is fetched server-side by
 * `src/lib/products.ts` — this file keeps only the presentational contract
 * plus brand constants that don't belong in the database.
 *
 * `images` replaces the old single `image` string (the DB column is
 * `images text[]`); the first entry is always the primary/cover image.
 *
 * `id` doubles as the product's `slug` (see `toProduct()` in
 * `src/lib/products.ts`), so it's also what `/shop/[slug]` routes on.
 */
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: "GHS";
  description: string;
  sizes: string[];
  status: ProductStatus;
  images: string[];
  imageAlt: string;
  material: string;
  /** Optional short product clip, uploaded from the admin CMS alongside photos. */
  videoUrl: string | null;
  rotate: number;
}

/**
 * A product with no real photos yet still carries a synthetic "photo
 * coming soon" image (see toProduct() in lib/products.ts), so grid/card
 * layouts always have something to render. Anywhere that can show a video
 * instead uses this to tell "no real photos" apart from "chose not to
 * show one right now".
 */
export const PLACEHOLDER_IMAGE = "/products/placeholder.svg";

export function hasOnlyPlaceholderPhoto(
  product: Pick<Product, "images">
): boolean {
  return (
    product.images.length === 1 && product.images[0] === PLACEHOLDER_IMAGE
  );
}

export const STATUS_LABEL: Record<ProductStatus, string> = {
  new: "New",
  "low-stock": "2 Left",
  "last-one": "Last One",
  "sold-out": "Sold Out",
  "coming-soon": "Coming Soon",
};

/**
 * The full category taxonomy a product can be tagged with — specific
 * garment types rather than the old four broad buckets (tops/bottoms/
 * outerwear/footwear), so the shop's category filter can distinguish a
 * shirt from a pair of cargo pants. Shared by the admin CMS (the `<select>`
 * in ProductForm) and the shop page's category filter (which uses
 * `CATEGORY_LABEL` to display whatever distinct category values are
 * actually in use nicely, since that list is derived from live product
 * data, not from this fixed set).
 */
export const CATEGORIES = [
  { value: "shirts", label: "Shirts" },
  { value: "t-shirts", label: "T-Shirts" },
  { value: "trousers", label: "Trousers" },
  { value: "jeans", label: "Jeans" },
  { value: "cargo-pants", label: "Cargo Pants" },
  { value: "shorts", label: "Shorts" },
  { value: "skirts", label: "Skirts" },
  { value: "dresses", label: "Dresses" },
  { value: "jackets", label: "Jackets" },
  { value: "outerwear", label: "Outerwear" },
  { value: "hoodies-sweatshirts", label: "Hoodies & Sweatshirts" },
  { value: "sneakers", label: "Sneakers" },
  { value: "boots", label: "Boots" },
  { value: "footwear", label: "Footwear (Other)" },
  { value: "accessories", label: "Accessories" },
  { value: "bags", label: "Bags" },
];

export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label])
);
