import type { ReactNode } from "react";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Order",
  path: "/orders",
  index: false,
});

export default function OrdersLayout({ children }: { children: ReactNode }) {
  return children;
}
