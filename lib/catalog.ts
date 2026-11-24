import { oz, premium, usd } from "@/lib/format";

export const SPOT = 31.42;

export type Form = "Bar" | "Coin" | "Fractional";

export type Product = {
  slug: string;
  ref: string;
  name: string;
  form: Form;
  image: string;
  summary: string;
  description: string;
  vault: string;
  city: string;
  ounces: number;
  ask: number;
  fineness: string;
  refiner: string;
  serial: string;
};

export const slides = [
  {
    src: "/images/hero-bars.jpg",
    kicker: "Bars",
    title: "Cast silver, allocated",
    text: "Hundred-ounce bars and Good Delivery metal, booked in named vaults.",
  },
  {
    src: "/images/hero-coins.jpg",
    kicker: "Coins",
    title: "Coins, by the ounce",
    text: "Eagles, Britannias, and Maple Leafs. One token for each troy ounce.",
  },
  {
    src: "/images/hero-vault.jpg",
    kicker: "Vaults",
    title: "The bar stays where it is",
    text: "London, Zurich, Singapore, New York, and Toronto.",
  },
  {
    src: "/images/hero-ingot.jpg",
    kicker: "Fine silver",
    title: "Buy the ounce. Redeem the bar.",
    text: "Checkout pays 0.001 zkLTC per ounce on LitVM LiteForge.",
  },
] as const;

