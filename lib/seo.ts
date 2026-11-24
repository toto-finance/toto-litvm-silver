import type { Metadata } from "next";

export const SITE_URL = "https://totofinance.com";

export const HOME_TITLE = "Toto Finance | Tokenized Commodities From Mine to Market";

export const SOCIAL_TITLE =
  "Toto Finance: The Mine-to-Market Platform for Tokenized Commodities";

export const DESCRIPTION =
  "Toto Finance is the mine-to-market platform for tokenized commodities, starting with copper for the US market. CuTT tokenized copper: buy physical copper online, settle in stablecoins, trade on-chain.";

export const ogImage = {
  url: "/og/home.png",
  type: "image/png" as const,
  width: 1200,
  height: 630,
  alt: SOCIAL_TITLE,
};

export function canonical(path: string) {
  if (path === "/") return SITE_URL;
  return `${SITE_URL}${path}`;
}

export function pageMeta({
  title,
  description = DESCRIPTION,
  path,
  index = true,
}: {
  title?: string;
  description?: string;
  path: string;
  index?: boolean;
}): Metadata {
  const socialTitle = title ? `${title} | Toto Finance` : SOCIAL_TITLE;
  const metadata: Metadata = {
    title: title ? title : { absolute: HOME_TITLE },
    description,
    alternates: { canonical: canonical(path) },
    openGraph: {
      type: "website",
      siteName: "Toto Finance",
      locale: "en_US",
      title: socialTitle,
      description,
      url: canonical(path),
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      site: "@totofinance",
      title: socialTitle,
      description,
      images: [ogImage.url],
    },
  };
  if (!index) {
    metadata.robots = {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    };
  }
  return metadata;
}

export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Toto Finance",
      legalName: "Toto Finance Inc.",
      alternateName: ["TotoFinance.com", "Tiamonds"],
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon-512.png`,
        width: 512,
        height: 512,
      },
      image: `${SITE_URL}/og/home.png`,
      description:
        "Toto Finance is the mine-to-market platform for tokenized commodities, starting with copper. Toto Finance Inc. is a Delaware corporation.",
      slogan:
        "The mine-to-market platform for tokenized commodities, starting with copper.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "111 NE 1st St, 8th Floor, Suite #89330",
        addressLocality: "Miami",
        addressRegion: "FL",
        postalCode: "33132",
        addressCountry: "US",
      },
      founder: {
        "@type": "Person",
        "@id": `${SITE_URL}/leadership/#monty-metzger`,
        name: "Monty Metzger",
        alternateName: "Monty C. M. Metzger",
        jobTitle: "Founder and Chairman",
        url: `${SITE_URL}/leadership/#monty-metzger`,
        sameAs: [
          "https://www.linkedin.com/in/montymetzger",
          "https://x.com/montymetzger",
          "https://monty.de",
        ],
      },
      sameAs: [
        "https://x.com/totofinance",
        "https://www.linkedin.com/company/totofinance/",
        "https://www.youtube.com/@Toto-Finance",
        "https://www.instagram.com/totofinance.co",
        "https://t.me/totofinance",
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "business inquiries",
          url: `${SITE_URL}/contact/`,
          availableLanguage: "English",
        },
        {
          "@type": "ContactPoint",
          contactType: "media inquiries",
          url: `${SITE_URL}/newsroom/#media-contact`,
          availableLanguage: "English",
        },
      ],
      knowsAbout: [
        "Tokenized commodities",
        "Tokenized copper",
        "Commodity tokenization",
        "Real-world assets",
        "Mine-to-market infrastructure",
        "Commodity financing",
        "Critical minerals",
        "Commodity settlement",
        "Physical commodity redemption",
      ],
      areaServed: "Worldwide",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Toto Finance",
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en",
    },
  ],
};

export const homePageGraph = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/#webpage`,
  url: `${SITE_URL}/`,
  name: HOME_TITLE,
  description: DESCRIPTION,
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "en",
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: `${SITE_URL}/og/home.png`,
    width: 1200,
    height: 630,
  },
};
