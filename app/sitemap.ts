import type { MetadataRoute } from "next";
import { products } from "@/lib/catalog";
import { canonical } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: canonical("/"), changeFrequency: "weekly", priority: 1 },
    ...products.map((product) => ({
      url: canonical(`/products/${product.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
