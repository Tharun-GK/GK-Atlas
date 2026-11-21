import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const instant = false;


export default async function ComparePage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const params=await searchParams;
  const ids=Array.isArray(params.ids)
    ? params.ids.flatMap((value) => value.split(",")).filter(Boolean).slice(0,3)
    : typeof params.ids==="string"
      ? params.ids.split(",").filter(Boolean).slice(0,3)
      : [];
  type CompareModel = Prisma.ModelGetPayload<{ include: { company: true; providers: { include: { provider: true } }; capabilities: { include: { capability: true } }; prices: true; benchmarks: { include: { benchmark: true } } } }>;
  let models: CompareModel[]=[];
  let options: Prisma.ModelGetPayload<{ include: { company: true } }>[]=[];
  let error=false;
  try {
    options=await prisma.model.findMany({include:{company:true},orderBy:{name:"asc"}});
    if(ids.length) models=await prisma.model.findMany({where:{OR:ids.flatMap((id)=>[{id},{slug:id}])},include:{company:true,providers:{include:{provider:true}},capabilities:{include:{capability:true}},prices:true,benchmarks:{include:{benchmark:true}}},take:3});
  } catch { error=true; }
  const lowestInput=models.reduce((best,item)=>{const value=Number(item.prices[0]?.inputPerM??Infinity);const bestValue=Number(best?.prices[0]?.inputPerM??Infinity);return value<bestValue?item:best;},null as typeof models[number]|null);
  const lowestOutput=models.reduce((best,item)=>{const value=Number(item.prices[0]?.outputPerM??Infinity);const bestValue=Number(best?.prices[0]?.outputPerM??Infinity);return value<bestValue?item:best;},null as typeof models[number]|null);
  const largest=models.reduce((best,item)=>item.contextWindow>(best?.contextWindow??0)?item:best,null as typeof models[number]|null);
  return <main className="page"><div className="container"><div className="page-title"><div><div className="eyebrow">Side-by-side</div><h1>Compare models</h1></div></div>
  <form className="toolbar"><select className="select" name="ids" multiple defaultValue={ids} style={{minWidth:280,minHeight:90}}>{options.map((model)=><option value={model.slug} key={model.id}>{model.name}</option>)}</select><button className="button" type="submit">Compare up to 3</button></form>
  {error?<div className="notice">Database unavailable. Configure <code>DATABASE_URL</code> and run migrations.</div>:models.length===0?<div className="notice">Choose up to three models to start comparing.</div>:<>
  <div className="compare-grid">{models.map((model)=>{const price=model.prices[0];const text=model.capabilities.some((item)=>item.capability.slug==="text");const image=model.capabilities.some((item)=>item.capability.slug==="image");const tools=model.capabilities.some((item)=>item.capability.slug==="tool-calling");return <div className="panel" style={{padding:20}} key={model.id}><span className="pill">{model.company.name}</span><h2>{model.name}</h2><div className="spec-grid" style={{gridTemplateColumns:"1fr 1fr"}}><div className="spec"><span>Input / 1M</span><strong style={lowestInput?.id===model.id?{color:"var(--accent-2)"}:undefined}>{price?`$${Number(price.inputPerM)}`:"—"}</strong></div><div className="spec"><span>Output / 1M</span><strong style={lowestOutput?.id===model.id?{color:"var(--accent-2)"}:undefined}>{price?`$${Number(price.outputPerM)}`:"—"}</strong></div><div className="spec"><span>Context</span><strong style={largest?.id===model.id?{color:"var(--accent-2)"}:undefined}>{model.contextWindow.toLocaleString()}</strong></div><div className="spec"><span>Max output</span><strong>{model.maxOutputTokens?.toLocaleString()??"—"}</strong></div><div className="spec"><span>Text</span><strong>{text?"Yes":"—"}</strong></div><div className="spec"><span>Image</span><strong>{image?"Yes":"No"}</strong></div><div className="spec"><span>Tool calling</span><strong>{tools?"Yes":"No"}</strong></div></div></div>;})}</div>
  <div className="notice" style={{marginTop:14}}>Green highlights identify the lowest input and output prices and largest context window within this selection. Benchmark scores are not summarized across different benchmarks.</div>
  </>}
  </div></main>;
}
