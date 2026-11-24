import { Suspense } from "react";
import { Checkout } from "@/components/Checkout";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Checkout",
  path: "/checkout",
  index: false,
});

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <section className="section">
          <div className="wrap narrow">
            <h1>Checkout</h1>
          </div>
        </section>
      }
    >
      <Checkout />
    </Suspense>
  );
}
