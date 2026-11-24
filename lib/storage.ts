import { useSyncExternalStore } from "react";

export type Account = {
  address: string;
  name: string;
  email: string;
  createdAt: string;
};

export type Session = {
  address: string;
  signedAt: string;
};

export type CartItem = {
  slug: string;
  qty: number;
};

export type Delivery = {
  name: string;
  email: string;
  line1: string;
  city: string;
  postal: string;
  country: string;
};

export type OrderItem = {
  slug: string;
  name: string;
  qty: number;
  ask: number;
};

export type Order = {
  id: string;
  address: string;
  createdAt: string;
  items: OrderItem[];
  total: number;
  delivery: Delivery;
  message: string;
  signature: string;
  txHash?: string;
};

const ACCOUNTS = "toto-finance-accounts";
const SESSION = "toto-finance-session";
const CART = "toto-finance-cart";
const ORDERS = "toto-finance-orders";

const emptyCart: CartItem[] = [];
const emptyOrders: Order[] = [];
const emptyAccounts: Record<string, Account> = {};

let cartCache: CartItem[] = emptyCart;
let cartRaw: string | null = null;
let sessionCache: Session | null = null;
let sessionRaw: string | null = null;
let ordersCache: Order[] = emptyOrders;
let ordersRaw: string | null = null;
let accountsCache: Record<string, Account> = emptyAccounts;
let accountsRaw: string | null = null;

function readRaw<T>(key: string, raw: string | null, cache: T, parse: (value: string | null) => T) {
  if (typeof window === "undefined") return { raw, cache };
  const nextRaw = window.localStorage.getItem(key);
  if (nextRaw === raw) return { raw, cache };
  try {
    return { raw: nextRaw, cache: parse(nextRaw) };
  } catch {
    return { raw: nextRaw, cache: parse(null) };
  }
}

function emit(key: string) {
  window.dispatchEvent(new Event(key));
}

export function subscribeKey(key: string, onChange: () => void) {
  window.addEventListener(key, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(key, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function addressKey(address: string) {
  return address.toLowerCase();
}

export function readAccounts() {
  const next = readRaw(ACCOUNTS, accountsRaw, accountsCache, (value) =>
    value ? (JSON.parse(value) as Record<string, Account>) : emptyAccounts,
  );
  accountsRaw = next.raw;
  accountsCache = next.cache;
  return accountsCache;
}

export function getAccount(address: string) {
  return readAccounts()[addressKey(address)] ?? null;
}

export function saveAccount(account: Account) {
  const accounts = {
    ...readAccounts(),
    [addressKey(account.address)]: {
      ...account,
      address: addressKey(account.address),
    },
  };
  accountsCache = accounts;
  accountsRaw = JSON.stringify(accounts);
  window.localStorage.setItem(ACCOUNTS, accountsRaw);
  emit(ACCOUNTS);
}

export function readSession() {
  const next = readRaw(SESSION, sessionRaw, sessionCache, (value) =>
    value ? (JSON.parse(value) as Session) : null,
  );
  sessionRaw = next.raw;
  sessionCache = next.cache;
  return sessionCache;
}

export function writeSession(session: Session | null) {
  if (!session) {
    sessionCache = null;
    sessionRaw = null;
    window.localStorage.removeItem(SESSION);
  } else {
    sessionCache = { ...session, address: addressKey(session.address) };
    sessionRaw = JSON.stringify(sessionCache);
    window.localStorage.setItem(SESSION, sessionRaw);
  }
  emit(SESSION);
}

export function readCart() {
  const next = readRaw(CART, cartRaw, cartCache, (value) =>
    value ? (JSON.parse(value) as CartItem[]) : emptyCart,
  );
  cartRaw = next.raw;
  cartCache = next.cache;
  return cartCache;
}

export function writeCart(items: CartItem[]) {
  cartCache = items;
  cartRaw = JSON.stringify(items);
  window.localStorage.setItem(CART, cartRaw);
  emit(CART);
}

export function readOrders() {
  const next = readRaw(ORDERS, ordersRaw, ordersCache, (value) =>
    value ? (JSON.parse(value) as Order[]) : emptyOrders,
  );
  ordersRaw = next.raw;
  ordersCache = next.cache;
  return ordersCache;
}

export function saveOrder(order: Order) {
  const orders = [order, ...readOrders()];
  ordersCache = orders;
  ordersRaw = JSON.stringify(orders);
  window.localStorage.setItem(ORDERS, ordersRaw);
  emit(ORDERS);
}

export function getOrder(id: string) {
  return readOrders().find((order) => order.id === id) ?? null;
}

export function subscribeCart(onChange: () => void) {
  return subscribeKey(CART, onChange);
}

export function subscribeSession(onChange: () => void) {
  return subscribeKey(SESSION, onChange);
}

export function subscribeOrders(onChange: () => void) {
  return subscribeKey(ORDERS, onChange);
}

export function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

function subscribeHydration() {
  return () => {};
}

export function useHydrated() {
  return useSyncExternalStore(subscribeHydration, () => true, () => false);
}
