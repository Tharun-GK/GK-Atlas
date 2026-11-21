import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const instant = false;


export default async function ModelsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const company = typeof params.company === "string" ? params.company : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "release";
  const page = typeof params.page === "string" ? Math.max(1, Number(params.page) || 1) : 1;
  const limit = 12;
  let models: Prisma.ModelGetPayload<{ include: { company: true; providers: { include: { provider: true } }; capabilities: { include: { capability: true } }; prices: { take: 1 } } }>[] = [];
  let companies: Prisma.CompanyGetPayload<object>[] = [];
  let error = false;
  try {
    const order = sort === "context" ? { contextWindow: "desc" as const } : sort === "release" ? { releaseDate: "desc" as const } : { name: "asc" as const };
    [models, companies] = await Promise.all([
      prisma.model.findMany({
        where: {
          ...(q ? { OR: [{ name: { contains:q, mode:"insensitive" } }, { description:{ contains:q, mode:"insensitive" } }] } : {}),
          ...(company ? { company:{ slug:company } } : {}),
        },
        include:{ company:true, providers:{ include:{ provider:true } }, capabilities:{ include:{ capability:true } }, prices:{ take:1, orderBy:{ inputPerM:"asc" } } },
        orderBy: order,
      }),
      prisma.company.findMany({ orderBy:{ name:"asc" } }),
    ]);
    if (sort === "input-price" || sort === "output-price") {
      models = [...models].sort((left, right) => {
        const leftPrice = left.prices[0] ? Number(sort === "input-price" ? left.prices[0].inputPerM : left.prices[0].outputPerM) : Number.MAX_SAFE_INTEGER;
        const rightPrice = right.prices[0] ? Number(sort === "input-price" ? right.prices[0].inputPerM : right.prices[0].outputPerM) : Number.MAX_SAFE_INTEGER;
        return leftPrice - rightPrice;
      });
    }
    models = models.slice((page - 1) * limit, page * limit);
  } catch { error = true; }

  return (
    <main className="page">
      <div className="container">
        <div className="page-title"><div><div className="eyebrow">Model directory</div><h1>Explore models</h1></div><Link className="button" href="/compare">Open comparison</Link></div>
        <form className="toolbar" role="search">
          <input className="input" name="q" defaultValue={q ?? ""} placeholder="Search model name..." style={{ width:260 }} />
          <select className="select" name="company" defaultValue={company ?? ""}>
            <option value="">All AI labs</option>
            {companies.map((item) => <option value={item.slug} key={item.id}>{item.name}</option>)}
          </select>
          <select className="select" name="sort" defaultValue={sort}>
            <option value="release">Release date</option>
            <option value="context">Context window</option>
            <option value="input-price">Input price: low to high</option>
            <option value="output-price">Output price: low to high</option>
            <option value="name">Name</option>
          </select>
          <button className="button secondary" type="submit">Apply</button>
        </form>
        {error ? <div className="notice">Database unavailable. Configure <code>DATABASE_URL</code> and run Prisma migrations.</div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Model</th><th>Company</th><th>Context</th><th>Input / 1M</th><th>Output / 1M</th><th>Type</th></tr></thead>
              <tbody>{models.map((model) => (
                <tr key={model.id}>
                  <td><Link href={`/models/${model.slug}`} style={{fontWeight:700}}>{model.name}</Link></td>
                  <td>{model.company.name}</td>
                  <td>{model.contextWindow >= 1000000 ? `${(model.contextWindow/1000000).toFixed(1)}M` : `${Math.round(model.contextWindow/1000)}K`}</td>
                  <td>{model.prices[0] ? `$${Number(model.prices[0].inputPerM).toFixed(2)}` : "—"}</td>
                  <td>{model.prices[0] ? `$${Number(model.prices[0].outputPerM).toFixed(2)}` : "—"}</td>
                  <td><span className="pill">{model.modelType}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
