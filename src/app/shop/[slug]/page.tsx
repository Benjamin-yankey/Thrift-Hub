import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";
import { getProductBySlug } from "@/lib/products";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found — Thrift Hub" };
  }

  return {
    title: `${product.name} — Thrift Hub`,
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
