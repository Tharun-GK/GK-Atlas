import { prisma } from "@/lib/prisma";
import { RankingChart } from "@/components/ranking-chart";
import type { Prisma } from "@prisma/client";

export const instant = false;


export default async function RankingsPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const params=await searchParams;
  const category=typeof params.category==="string"?params.category:"general-performance";
  let benchmark: Prisma.BenchmarkGetPayload<{ include: { modelScores: { include: { model: { include: { company: true } } } } } }> | null = null;
  let error=false;
  try { benchmark=await prisma.benchmark.findUnique({where:{slug:category},include:{modelScores:{include:{model:{include:{company:true}}},orderBy:{score:"desc"},take:20}}}); } catch { error=true; }
  const scores=benchmark?.modelScores.map((item)=>({name:item.model.name,score:Number(item.score)})) ?? [];
  return <main className="page"><div className="container"><div className="page-title"><div><div className="eyebrow">Demonstration leaderboard</div><h1>Rankings</h1></div></div>
  <form className="toolbar"><select className="select" name="category" defaultValue={category}><option value="general-performance">General performance</option><option value="coding">Coding</option><option value="reasoning">Reasoning</option><option value="mathematics">Mathematics</option></select><button className="button secondary" type="submit">View category</button></form>
  {error?<div className="notice">Database unavailable. Configure <code>DATABASE_URL</code> and run migrations.</div>:!benchmark?<div className="notice">No benchmark category found.</div>:<>
  <div className="notice" style={{marginBottom:14}}>All scores on this page are <strong>sample demonstration data</strong>, not verified external benchmark results. Do not compare incompatible evaluations as equivalent.</div>
  <div className="chart-panel"><RankingChart data={scores}/></div>
  <div className="table-wrap" style={{marginTop:14}}><table><thead><tr><th>Position</th><th>Model</th><th>Company</th><th>Score</th><th>Status</th><th>Updated</th></tr></thead><tbody>{benchmark.modelScores.map((item,index)=><tr key={item.id}><td><strong>#{index+1}</strong></td><td>{item.model.name}</td><td>{item.model.company.name}</td><td>{Number(item.score).toFixed(1)}</td><td>{item.isVerified?"Verified":"Demo"}</td><td>{item.lastUpdatedAt.toLocaleDateString()}</td></tr>)}</tbody></table></div>
  </>}
  </div></main>;
}
