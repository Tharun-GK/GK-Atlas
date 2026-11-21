import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const instant = false;


export default async function Home() {
  const counts = { models: 0, providers: 0, companies: 0 };
  let featured: Prisma.ModelGetPayload<{ include: { company: true; prices: { take: 1 } } }>[] = [];
  let databaseConnected = true;
  try {
    const results = await Promise.all([
      prisma.model.count(),
      prisma.provider.count(),
      prisma.company.count(),
      prisma.model.findMany({
        where: { featured: true },
        take: 6,
        include: { company: true, prices: { orderBy: { inputPerM: "asc" }, take: 1 } },
        orderBy: { releaseDate: "desc" },
      }),
    ]);
    counts.models = results[0];
    counts.providers = results[1];
    counts.companies = results[2];
    featured = results[3];
  } catch {
    databaseConnected = false;
  }

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow">Model intelligence platform</div>
            <h1>Explore the <span>AI model universe.</span></h1>
            <p className="hero-copy">Compare capabilities, pricing, context windows, providers, and benchmarks across the world&apos;s leading AI systems.</p>
            <form className="search-hero" action="/models" role="search">
              <input className="input" name="q" placeholder="Search GPT-4.1, Claude, DeepSeek..." aria-label="Search AI models" />
              <button type="submit">Explore <ArrowRight size={16} style={{ display:"inline", marginLeft:6, verticalAlign:"middle" }} /></button>
            </form>
          </div>
          <div className="stat-stack">
            <div className="stat-card"><div className="stat-value">{counts.models || "—"}</div><div className="stat-label">Models tracked</div></div>
            <div className="stat-card"><div className="stat-value">{counts.providers || "—"}</div><div className="stat-label">AI providers</div></div>
            <div className="stat-card"><div className="stat-value">{counts.companies || "—"}</div><div className="stat-label">AI labs</div></div>
            <Link className="stat-card" href="/rankings"><div className="stat-value">4</div><div className="stat-label">Benchmark categories</div></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head"><div><div className="eyebrow">Featured</div><h2>Models to watch</h2></div><Link href="/models">View all models →</Link></div>
          {!databaseConnected ? (
            <div className="notice">Database is not connected. Configure <code>DATABASE_URL</code>, run the Prisma migration and seed, then restart the application.</div>
          ) : featured.length === 0 ? (
            <div className="notice">No models are seeded yet. Run <code>npm run db:migrate</code> and <code>npm run db:seed</code>.</div>
          ) : (
            <div className="model-grid">
              {featured.map((model) => {
                const price = model.prices[0];
                return (
                  <Link className="model-card" href={`/models/${model.slug}`} key={model.id}>
                    <div className="model-card-top"><div><h3>{model.name}</h3><div className="company">{model.company.name}</div></div><span className="pill">{model.modelType}</span></div>
                    <p className="model-desc">{model.description}</p>
                    <div className="metrics">
                      <div className="metric"><span>Input</span><strong>{price ? `$${Number(price.inputPerM)}` : "—"}</strong></div>
                      <div className="metric"><span>Output</span><strong>{price ? `$${Number(price.outputPerM)}` : "—"}</strong></div>
                      <div className="metric"><span>Context</span><strong>{model.contextWindow >= 1000000 ? `${(model.contextWindow / 1000000).toFixed(1)}M` : `${Math.round(model.contextWindow / 1000)}K`}</strong></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
