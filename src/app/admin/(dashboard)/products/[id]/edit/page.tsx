import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { updateProduct } from "@/app/admin/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ProductRow } from "@/lib/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = createAdminClient();
  const { data: product } = await supabase
    .from("products")
    .select(
      "id, slug, name, category, price, currency, sizes, description, images, image_alt, material, status, featured, sort_order, created_at, updated_at"
    )
    .eq("id", id)
    .single<ProductRow>();

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Edit product</h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-paper-line bg-white p-6">
        <ProductForm
          product={product}
          action={updateProduct.bind(null, id)}
        />
      </div>
    </div>
  );
}
