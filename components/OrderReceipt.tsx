"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { FlowSteps } from "@/components/FlowSteps";
import { oz, shortAddress, usd, when } from "@/lib/format";
import { formatZkLtc, paymentValue, txUrl } from "@/lib/litvm";
import { readOrders, subscribeOrders, useHydrated } from "@/lib/storage";

const emptyOrders: ReturnType<typeof readOrders> = [];

export function OrderReceipt({ id }: { id: string }) {
  const hydrated = useHydrated();
  const orders = useSyncExternalStore(subscribeOrders, readOrders, () => emptyOrders);
  const order = orders.find((item) => item.id === id) ?? null;

  if (!hydrated) {
    return (
      <section className="section commerce">
        <div className="wrap">
          <p className="kicker">Order</p>
          <h1>Confirmation</h1>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="section commerce">
        <div className="wrap">
          <header className="page-head">
            <div>
              <p className="kicker">Order</p>
              <h1>Order not found</h1>
            </div>
            <p className="dek">This confirmation is stored in the browser that placed it.</p>
          </header>
          <Link className="btn" href="/#shelf">
            Back to the shelf
          </Link>
        </div>
      </section>
    );
  }

  const ounces = order.items.reduce((sum, item) => sum + item.qty, 0);
  const hash = order.txHash || order.signature;
  const placed = when(order.createdAt);

  return (
    <section className="section commerce">
      <div className="wrap">
        <header className="page-head">
          <div>
            <p className="kicker">Confirmed</p>
            <h1>Payment received</h1>
          </div>
          <p className="dek">{`${order.id} is recorded for ${order.delivery.name}. LitVM confirmed the zkLTC transfer on ${placed}.`}</p>
        </header>
        <FlowSteps current={3} />

        <div className="success-banner">
          <span className="success-mark" aria-hidden="true">
            ✓
          </span>
          <div>
            <strong>LitVM LiteForge accepted this payment</strong>
            <p>{formatZkLtc(paymentValue(ounces))} sent to the Toto Finance wallet.</p>
          </div>
        </div>

        <div className="desk">
          <div className="stack">
            <section className="panel">
              <div className="panel-head">
                <h2>Receipt</h2>
                <span>{order.id}</span>
              </div>
              <ul className="pay-lines">
                {order.items.map((item) => (
                  <li key={item.slug}>
                    <span>
                      {item.name}
                      <small>
                        {oz(item.qty)} oz · {usd(item.ask)} / oz
                      </small>
                    </span>
                    <strong>{usd(item.ask * item.qty)}</strong>
                  </li>
                ))}
              </ul>
              <div className="totals">
                <p>
                  <span>Catalog value</span>
                  <strong>{usd(order.total)}</strong>
                </p>
                <p className="due">
                  <span>Paid</span>
                  <strong>{formatZkLtc(paymentValue(ounces))}</strong>
                </p>
              </div>
            </section>

            <section className="panel">
              <h2>Transaction</h2>
              {order.txHash ? (
                <a className="hash" href={txUrl(order.txHash)} target="_blank" rel="noopener noreferrer">
                  {hash}
                </a>
              ) : (
                <p className="hash">{hash}</p>
              )}
              <p className="fine">Opens the LiteForge explorer in a new tab.</p>
            </section>
          </div>

          <aside className="panel summary-card">
            <h2>Delivery</h2>
            <address>
              <strong>{order.delivery.name}</strong>
              <span>{order.delivery.line1}</span>
              <span>
                {order.delivery.city} {order.delivery.postal}
              </span>
              <span>{order.delivery.country}</span>
              <span>{order.delivery.email}</span>
            </address>
            <dl className="meta">
              <div>
                <dt>Wallet</dt>
                <dd title={order.address}>{shortAddress(order.address)}</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>{placed}</dd>
              </div>
            </dl>
            <div className="actions">
              <Link className="btn" href="/account">
                View account
              </Link>
              <Link className="btn btn-ghost" href="/#shelf">
                Continue browsing
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
