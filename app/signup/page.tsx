import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Create an account",
  path: "/signup",
  index: false,
});

export default function SignUpPage() {
  return (
    <Suspense fallback={<section className="section"><div className="auth"><h1>Create an account</h1></div></section>}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
