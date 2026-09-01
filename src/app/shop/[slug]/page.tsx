import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import { getAllProducts, getProductBySlug } from "@/lib/products";

// Pre-renders every known product page at build time so a visit is served
// from cache instead of hitting Supabase live. A product added afterward
// still works — `dynamicParams` defaults to true, so its first visit
// renders on demand and gets cached from then on.
export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found Thrift Hub" };
  }

  return {
    title: `${product.name}  Thrift Hub`,
    description: product.description || `${product.name}, from Thrift Hub.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex min-h-full flex-col bg-paper">
      <Nav />
      <main className="flex-1">
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-[1800px] px-5 sm:px-8">
            <ProductDetail product={product} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
