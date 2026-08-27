import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "@/app/admin/actions";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Add product</h1>
      <div className="mt-6 max-w-3xl rounded-lg border border-paper-line bg-white p-6">
        <ProductForm action={createProduct} />
      </div>
    </div>
  );
}
