"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useChainId, usePublicClient, useSendTransaction, useSwitchChain } from "wagmi";
import { FlowSteps } from "@/components/FlowSteps";
import { useShop } from "@/components/ShopProvider";
import { getProduct } from "@/lib/catalog";
import { oz, shortAddress, usd } from "@/lib/format";
import { formatZkLtc, litvm, paymentValue, TREASURY } from "@/lib/litvm";
import { listedPrice, useOunceSpot } from "@/lib/silver";
import { saveOrder, type Delivery } from "@/lib/storage";

export function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buy = searchParams.get("buy");
  const requestedQty = Number(searchParams.get("qty") || "1");
  const direct = buy ? getProduct(buy) : null;
  const returnPath = direct
    ? `/checkout?buy=${encodeURIComponent(direct.slug)}&qty=${Number.isFinite(requestedQty) ? requestedQty : 1}`
    : "/checkout";

  const { ready, session, account, items, clearCart, error, clearError } = useShop();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();
  const publicClient = usePublicClient({ chainId: litvm.id });
  const spot = useOunceSpot();
  const [paying, setPaying] = useState(false);
  const [draft, setDraft] = useState<Partial<Delivery>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const delivery: Delivery = {
    name: draft.name ?? account?.name ?? "",
    email: draft.email ?? account?.email ?? "",
    line1: draft.line1 ?? "",
    city: draft.city ?? "",
    postal: draft.postal ?? "",
    country: draft.country ?? "",
  };

  useEffect(() => {
    if (!ready) return;
    if (!session) router.replace(`/signin?next=${encodeURIComponent(returnPath)}`);
  }, [ready, session, router, returnPath]);

  const lines = direct
    ? [
        {
          item: {
            slug: direct.slug,
            qty: Math.min(
              direct.ounces,
              Math.max(1, Number.isFinite(requestedQty) ? Math.floor(requestedQty) : 1),
            ),
          },
          product: direct,
        },
      ]
    : items
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

  function update(field: keyof Delivery, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  async function placeOrder(event: React.FormEvent) {
    event.preventDefault();
    clearError();
    setFormError(null);
    if (!session) return;
    if (lines.length === 0) {
      setFormError("There is nothing to check out.");
      return;
    }
    const required = Object.values(delivery).every((value) => value.trim());
    if (!required) {
      setFormError("Fill in every delivery field.");
      return;
    }
    if (!delivery.email.includes("@")) {
      setFormError("Enter a valid email.");
      return;
    }

    const createdAt = new Date().toISOString();
    const id = `TF-${Date.now().toString(36).toUpperCase()}`;
    const orderItems = lines.map(({ item, product }) => ({
      slug: product.slug,
      name: product.name,
      qty: item.qty,
      ask: listedPrice(product.ask, spot),
    }));
    const paid = formatZkLtc(due);
    const message = [
      "Toto Finance purchase",
      "",
      `Order: ${id}`,
      ...orderItems.map(
        (item) => `${item.qty} oz ${item.name} at ${usd(item.ask)} / oz`,
      ),
      `Catalog total: ${usd(total)}`,
      `Paid: ${paid}`,
      `Network: LitVM LiteForge (${litvm.id})`,
      `To: ${TREASURY}`,
      `Deliver to: ${delivery.name}`,
      `${delivery.line1}, ${delivery.city} ${delivery.postal}, ${delivery.country}`,
      `Email: ${delivery.email}`,
      `Wallet: ${session.address}`,
      `Issued at: ${createdAt}`,
    ].join("\n");

    if (!isConnected) {
      setFormError("Connect MetaMask on LitVM LiteForge.");
      return;
    }
    if (!publicClient) {
      setFormError("LitVM is not ready yet.");
      return;
    }

    setPaying(true);
    try {
      if (chainId !== litvm.id) {
        await switchChainAsync({ chainId: litvm.id });
      }
      const hash = await sendTransactionAsync({
        to: TREASURY,
        value: due,
        chainId: litvm.id,
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status !== "success") {
        setFormError("LitVM did not confirm the payment.");
        return;
      }
      saveOrder({
        id,
        address: session.address,
        createdAt,
        items: orderItems,
        total,
        delivery,
        message,
        signature: hash,
        txHash: hash,
      });
      if (!direct) clearCart();
      router.push(`/orders/${id}`);
    } catch (caught) {
      const text = caught instanceof Error ? caught.message : "";
      if (/reject|denied|cancel/i.test(text)) {
        setFormError("The request was declined in MetaMask.");
      } else if (/insufficient/i.test(text)) {
        setFormError("This wallet does not have enough zkLTC for the payment and gas.");
      } else {
        setFormError("The LitVM payment did not go through.");
      }
    } finally {
      setPaying(false);
    }
  }

  if (!ready) {
    return (
      <section className="section commerce">
        <div className="wrap">
          <p className="kicker">Checkout</p>
          <h1>Checkout</h1>
        </div>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="section commerce">
        <div className="wrap">
          <header className="page-head">
            <div>
              <p className="kicker">Checkout</p>
              <h1>Sign in to pay</h1>
            </div>
            <p className="dek">A MetaMask sign-in is required before a LitVM payment.</p>
          </header>
          <Link className="btn" href={`/signin?next=${encodeURIComponent(returnPath)}`}>
            Sign in
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section commerce">
      <div className="wrap">
        <header className="page-head">
          <div>
            <p className="kicker">Checkout</p>
            <h1>Delivery and payment</h1>
          </div>
          <p className="dek">
            Signed in as {shortAddress(session.address)}. Confirming sends{" "}
            {formatZkLtc(due)} on LitVM LiteForge.
          </p>
        </header>
        <FlowSteps current={2} />
        <div className="desk">
          <form className="panel form" onSubmit={placeOrder}>
            <div className="panel-head">
              <h2>Delivery</h2>
              <span>{direct ? "Buy now" : "From cart"}</span>
            </div>
            <label className="field">
              <span>Full name</span>
              <input
                value={delivery.name}
                onChange={(event) => update("name", event.target.value)}
                autoComplete="name"
                required
              />
            </label>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={delivery.email}
                onChange={(event) => update("email", event.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label className="field field-wide">
              <span>Street</span>
              <input
                value={delivery.line1}
                onChange={(event) => update("line1", event.target.value)}
                autoComplete="address-line1"
                required
              />
            </label>
            <label className="field">
              <span>City</span>
              <input
                value={delivery.city}
                onChange={(event) => update("city", event.target.value)}
                autoComplete="address-level2"
                required
              />
            </label>
            <label className="field">
              <span>Postal code</span>
              <input
                value={delivery.postal}
                onChange={(event) => update("postal", event.target.value)}
                autoComplete="postal-code"
                required
              />
            </label>
            <label className="field field-wide">
              <span>Country</span>
              <input
                value={delivery.country}
                onChange={(event) => update("country", event.target.value)}
                autoComplete="country-name"
                required
              />
            </label>
            {formError ? <p className="error">{formError}</p> : null}
            {error ? <p className="error">{error}</p> : null}
            <button className="btn" type="submit" disabled={paying || lines.length === 0}>
              {paying ? "Waiting for LitVM…" : `Pay ${formatZkLtc(due)}`}
            </button>
            <p className="fine">
              MetaMask will ask you to approve this transfer. The catalog price stays
              on the receipt as a reference.
            </p>
          </form>

          <aside className="panel summary-card">
            <h2>Payment</h2>
            {lines.length === 0 ? (
              <p className="bag-meta">
                Nothing to check out. <Link href="/#shelf">Return to the shelf.</Link>
              </p>
            ) : (
              <ul className="pay-lines">
                {lines.map(({ item, product }) => (
                  <li key={item.slug}>
                    <span className="bag-thumb sm">
                      <Image src={product.image} alt="" fill sizes="64px" />
                    </span>
                    <span>
                      {product.name}
                      <small>
                        {oz(item.qty)} oz · {usd(listedPrice(product.ask, spot))} / oz
                      </small>
                    </span>
                    <strong>{usd(listedPrice(product.ask, spot) * item.qty)}</strong>
                  </li>
                ))}
              </ul>
            )}
            <div className="totals">
              <p>
                <span>Catalog value</span>
                <strong>{usd(total)}</strong>
              </p>
              <p className="due">
                <span>Due now</span>
                <strong>{formatZkLtc(due)}</strong>
              </p>
            </div>
            <dl className="meta">
              <div>
                <dt>Network</dt>
                <dd>LitVM LiteForge</dd>
              </div>
              <div>
                <dt>Chain</dt>
                <dd>{litvm.id}</dd>
              </div>
              <div>
                <dt>Pay to</dt>
                <dd>{shortAddress(TREASURY)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}
