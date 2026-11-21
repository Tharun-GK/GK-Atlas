import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const instant = false;


export default async function ProvidersPage() {
  let providers: Prisma.ProviderGetPayload<{ include: { _count: { select: { modelLinks: true } } } }>[] = [];
  let error=false;
  try { providers=await prisma.provider.findMany({ include:{_count:{select:{modelLinks:true}}}, orderBy:{name:"asc"} }); } catch { error=true; }
  return <main className="page"><div className="container"><div className="page-title"><div><div className="eyebrow">Inference ecosystem</div><h1>Providers</h1></div></div>
  {error ? <div className="notice">Database unavailable. Configure <code>DATABASE_URL</code> and run migrations.</div> : <div className="directory-grid">{providers.map((provider)=><Link className="directory-card" href={`/providers/${provider.slug}`} key={provider.id}><span className="pill">{provider._count.modelLinks} models</span><h3>{provider.name}</h3><p>{provider.description}</p><span style={{color:"var(--accent)",fontSize:12}}>Explore availability →</span></Link>)}</div>}
  </div></main>;
}
