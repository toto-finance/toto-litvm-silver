import { defineChain, formatEther, parseEther } from "viem";

export const litvm = defineChain({
  id: 4441,
  name: "LitVM LiteForge",
  nativeCurrency: {
    name: "zkLTC",
    symbol: "zkLTC",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.liteforge.zeeve.net/"] },
  },
  blockExplorers: {
    default: {
      name: "LiteForge Explorer",
      url: "https://explorer.testnet.liteforge.zeeve.net",
    },
  },
  testnet: true,
});

export const TREASURY = "0x518b9ABa7586542e611909799f6d0B81e9552D9b" as const;

const perOunce = parseEther("0.001");

export function paymentValue(ounces: number) {
  const count = BigInt(Math.max(1, Math.floor(ounces)));
  return perOunce * count;
}

export function formatZkLtc(value: bigint) {
  return `${formatEther(value)} zkLTC`;
}

export function txUrl(hash: string) {
  return `${litvm.blockExplorers.default.url}/tx/${hash}`;
}
