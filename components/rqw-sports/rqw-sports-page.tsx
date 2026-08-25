import Image from "next/image";

import { rqwSportsProducts } from "@/content/rqw-sports";

export function RqwSportsPage() {
  return (
    <main className="rqw-sports-page">
      <section className="rqw-sports-hero" aria-labelledby="rqw-sports-title">
        <div className="rqw-sports-shell">
          <p className="rqw-sports-kicker">RQW PRODUCT COLLECTION</p>
          <h1 id="rqw-sports-title">RQW Sports &amp; Recreation</h1>
          <p className="rqw-sports-intro">
            Explore the RQW collection of sports, fitness, outdoor, swimming,
            fishing, and recreational products.
          </p>
        </div>
      </section>

      <section className="rqw-sports-catalog" aria-label="RQW product catalog">
        <div className="rqw-sports-shell">
          <div className="rqw-sports-grid" data-testid="rqw-sports-grid">
            {rqwSportsProducts.map((product) => (
              <article
                className="rqw-sports-card"
                data-testid="rqw-sports-card"
                key={product.slug}
              >
                <div className="rqw-sports-image-stage">
                  <Image
                    alt={`${product.name} branded RQW product`}
                    fill
                    loading="eager"
                    sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 980px) 46vw, 30vw"
                    src={product.image}
                    unoptimized
                  />
                </div>
                <div className="rqw-sports-card-copy">
                  <p>RQW</p>
                  <h2>{product.name}</h2>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
