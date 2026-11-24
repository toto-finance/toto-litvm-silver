import { useSyncExternalStore } from "react";
import { SPOT } from "@/lib/catalog";

export const SILVER_FEED = "https://api.diadata.org/v1/rwa/Commodities/XAGG-USD";
const GRAMS_PER_TROY_OUNCE = 31.1034768;

type Quote = {
  Price: number;
  Timestamp: string;
};

let quote: Quote | null = null;
let started = false;
const listeners = new Set<() => void>();

function isQuote(value: unknown): value is Quote {
  if (!value || typeof value !== "object") return false;
  const row = value as Quote;
  return typeof row.Price === "number" && Number.isFinite(row.Price) && typeof row.Timestamp === "string";
}

function publish(next: Quote) {
  quote = next;
  listeners.forEach((listener) => listener());
}

async function loadSpot() {
  const response = await fetch(SILVER_FEED);
  if (!response.ok) throw new Error(String(response.status));
  const body: unknown = await response.json();
  if (!isQuote(body)) throw new Error("Unexpected DIA quote");
  publish(body);
}

function ensureSpot() {
  if (started || typeof window === "undefined") return;
  started = true;
  void loadSpot().catch(() => undefined);
  window.setInterval(() => {
    void loadSpot().catch(() => undefined);
  }, 60_000);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  ensureSpot();
  return () => listeners.delete(listener);
}

export function ounceFromGram(gram: number) {
  return Math.round(gram * GRAMS_PER_TROY_OUNCE * 100) / 100;
}

export function useOunceSpot() {
  const current = useSyncExternalStore(subscribe, () => quote, () => null);
  return current ? ounceFromGram(current.Price) : null;
}

export function listedPrice(ask: number, spot: number | null) {
  if (spot == null) return ask;
  return Math.round((spot + (ask - SPOT)) * 100) / 100;
}
