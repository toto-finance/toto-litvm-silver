"use client";

import Image from "next/image";
import Link from "next/link";
import { FlowSteps } from "@/components/FlowSteps";
import { useShop } from "@/components/ShopProvider";
import { getProduct } from "@/lib/catalog";
import { oz, usd } from "@/lib/format";
import { formatZkLtc, paymentValue } from "@/lib/litvm";
import { listedPrice, useOunceSpot } from "@/lib/silver";

export default function CartPage() {
  const { items, setQty, removeItem, session } = useShop();
  const spot = useOunceSpot();
  const lines = items
    .map((item) => {
      const product = getProduct(item.slug);
      return product ? { item, product } : null;
    })
    .filter((line) => line !== null);

  const total = lines.reduce(
    (sum, line) => sum + listedPrice(line.product.ask, spot) * line.item.qty,
    0,
  );
  const ounces = lines.reduce((sum, line) => sum + line.item.qty, 0);
  const due = paymentValue(ounces);
  const checkoutHref = session ? "/checkout" : "/signin?next=/checkout";

  return (
    <section className="section commerce">
      <div className="wrap">
        <header className="page-head">
          <div>
            <p className="kicker">Cart</p>
            <h1>Review your order</h1>
          </div>
          <p className="dek">
            {lines.length === 0
              ? "Silver you add from the shelf is held here until checkout."
              : `${oz(ounces)} ${ounces === 1 ? "ounce" : "ounces"} selected. Checkout pays ${formatZkLtc(due)} on LitVM LiteForge.`}
          </p>
        </header>
        <FlowSteps current={1} />

        {lines.length === 0 ? (
          <div className="empty-state">
            <p className="kicker">Empty</p>
            <h2>Nothing in the cart yet</h2>
            <p>Browse allocated silver and add the bars or coins you want to purchase.</p>
            <Link className="btn" href="/#shelf">
              Browse silver
            </Link>
          </div>
        ) : (
          <div className="desk">
            <div className="panel">
              <div className="panel-head">
                <h2>Items</h2>
                <span>
                  {lines.length} {lines.length === 1 ? "product" : "products"}
                </span>
              </div>
              <ul className="bag">
                {lines.map(({ item, product }) => (
                  <li key={item.slug}>
                    <Link
                      className="bag-thumb"
                      href={`/products/${product.slug}`}
                      aria-label={product.name}
                    >
                      <Image src={product.image} alt="" fill sizes="96px" />
                    </Link>
                    <div>
                      <h3>
                        <Link href={`/products/${product.slug}`}>{product.name}</Link>
                      </h3>
                      <p className="bag-meta">
                        {usd(listedPrice(product.ask, spot))} / oz · {product.city}
                      </p>
                      <button
                        type="button"
                        className="text-btn"
                        onClick={() => removeItem(item.slug)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="bag-side">
                      <p className="bag-price">{usd(listedPrice(product.ask, spot) * item.qty)}</p>
                      <div className="qty">
                        <button
                          type="button"
                          aria-label={`Remove one ounce of ${product.name}`}
                          onClick={() => setQty(item.slug, item.qty - 1)}
                          disabled={item.qty <= 1}
                        >
                          −
                        </button>
                        <input
                          aria-label={`Ounces of ${product.name}`}
                          type="number"
                          min={1}
                          max={product.ounces}
                          value={item.qty}
                          onChange={(event) => setQty(item.slug, Number(event.target.value))}
                        />
                        <button
                          type="button"
                          aria-label={`Add one ounce of ${product.name}`}
                          onClick={() => setQty(item.slug, item.qty + 1)}
                          disabled={item.qty >= product.ounces}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="panel summary-card">
              <h2>Summary</h2>
              <div className="totals">
                <p>
                  <span>Catalog value</span>
                  <strong>{usd(total)}</strong>
                </p>
                <p>
                  <span>Ounces</span>
                  <strong>{oz(ounces)}</strong>
                </p>
                <p className="due">
                  <span>Pay on LitVM</span>
                  <strong>{formatZkLtc(due)}</strong>
                </p>
              </div>
              <p className="fine">0.001 zkLTC per troy ounce on LitVM LiteForge testnet.</p>
              <Link className="btn" href={checkoutHref}>
                {session ? "Continue to checkout" : "Sign in to checkout"}
              </Link>
              <Link className="text-link" href="/#shelf">
                Continue browsing
              </Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
