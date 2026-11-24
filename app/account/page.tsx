"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useShop } from "@/components/ShopProvider";
import { oz, usd, when } from "@/lib/format";
import { formatZkLtc, paymentValue } from "@/lib/litvm";
import { readOrders, subscribeOrders } from "@/lib/storage";

const emptyOrders: ReturnType<typeof readOrders> = [];

export default function AccountPage() {
  const router = useRouter();
  const { ready, session, account, signOut } = useShop();
  const orders = useSyncExternalStore(subscribeOrders, readOrders, () => emptyOrders);
  const mine = session
    ? orders.filter((order) => order.address.toLowerCase() === session.address.toLowerCase())
    : [];

  useEffect(() => {
    if (!ready) return;
    if (!session) router.replace("/signin?next=/account");
  }, [ready, session, router]);

  if (!ready || !session || !account) {
    return (
      <section className="section commerce">
        <div className="wrap">
          <p className="kicker">Account</p>
          <h1>Account</h1>
        </div>
      </section>
    );
  }

  return (
    <section className="section commerce">
      <div className="wrap">
        <header className="page-head">
          <div>
            <p className="kicker">Account</p>
            <h1>{account.name}</h1>
          </div>
          <p className="dek">Orders and delivery details for this wallet stay in this browser.</p>
        </header>

        <div className="desk">
          <div className="stack">
            <section className="panel">
              <div className="panel-head">
                <h2>Profile</h2>
                <button className="btn btn-ghost" type="button" onClick={signOut}>
                  Sign out
                </button>
              </div>
              <dl className="facts">
                <dt>Email</dt>
                <dd>{account.email}</dd>
                <dt>Wallet</dt>
                <dd>{session.address}</dd>
                <dt>Opened</dt>
                <dd>{when(account.createdAt)}</dd>
              </dl>
            </section>

            <section className="panel">
              <div className="panel-head">
                <h2>Orders</h2>
                <span>{mine.length}</span>
              </div>
              {mine.length === 0 ? (
                <div className="empty-inline">
                  <p>No payments yet.</p>
                  <Link className="text-link" href="/#shelf">
                    Browse silver
                  </Link>
                </div>
              ) : (
                <ul className="order-table">
                  {mine.map((order) => {
                    const ounces = order.items.reduce((sum, item) => sum + item.qty, 0);
                    return (
                      <li key={order.id}>
                        <Link href={`/orders/${order.id}`}>
                          <span>
                            <strong>{order.id}</strong>
                            <small>{when(order.createdAt)}</small>
                          </span>
                          <span>
                            {oz(ounces)} oz
                            <small>{order.items.length === 1 ? order.items[0].name : `${order.items.length} products`}</small>
                          </span>
                          <span>
                            {usd(order.total)}
                            <small>{formatZkLtc(paymentValue(ounces))}</small>
                          </span>
                          <em>Paid</em>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>

          <aside className="panel summary-card">
            <h2>How payment works</h2>
            <ol className="plain-list">
              <li>Sign in with the same MetaMask wallet.</li>
              <li>Checkout sends 0.001 zkLTC per ounce on LitVM LiteForge.</li>
              <li>The confirmation page keeps the transaction link.</li>
            </ol>
            <Link className="btn" href="/cart">
              Go to cart
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
