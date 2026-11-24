"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectMetaMask } from "@/components/ConnectMetaMask";
import { useShop } from "@/components/ShopProvider";
import { getAccount, safeNext } from "@/lib/storage";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const { address, isConnected } = useAccount();
  const { session, signIn, signUp, busy, error, clearError } = useShop();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (session) router.replace(next);
  }, [session, next, router]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    clearError();
    setLocalError(null);
    try {
      if (mode === "signin") {
        if (address && !getAccount(address)) {
          setLocalError("This wallet has no account yet.");
          return;
        }
        await signIn();
      } else {
        await signUp(name, email);
      }
      router.push(next);
    } catch (caught) {
      if (caught instanceof Error && !error) setLocalError(caught.message);
    }
  }

  const title = mode === "signin" ? "Sign in" : "Create an account";
  const existing = address ? getAccount(address) : null;

  return (
    <section className="section">
      <div className="auth">
        <p className="kicker">MetaMask</p>
        <h1>{title}</h1>
        <p className="dek">
          {mode === "signin"
            ? "Connect MetaMask, then sign a message. That signature is the sign-in. Buying requires it."
            : "A new wallet signs once to open an account. The name and email stay in this browser."}
        </p>
        <ConnectMetaMask />
        {isConnected && address ? (
          <form className="form" onSubmit={submit}>
            {mode === "signup" ? (
              <>
                <label className="field">
                  <span>Name</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                  />
                </label>
              </>
            ) : null}
            {mode === "signin" && !existing ? (
              <p className="error">
                This wallet is new.{" "}
                <Link href={`/signup?next=${encodeURIComponent(next)}`}>
                  Create an account
                </Link>
                .
              </p>
            ) : null}
            {mode === "signup" && existing ? (
              <p className="error">
                This wallet already has an account.{" "}
                <Link href={`/signin?next=${encodeURIComponent(next)}`}>Sign in</Link>
                .
              </p>
            ) : null}
            {localError || error ? (
              <p className="error">{localError || error}</p>
            ) : null}
            <button
              className="btn"
              type="submit"
              disabled={
                busy ||
                (mode === "signin" && !existing) ||
                (mode === "signup" && Boolean(existing))
              }
            >
              {busy
                ? "Waiting for MetaMask…"
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>
        ) : (
          <p className="note">MetaMask opens from the button above.</p>
        )}
        <p className="switch">
          {mode === "signin" ? (
            <>
              New to Toto Finance?{" "}
              <Link href={`/signup?next=${encodeURIComponent(next)}`}>
                Create an account
              </Link>
            </>
          ) : (
            <>
              Already have a wallet on file?{" "}
              <Link href={`/signin?next=${encodeURIComponent(next)}`}>Sign in</Link>
            </>
          )}
        </p>
      </div>
    </section>
  );
}
