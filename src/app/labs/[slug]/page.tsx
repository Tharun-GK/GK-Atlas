import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const instant = false;


export default async function LabDetail({ params }: { params:Promise<{slug:string}> }) {
  const { slug } = await params;
  const company = await prisma.company.findFirst({ where:{ OR:[{slug},{id:slug}] }, include:{ models:{ include:{ prices:true }, orderBy:{releaseDate:"desc"} } } }).catch(() => null);
  if (!company) notFound();
  return <main className="page"><div className="container">
    <div className="page-title"><div><div className="eyebrow">AI lab</div><h1>{company.name}</h1></div>{company.website && <a className="button secondary" href={company.website} target="_blank" rel="noreferrer">Official website</a>}</div>
    <p style={{color:"var(--muted)",maxWidth:700,lineHeight:1.7}}>{company.description}</p>
    <div className="section-head" style={{marginTop:36}}><h2>Models ({company.models.length})</h2></div>
    <div className="model-grid">{company.models.map((model) => { const price=model.prices[0]; return <Link className="model-card" href={`/models/${model.slug}`} key={model.id}><h3>{model.name}</h3><p className="model-desc">{model.description}</p><div className="metrics"><div className="metric"><span>Input</span><strong>{price ? `$${Number(price.inputPerM)}` : "—"}</strong></div><div className="metric"><span>Context</span><strong>{(model.contextWindow/1000).toFixed(0)}K</strong></div><div className="metric"><span>Released</span><strong>{model.releaseDate.getFullYear()}</strong></div></div></Link>; })}</div>
  </div></main>;
}
