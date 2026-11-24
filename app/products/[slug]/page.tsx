import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import { getProduct, products, relatedProducts } from "@/lib/catalog";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) {
    return pageMeta({
      title: "Not found",
      path: `/products/${slug}`,
      index: false,
    });
  }
  return pageMeta({
    title: product.name,
    description: product.summary,
    path: `/products/${product.slug}`,
  });
}

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<ProductFallback />}>
      <ProductBody params={params} />
    </Suspense>
  );
}

async function ProductBody({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <ProductDetail product={product} related={relatedProducts(product.slug)} />
  );
}

function ProductFallback() {
  return (
    <section className="section">
      <div className="wrap narrow">
        <h1>Silver</h1>
      </div>
    </section>
  );
}
