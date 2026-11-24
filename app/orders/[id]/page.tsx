import { Suspense } from "react";
import { OrderReceipt } from "@/components/OrderReceipt";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return pageMeta({
    title: "Payment received",
    path: `/orders/${id}`,
    index: false,
  });
}

export default function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<OrderFallback />}>
      <OrderBody params={params} />
    </Suspense>
  );
}

async function OrderBody({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderReceipt id={id} />;
}

function OrderFallback() {
  return (
    <section className="section commerce">
      <div className="wrap">
        <p className="kicker">Order</p>
        <h1>Confirmation</h1>
      </div>
    </section>
  );
}
