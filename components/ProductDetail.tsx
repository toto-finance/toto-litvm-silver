"use client";

import Image from "next/image";
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useShop } from "@/components/ShopProvider";
import { SPOT, type Product, specs } from "@/lib/catalog";
import { oz, premium, usd } from "@/lib/format";
import { listedPrice, useOunceSpot } from "@/lib/silver";

export function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { addToCart, buyNow } = useShop();
  const spot = useOunceSpot();
  const ask = listedPrice(product.ask, spot);
  const reference = spot ?? SPOT;
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function changeQty(next: number) {
    if (!Number.isFinite(next)) return;
    setQty(Math.min(product.ounces, Math.max(1, Math.floor(next))));
    setAdded(false);
  }

  const rows = specs(product, reference, ask);

  return (
    <article className="product">
      <div className="wrap product-top">
        <div className="product-media">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 900px) 52vw, 100vw"
          />
        </div>
        <div className="buybox">
          <p className="kicker">
            {product.ref} · {product.form}
          </p>
          <h1>{product.name}</h1>
          <p className="dek">{product.summary}</p>
          <p className="price price-large">
            {usd(ask)}
            <span> / oz</span>
          </p>
          <p className="premium-line">
            {premium(ask, reference)} above the {usd(reference)} reference spot.{" "}
            {oz(product.ounces)} oz at {product.vault}, {product.city}.
          </p>
          <div className="qty-row">
            <label htmlFor="ounces">Troy ounces</label>
            <div className="qty">
              <button
                type="button"
                onClick={() => changeQty(qty - 1)}
                disabled={qty <= 1}
                aria-label="Remove one ounce"
              >
                −
              </button>
              <input
                id="ounces"
                type="number"
                min={1}
                max={product.ounces}
                value={qty}
                onChange={(event) => changeQty(Number(event.target.value))}
              />
              <button
                type="button"
                onClick={() => changeQty(qty + 1)}
                disabled={qty >= product.ounces}
                aria-label="Add one ounce"
              >
                +
              </button>
            </div>
          </div>
          <p className="total-line">
            <span>Total</span>
            <strong>{usd(ask * qty)}</strong>
          </p>
          <div className="buy-actions">
            <button className="btn" type="button" onClick={() => buyNow(product.slug, qty)}>
              Buy now
            </button>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                addToCart(product.slug, qty);
                setAdded(true);
              }}
            >
              Add to cart
            </button>
          </div>
          {added ? (
            <p className="note" role="status">
              Added {oz(qty)} oz to the cart.
            </p>
          ) : (
            <p className="note">
              {oz(qty)} AG {qty === 1 ? "token" : "tokens"}. Checkout pays 0.001
              zkLTC per ounce on LitVM LiteForge.
            </p>
          )}
        </div>
      </div>

      <div className="wrap product-copy">
        <h2>The metal</h2>
        <p>{product.description}</p>
      </div>

      <div className="wrap">
        <h2>Details</h2>
        <table className="specs">
          <caption className="sr-only">{product.name} specifications</caption>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="wrap related">
        <h2>More on the shelf</h2>
        <div className="grid">
          {related.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </div>
    </article>
  );
}
