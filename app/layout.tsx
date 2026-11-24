import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SpotFloat } from "@/components/SpotFloat";
import { Providers } from "@/components/Providers";
import { DESCRIPTION, HOME_TITLE, ogImage, siteGraph, SOCIAL_TITLE } from "@/lib/seo";
import "./globals.css";

const display = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://totofinance.com"),
  title: {
    default: HOME_TITLE,
    template: "%s | Toto Finance",
  },
  description: DESCRIPTION,
  applicationName: "Toto Finance",
  authors: [{ name: "Toto Finance Inc.", url: "https://totofinance.com/" }],
  creator: "Toto Finance Inc.",
  publisher: "Toto Finance Inc.",
  referrer: "strict-origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "whsq_M3VOINEOOt-DjJncvGKFwR7XcoJfWDOAF6pppk",
  },
  openGraph: {
    type: "website",
    siteName: "Toto Finance",
    locale: "en_US",
    url: "https://totofinance.com",
    title: SOCIAL_TITLE,
    description: DESCRIPTION,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    site: "@totofinance",
    title: SOCIAL_TITLE,
    description: DESCRIPTION,
    images: [ogImage.url],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteGraph).replace(/</g, "\\u003c"),
          }}
        />
        <Providers>
          <Header />
          {children}
          <Footer />
          <SpotFloat />
        </Providers>
      </body>
    </html>
  );
}
