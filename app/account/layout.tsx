import type { ReactNode } from "react";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Account",
  path: "/account",
  index: false,
});

export default function AccountLayout({ children }: { children: ReactNode }) {
  return children;
}
