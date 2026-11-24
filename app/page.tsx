import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/catalog";
import { homePageGraph, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ path: "/" });

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homePageGraph).replace(/</g, "\\u003c"),
        }}
      />
      <HeroCarousel />
      <section className="section" id="shelf">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="kicker">The shelf</p>
              <h1>Silver, ready to buy.</h1>
            </div>
            <p className="dek">
              Nine allocated listings. Bars and coins in named vaults, priced
              per troy ounce. Buy now starts checkout, and checkout pays in zkLTC
              on LitVM.
            </p>
          </div>
          <div className="grid">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
