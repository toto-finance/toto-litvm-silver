import type { ReactNode } from "react";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Cart",
  path: "/cart",
  index: false,
});

export default function CartLayout({ children }: { children: ReactNode }) {
  return children;
}
