"use server";

/**
 * All product mutations for the admin CMS. These run server-side with the
 * service-role client (RLS blocks anon/authenticated writes on `products`
 * entirely — see supabase/schema.sql), and each one re-checks the caller's
 * session itself rather than relying solely on proxy.ts.
 */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/supabase/auth";
import {
  PRODUCT_IMAGES_BUCKET,
  storagePathFromPublicUrl,
} from "@/lib/supabase/storage";
import type { ProductStatus } from "@/lib/site";

const STATUSES: ProductStatus[] = [
  "new",
  "low-stock",
  "last-one",
  "sold-out",
  "coming-soon",
];

export type ProductFormState = {
  status: "idle" | "error";
  message: string;
};

async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) {
    redirect("/admin/login");
  }
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

type AdminClient = ReturnType<typeof createAdminClient>;

async function deleteStorageObjects(supabase: AdminClient, urls: string[]) {
  const paths = urls
    .map(storagePathFromPublicUrl)
    .filter((p): p is string => Boolean(p));
  if (paths.length === 0) return;
  await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove(paths);
}

function parseProductForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugify(slugInput || name);
  const category =
    String(formData.get("category") ?? "").trim() || "uncategorized";
  const price = Number(formData.get("price"));
  const currency = String(formData.get("currency") ?? "GHS").trim() || "GHS";
  const sizes = String(formData.get("sizes") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const description = String(formData.get("description") ?? "");
  const material = String(formData.get("material") ?? "").trim();
  const images = formData.getAll("images").map(String).filter(Boolean);
  const imageAlt = String(formData.get("image_alt") ?? "").trim();
  const videoUrl = String(formData.get("video_url") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "new");
  const status = (
    STATUSES.includes(statusRaw as ProductStatus) ? statusRaw : "new"
  ) as ProductStatus;
  const featured = formData.get("featured") === "on";
  const sortOrderRaw = formData.get("sort_order");
  const sortOrder =
    sortOrderRaw !== null && String(sortOrderRaw).trim() !== ""
      ? Number(sortOrderRaw)
      : null;

  if (!name) throw new Error("Name is required.");
  if (!slug) throw new Error("Could not derive a slug from that name.");
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Price must be a non-negative number.");
  }

  return {
    name,
    slug,
    category,
    price,
    currency,
    sizes,
    description,
    material,
    images,
    imageAlt,
    videoUrl,
    status,
    featured,
    sortOrder,
  };
}

export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  let data;
  try {
    data = parseProductForm(formData);
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Invalid form data.",
    };
  }

  const supabase = createAdminClient();

  let sortOrder = data.sortOrder;
  if (sortOrder === null) {
    const { data: maxRow } = await supabase
      .from("products")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    sortOrder = (maxRow?.sort_order ?? 0) + 1;
  }

  const { error } = await supabase.from("products").insert({
    slug: data.slug,
    name: data.name,
    category: data.category,
    price: data.price,
    currency: data.currency,
    sizes: data.sizes,
    description: data.description,
    material: data.material,
    images: data.images,
    image_alt: data.imageAlt,
    video_url: data.videoUrl,
    status: data.status,
    featured: data.featured,
    sort_order: sortOrder,
  });

  if (error) {
    return {
      status: "error",
      message: error.code === "23505"
        ? "That slug is already in use by another product."
        : error.message,
    };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/shop");
  redirect("/admin");
}

export async function updateProduct(
  id: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  await requireAdmin();

  let data;
  try {
    data = parseProductForm(formData);
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Invalid form data.",
    };
  }

  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("products")
    .select("slug, images, video_url")
    .eq("id", id)
    .single();

  const removedImages: string[] = (existing?.images ?? []).filter(
    (url: string) => !data.images.includes(url)
  );
  const removedVideo: string[] =
    existing?.video_url && existing.video_url !== data.videoUrl
      ? [existing.video_url]
      : [];
  await deleteStorageObjects(supabase, [...removedImages, ...removedVideo]);

  const { error } = await supabase
    .from("products")
    .update({
      slug: data.slug,
      name: data.name,
      category: data.category,
      price: data.price,
      currency: data.currency,
      sizes: data.sizes,
      description: data.description,
      material: data.material,
      images: data.images,
      image_alt: data.imageAlt,
      video_url: data.videoUrl,
      status: data.status,
      featured: data.featured,
      ...(data.sortOrder !== null ? { sort_order: data.sortOrder } : {}),
    })
    .eq("id", id);

  if (error) {
    return {
      status: "error",
      message: error.code === "23505"
        ? "That slug is already in use by another product."
        : error.message,
    };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${data.slug}`);
  if (existing?.slug && existing.slug !== data.slug) {
    revalidatePath(`/shop/${existing.slug}`);
  }
  redirect("/admin");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: existing } = await supabase
    .from("products")
    .select("slug, images, video_url")
    .eq("id", id)
    .single();

  await deleteStorageObjects(supabase, [
    ...(existing?.images ?? []),
    ...(existing?.video_url ? [existing.video_url] : []),
  ]);

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/shop");
  if (existing?.slug) {
    revalidatePath(`/shop/${existing.slug}`);
  }
}

export async function moveProduct(id: string, direction: "up" | "down") {
  await requireAdmin();
  const supabase = createAdminClient();

  const { data: rows, error } = await supabase
    .from("products")
    .select("id, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !rows) throw new Error(error?.message ?? "Failed to load products.");

  const index = rows.findIndex((r) => r.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= rows.length) return;

  const a = rows[index];
  const b = rows[swapWith];

  await Promise.all([
    supabase.from("products").update({ sort_order: b.sort_order }).eq("id", a.id),
    supabase.from("products").update({ sort_order: a.sort_order }).eq("id", b.id),
  ]);

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function setFeatured(id: string, featured: boolean) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("products")
    .update({ featured })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
