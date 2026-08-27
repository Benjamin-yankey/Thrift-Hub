export const PRODUCT_IMAGES_BUCKET = "product-images";

/**
 * The bucket is public, so every uploaded file's URL (image or video) looks
 * like `${SUPABASE_URL}/storage/v1/object/public/product-images/<path>`.
 * Rather than tracking storage paths separately from the `images`/
 * `video_url` URLs we save on the product, we recover the path straight
 * from the URL when we need to delete the underlying file (on removal or
 * product deletion).
 */
export function storagePathFromPublicUrl(url: string): string | null {
  const marker = `/object/public/${PRODUCT_IMAGES_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  try {
    return decodeURIComponent(url.slice(idx + marker.length));
  } catch {
    return url.slice(idx + marker.length);
  }
}
