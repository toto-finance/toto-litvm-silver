"use client";

import Image from "next/image";
import Link from "next/link";
import { useShop } from "@/components/ShopProvider";
import type { Product } from "@/lib/catalog";
import { usd } from "@/lib/format";
import { listedPrice, useOunceSpot } from "@/lib/silver";

export function ProductCard({ product }: { product: Product }) {
  const { buyNow } = useShop();
  const ask = listedPrice(product.ask, useOunceSpot());

  return (
    <article className="card">
      <Link className="card-media" href={`/products/${product.slug}`}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 960px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </Link>
      <div className="card-body">
        <h2>
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h2>
        <p className="price">
          {usd(ask)}
          <span> / oz</span>
        </p>
        <button className="btn" type="button" onClick={() => buyNow(product.slug, 1)}>
          Buy now
        </button>
      </div>
    </article>
  );
}
