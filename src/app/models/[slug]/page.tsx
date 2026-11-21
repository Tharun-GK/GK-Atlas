import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const instant = false;


export default async function ModelDetail({ params }: { params: Promise<{ slug:string }> }) {
  const { slug } = await params;
  const model = await prisma.model.findFirst({
    where:{ OR:[{ slug },{ id:slug }] },
    include:{
      company:true,
      providers:{ include:{ provider:true } },
      capabilities:{ include:{ capability:true } },
      prices:true,
      benchmarks:{ include:{ benchmark:true }, orderBy:{ score:"desc" } },
    },
  }).catch(() => null);
  if (!model) notFound();
  const price = model.prices[0];
  return (
    <main className="page">
      <div className="container">
        <div className="page-title"><div><div className="eyebrow">{model.company.name}</div><h1>{model.name}</h1></div><Link className="button" href={`/compare?ids=${model.slug}`}>Add to Compare</Link></div>
        <div className="detail-grid">
          <div className="detail-main">
            <h2 style={{marginTop:0}}>Overview</h2><p style={{color:"var(--muted)",lineHeight:1.7}}>{model.description}</p>
            <div className="spec-grid">
              <div className="spec"><span>Context window</span><strong>{model.contextWindow.toLocaleString()} tokens</strong></div>
              <div className="spec"><span>Maximum output</span><strong>{model.maxOutputTokens?.toLocaleString() ?? "Not listed"}{model.maxOutputTokens ? " tokens" : ""}</strong></div>
              <div className="spec"><span>Model type</span><strong>{model.modelType}</strong></div>
              <div className="spec"><span>Input price</span><strong>{price ? `$${Number(price.inputPerM).toFixed(2)} / 1M` : "Not listed"}</strong></div>
              <div className="spec"><span>Output price</span><strong>{price ? `$${Number(price.outputPerM).toFixed(2)} / 1M` : "Not listed"}</strong></div>
              <div className="spec"><span>Release date</span><strong>{model.releaseDate.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}</strong></div>
            </div>
            <h2 style={{marginTop:28}}>Benchmarks</h2>
            {model.benchmarks.length ? <div className="table-wrap"><table><thead><tr><th>Benchmark</th><th>Score</th><th>Status</th><th>Updated</th></tr></thead><tbody>{model.benchmarks.map((item) => <tr key={item.id}><td>{item.benchmark.name}</td><td><strong>{Number(item.score).toFixed(1)}</strong></td><td>{item.isVerified ? "Verified" : "Demo"}</td><td>{item.lastUpdatedAt.toLocaleDateString()}</td></tr>)}</tbody></table></div> : <div className="notice">No benchmark records available.</div>}
          </div>
          <aside className="detail-side">
            <h3>Providers</h3>
            {model.providers.map((item) => <div key={item.id} style={{borderBottom:"1px solid var(--border)",padding:"12px 0",display:"flex",justifyContent:"space-between"}}><Link href={`/providers/${item.provider.slug}`}>{item.provider.name}</Link><span className="pill">{item.isVerified ? "Verified" : "Listed"}</span></div>)}
            <h3 style={{marginTop:24}}>Capabilities</h3>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{model.capabilities.map((item) => <span className="pill" key={item.capabilityId}>{item.capability.name}</span>)}</div>
            <h3 style={{marginTop:24}}>Company</h3>
            <Link href={`/labs/${model.company.slug}`}>{model.company.name}</Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
