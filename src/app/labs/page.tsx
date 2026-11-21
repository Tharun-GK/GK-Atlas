import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const instant = false;


export default async function LabsPage() {
  let companies: Prisma.CompanyGetPayload<{ include: { _count: { select: { models: true } } } }>[] = [];
  let error = false;
  try { companies = await prisma.company.findMany({ include:{ _count:{ select:{ models:true } } }, orderBy:{ name:"asc" } }); } catch { error=true; }
  return (
    <main className="page"><div className="container">
      <div className="page-title"><div><div className="eyebrow">Research organizations</div><h1>AI Labs</h1></div></div>
      {error ? <div className="notice">Database unavailable. Configure <code>DATABASE_URL</code> and run migrations.</div> :
      <div className="directory-grid">{companies.map((company) => <Link className="directory-card" href={`/labs/${company.slug}`} key={company.id}><span className="pill">{company._count.models} models</span><h3>{company.name}</h3><p>{company.description}</p>{company.website && <span style={{color:"var(--accent)",fontSize:12}}>Visit website →</span>}</Link>)}</div>}
    </div></main>
  );
}
