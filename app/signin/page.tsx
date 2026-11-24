import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Sign in",
  path: "/signin",
  index: false,
});

export default function SignInPage() {
  return (
    <Suspense fallback={<section className="section"><div className="auth"><h1>Sign in</h1></div></section>}>
      <AuthForm mode="signin" />
    </Suspense>
  );
}