export const products: Product[] = [
  {
    slug: "good-delivery-bar",
    ref: "AG-0901",
    name: "Toto LTC Silver",
    form: "Fractional",
    image: "/images/toto-silver.png",
    summary: "1,000 oz Metalor bar in London, sold by the ounce.",
    description:
      "A Good Delivery bar cast by Metalor and booked at HSBC in London. Toto Finance issues one AG token for each troy ounce, so you can buy any count up to the full bar. The bar stays in the vault until those tokens are burned for delivery.",
    vault: "HSBC",
    city: "London",
    ounces: 1000,
    ask: 31.48,
    fineness: ".999",
    refiner: "Metalor",
    serial: "MTL-0901",
  },
  {
    slug: "100-oz-fractional-bar",
    ref: "AG-1077",
    name: "Toto LTC Silver",
    form: "Fractional",
    image: "/images/toto-silver.png",
    summary: ".9999 bar in Singapore. Buy any ounce count.",
    description:
      "A 100 oz cast bar, .9999 fine, serial LDN-44102, held at Brinks in Singapore. Tokens are issued one per troy ounce. You can take the whole bar or draw it down an ounce at a time.",
    vault: "Brinks",
    city: "Singapore",
    ounces: 100,
    ask: 31.55,
    fineness: ".9999",
    refiner: "Brinks allocation",
    serial: "LDN-44102",
  },
  {
    slug: "100-oz-rcm-bar",
    ref: "AG-1042",
    name: "Toto LTC Silver",
    form: "Bar",
    image: "/images/toto-silver.png",
    summary: "Royal Canadian Mint cast bar at Brinks, London.",
    description:
      "A 100 oz Royal Canadian Mint cast bar, .9999 fine, serial RCM-88421, stored at Brinks in London. Buying ounces issues that many AG tokens against this serial. Burning the full 100 tokens is how the bar leaves the vault.",
    vault: "Brinks",
    city: "London",
    ounces: 100,
    ask: 31.61,
    fineness: ".9999",
    refiner: "Royal Canadian Mint",
    serial: "RCM-88421",
  },
  {
    slug: "argor-heraeus-kilo",
    ref: "AG-1194",
    name: "Toto LTC Silver",
    form: "Bar",
    image: "/images/toto-silver.png",
    summary: "Minted kilo in Zurich. 32 tokens issued.",
    description:
      "A minted 1 kg Argor-Heraeus bar, .999 fine, serial AH-11042, at Loomis in Zurich. A kilogram is 32.151 troy ounces. Thirty-two tokens are issued against the bar, and the remaining fraction stays with the vault.",
    vault: "Loomis",
    city: "Zurich",
    ounces: 32,
    ask: 31.72,
    fineness: ".999",
    refiner: "Argor-Heraeus",
    serial: "AH-11042",
  },
  {
    slug: "pamp-kilo",
    ref: "AG-1108",
    name: "Toto LTC Silver",
    form: "Bar",
    image: "/images/toto-silver.png",
    summary: "PAMP kilo at Loomis, Zurich. 32 tokens from the bar.",
    description:
      "A minted 1 kg PAMP bar, .999 fine, booked at Loomis in Zurich. Thirty-two AG tokens are issued from the 32.151 oz gross weight. Title to the ounces you buy moves with the tokens. The bar does not.",
    vault: "Loomis",
    city: "Zurich",
    ounces: 32,
    ask: 31.84,
    fineness: ".999",
    refiner: "PAMP",
    serial: "PAMP-22910",
  },
  {
    slug: "heraeus-10-oz",
    ref: "AG-1188",
    name: "Toto LTC Silver",
    form: "Bar",
    image: "/images/toto-silver.png",
    summary: "Small cast bar at Metalor, Zurich.",
    description:
      "A 10 oz Heraeus cast bar, .999 fine, serial HR-55210, held at the Metalor depository in Zurich. Ten tokens cover the bar. It is the smallest whole bar on the shelf.",
    vault: "Metalor",
    city: "Zurich",
    ounces: 10,
    ask: 32.12,
    fineness: ".999",
    refiner: "Heraeus",
    serial: "HR-55210",
  },
  {
    slug: "maple-leaf-lot",
    ref: "AG-3412",
    name: "Toto LTC Silver",
    form: "Coin",
    image: "/images/toto-silver.png",
    summary: "25 one-ounce Maple Leafs at the Royal Canadian Mint.",
    description:
      "Twenty-five 1 oz Maple Leaf coins, .9999 fine, stored at the Royal Canadian Mint in Toronto. Each coin is one troy ounce and one AG token. You can buy any count up to the lot.",
    vault: "RCM",
    city: "Toronto",
    ounces: 25,
    ask: 33.05,
    fineness: ".9999",
    refiner: "Royal Canadian Mint",
    serial: "RCM-ML-3412",
  },
  {
    slug: "britannia-stack",
    ref: "AG-3340",
    name: "Toto LTC Silver",
    form: "Coin",
    image: "/images/toto-silver.png",
    summary: "10 one-ounce Britannias at Brinks, New York.",
    description:
      "Ten 1 oz Britannia coins, .999 fine, held at Brinks in New York. The stack is allocated, not pooled. Buying four ounces is four tokens and title to four coins in this lot.",
    vault: "Brinks",
    city: "New York",
    ounces: 10,
    ask: 33.4,
    fineness: ".999",
    refiner: "The Royal Mint",
    serial: "BRIT-3340",
  },
  {
    slug: "silver-eagle-tube",
    ref: "AG-2210",
    name: "Toto LTC Silver",
    form: "Coin",
    image: "/images/toto-silver.png",
    summary: "20 American Eagles at Malca-Amit, Singapore.",
    description:
      "A tube of 20 American Silver Eagles, .999 fine, 1 oz each, stored at Malca-Amit in Singapore. Coin premiums sit further above spot than large bars. The tube can be bought an ounce at a time.",
    vault: "Malca-Amit",
    city: "Singapore",
    ounces: 20,
    ask: 34.1,
    fineness: ".999",
    refiner: "United States Mint",
    serial: "ASE-2210",
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function relatedProducts(slug: string, count = 3) {
  const index = products.findIndex((product) => product.slug === slug);
  if (index < 0) return products.slice(0, count);
  const ordered = [
    ...products.slice(index + 1),
    ...products.slice(0, index),
  ];
  return ordered.slice(0, count);
}

export function specs(product: Product, spot = SPOT, ask = product.ask) {
  return [
    { label: "Reference", value: product.ref },
    { label: "Form", value: product.form },
    { label: "Fineness", value: product.fineness },
    { label: "Refiner", value: product.refiner },
    { label: "Serial", value: product.serial },
    { label: "Vault", value: `${product.vault}, ${product.city}` },
    { label: "Available", value: `${oz(product.ounces)} troy oz` },
    { label: "Reference spot", value: `${usd(spot)} / oz` },
    { label: "Ask", value: `${usd(ask)} / oz` },
    { label: "Premium", value: `${premium(ask, spot)} to spot` },
    { label: "Token", value: "1 AG = 1 troy ounce" },
    { label: "Full lot", value: usd(ask * product.ounces) },
  ];
}
