import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const instant = false;


export default async function ProviderDetail({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const provider=await prisma.provider.findFirst({where:{OR:[{slug},{id:slug}]},include:{modelLinks:{include:{model:{include:{company:true,prices:true}}}}}}).catch(()=>null);
  if(!provider) notFound();
  return <main className="page"><div className="container"><div className="page-title"><div><div className="eyebrow">Inference provider</div><h1>{provider.name}</h1></div>{provider.website&&<a className="button secondary" href={provider.website} target="_blank" rel="noreferrer">Official website</a>}</div><p style={{color:"var(--muted)",lineHeight:1.7}}>{provider.description}</p><div className="table-wrap" style={{marginTop:28}}><table><thead><tr><th>Model</th><th>Company</th><th>Input / 1M</th><th>Status</th></tr></thead><tbody>{provider.modelLinks.map((link)=>{const price=link.model.prices[0];return <tr key={link.id}><td><Link href={`/models/${link.model.slug}`} style={{fontWeight:700}}>{link.model.name}</Link></td><td>{link.model.company.name}</td><td>{price?`$${Number(price.inputPerM)}`:"—"}</td><td><span className="pill">{link.isVerified?"Verified":"Listed"}</span></td></tr>;})}</tbody></table></div></div></main>;
}
