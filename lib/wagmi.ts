import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { http } from "wagmi";
import { litvm } from "@/lib/litvm";

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  "21f2b4c8e0a14d6f9b3c7e5a1d8f4b20";

export const config = getDefaultConfig({
  appName: "Toto Finance",
  appDescription: "Allocated silver, paid in zkLTC on LitVM LiteForge.",
  projectId,
  wallets: [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet],
    },
  ],
  chains: [litvm],
  transports: {
    [litvm.id]: http(litvm.rpcUrls.default.http[0]),
  },
  ssr: true,
});
