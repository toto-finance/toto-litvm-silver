"use client";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { verifyMessage } from "viem";
import { getProduct } from "@/lib/catalog";
import {
  addressKey,
  getAccount,
  readCart,
  readSession,
  saveAccount,
  subscribeCart,
  subscribeSession,
  type Account,
  type CartItem,
  type Session,
  useHydrated,
  writeCart,
  writeSession,
} from "@/lib/storage";

type ShopContextValue = {
  ready: boolean;
  session: Session | null;
  account: Account | null;
  items: CartItem[];
  count: number;
  addToCart: (slug: string, qty: number) => void;
  setQty: (slug: string, qty: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  buyNow: (slug: string, qty: number) => void;
  signIn: () => Promise<void>;
  signUp: (name: string, email: string) => Promise<void>;
  signOut: () => void;
  signOrder: (message: string) => Promise<string>;
  busy: boolean;
  error: string | null;
  clearError: () => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);
const emptyCart: CartItem[] = [];

function clampQty(slug: string, qty: number) {
  const product = getProduct(slug);
  const max = product?.ounces ?? 1;
  if (!Number.isFinite(qty)) return 1;
  return Math.min(max, Math.max(1, Math.floor(qty)));
}

function signInMessage(address: string, issuedAt: string) {
  return [
    "Toto Finance",
    "",
    "Sign in with this wallet.",
    `Wallet: ${address}`,
    `Issued at: ${issuedAt}`,
  ].join("\n");
}

function signUpMessage(address: string, name: string, email: string, issuedAt: string) {
  return [
    "Toto Finance",
    "",
    "Create an account with this wallet.",
    `Name: ${name}`,
    `Email: ${email}`,
    `Wallet: ${address}`,
    `Issued at: ${issuedAt}`,
  ].join("\n");
}

function readableError(error: unknown) {
  if (error instanceof Error) {
    const text = `${error.name} ${error.message}`.toLowerCase();
    if (
      text.includes("reject") ||
      text.includes("denied") ||
      text.includes("cancel")
    ) {
      return "The request was declined in MetaMask.";
    }
    return error.message;
  }
  return "MetaMask did not complete the request.";
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const { address, status } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const items = useSyncExternalStore(subscribeCart, readCart, () => emptyCart);
  const storedSession = useSyncExternalStore(
    subscribeSession,
    readSession,
    () => null,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ready =
    hydrated && (status === "connected" || status === "disconnected");
  const session =
    ready &&
    status === "connected" &&
    address &&
    storedSession &&
    addressKey(storedSession.address) === addressKey(address)
      ? storedSession
      : null;
  const account = session && address ? getAccount(address) : null;

  async function signText(message: string) {
    if (!address) throw new Error("Connect MetaMask first.");
    const signature = await signMessageAsync({ message });
    const valid = await verifyMessage({ address, message, signature });
    if (!valid) throw new Error("The signature does not match this wallet.");
    return signature;
  }

  const value: ShopContextValue = {
    ready,
    session,
    account,
    items,
    count: items.reduce((sum, item) => sum + item.qty, 0),
    addToCart(slug, qty) {
      const current = readCart();
      const nextQty = clampQty(slug, qty);
      const existing = current.find((item) => item.slug === slug);
      const merged = existing ? clampQty(slug, existing.qty + nextQty) : nextQty;
      const next = existing
        ? current.map((item) =>
            item.slug === slug ? { ...item, qty: merged } : item,
          )
        : [...current, { slug, qty: merged }];
      writeCart(next);
    },
    setQty(slug, qty) {
      writeCart(
        readCart().map((item) =>
          item.slug === slug ? { ...item, qty: clampQty(slug, qty) } : item,
        ),
      );
    },
    removeItem(slug) {
      writeCart(readCart().filter((item) => item.slug !== slug));
    },
    clearCart() {
      writeCart([]);
    },
    buyNow(slug, qty) {
      const safeQty = clampQty(slug, qty);
      const destination = `/checkout?buy=${encodeURIComponent(slug)}&qty=${safeQty}`;
      router.push(
        session ? destination : `/signin?next=${encodeURIComponent(destination)}`,
      );
    },
    async signIn() {
      if (!address) throw new Error("Connect MetaMask first.");
      if (!getAccount(address)) {
        throw new Error("This wallet has no account yet. Create one first.");
      }
      setBusy(true);
      setError(null);
      try {
        const issuedAt = new Date().toISOString();
        await signText(signInMessage(address, issuedAt));
        writeSession({ address, signedAt: issuedAt });
      } catch (caught) {
        const message = readableError(caught);
        setError(message);
        throw new Error(message);
      } finally {
        setBusy(false);
      }
    },
    async signUp(name, email) {
      if (!address) throw new Error("Connect MetaMask first.");
      if (getAccount(address)) {
        throw new Error("This wallet already has an account. Sign in instead.");
      }
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
      if (!trimmedName || !trimmedEmail) {
        throw new Error("Name and email are required.");
      }
      setBusy(true);
      setError(null);
      try {
        const issuedAt = new Date().toISOString();
        await signText(signUpMessage(address, trimmedName, trimmedEmail, issuedAt));
        saveAccount({
          address,
          name: trimmedName,
          email: trimmedEmail,
          createdAt: issuedAt,
        });
        writeSession({ address, signedAt: issuedAt });
      } catch (caught) {
        const message = readableError(caught);
        setError(message);
        throw new Error(message);
      } finally {
        setBusy(false);
      }
    },
    signOut() {
      writeSession(null);
      disconnect();
      router.push("/");
    },
    async signOrder(message) {
      setBusy(true);
      setError(null);
      try {
        return await signText(message);
      } catch (caught) {
        const text = readableError(caught);
        setError(text);
        throw new Error(text);
      } finally {
        setBusy(false);
      }
    },
    busy,
    error,
    clearError() {
      setError(null);
    },
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used within ShopProvider");
  return context;
}
