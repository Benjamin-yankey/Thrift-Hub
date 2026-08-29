import Image from "next/image";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { STATUS_LABEL, type ProductStatus } from "@/lib/site";
import type { ProductRow } from "@/lib/products";
import {
  deleteProduct,
  moveProduct,
  setFeatured,
} from "@/app/admin/actions";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

async function getAllProducts(): Promise<ProductRow[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, category, price, currency, sizes, description, images, image_alt, material, status, featured, sort_order, created_at, updated_at"
    )
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return data as ProductRow[];
}

const STATUS_BADGE: Record<ProductStatus, string> = {
  new: "bg-teal/20 text-teal-deep",
  "low-stock": "bg-orange/20 text-orange-deep",
  "last-one": "bg-orange-outline/20 text-orange-deep",
  "sold-out": "bg-ink/10 text-ink/70",
  "coming-soon": "bg-gold/20 text-ink",
};

export default async function AdminProductsPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-md bg-orange-deep px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-8 text-sm text-ink/60">
          No products yet. Add your first one.
        </p>
      ) : (
        <>
        {/* Mobile: one card per product, everything stacked — no sideways scrolling. */}
        <div className="mt-6 flex flex-col gap-3 sm:hidden">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="rounded-lg border border-paper-line bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 flex-none overflow-hidden rounded bg-cloud">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">
                    {product.name}
                  </p>
                  <p className="truncate text-xs text-ink/40">
                    {product.slug}
                  </p>
                  <p className="mt-0.5 text-xs text-ink/60">
                    {product.category} · {product.currency} {product.price}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[product.status]}`}
                >
                  {STATUS_LABEL[product.status]}
                </span>
                <form
                  action={setFeatured.bind(
                    null,
                    product.id,
                    !product.featured
                  )}
                >
                  <button
                    type="submit"
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      product.featured
                        ? "bg-teal text-ink"
                        : "bg-paper-dim text-ink/50"
                    }`}
                  >
                    {product.featured ? "Featured" : "Not featured"}
                  </button>
                </form>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-paper-line pt-3">
                <div className="flex items-center gap-1">
                  <form action={moveProduct.bind(null, product.id, "up")}>
                    <button
                      type="submit"
                      disabled={index === 0}
                      aria-label="Move up"
                      className="rounded border border-paper-line px-1.5 py-0.5 text-ink/70 hover:bg-paper disabled:opacity-30"
                    >
                      ↑
                    </button>
                  </form>
                  <form action={moveProduct.bind(null, product.id, "down")}>
                    <button
                      type="submit"
                      disabled={index === products.length - 1}
                      aria-label="Move down"
                      className="rounded border border-paper-line px-1.5 py-0.5 text-ink/70 hover:bg-paper disabled:opacity-30"
                    >
                      ↓
                    </button>
                  </form>
                  <span className="ml-1 text-xs text-ink/40">
                    {product.sort_order}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-sm text-orange-deep hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteProductButton
                    id={product.id}
                    name={product.name}
                    action={deleteProduct}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop/tablet: the full table. */}
        <div className="mt-6 hidden overflow-x-auto rounded-lg border border-paper-line bg-white sm:block">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-paper-line text-xs uppercase tracking-wide text-ink/50">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className="border-b border-paper-line last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <form action={moveProduct.bind(null, product.id, "up")}>
                        <button
                          type="submit"
                          disabled={index === 0}
                          aria-label="Move up"
                          className="rounded border border-paper-line px-1.5 py-0.5 text-ink/70 hover:bg-paper disabled:opacity-30"
                        >
                          ↑
                        </button>
                      </form>
                      <form
                        action={moveProduct.bind(null, product.id, "down")}
                      >
                        <button
                          type="submit"
                          disabled={index === products.length - 1}
                          aria-label="Move down"
                          className="rounded border border-paper-line px-1.5 py-0.5 text-ink/70 hover:bg-paper disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </form>
                      <span className="ml-1 text-xs text-ink/40">
                        {product.sort_order}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded bg-cloud">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt=""
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">
                    {product.name}
                    <div className="text-xs text-ink/40">{product.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-ink/70">
                    {product.category}
                  </td>
                  <td className="px-4 py-3 text-ink/70">
                    {product.currency} {product.price}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[product.status]}`}
                    >
                      {STATUS_LABEL[product.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <form
                      action={setFeatured.bind(
                        null,
                        product.id,
                        !product.featured
                      )}
                    >
                      <button
                        type="submit"
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          product.featured
                            ? "bg-teal text-ink"
                            : "bg-paper-dim text-ink/50"
                        }`}
                      >
                        {product.featured ? "Featured" : "Not featured"}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-orange-deep hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteProductButton
                        id={product.id}
                        name={product.name}
                        action={deleteProduct}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}
