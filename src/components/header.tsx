import { Search } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark">G</span>
          <span>GK Atlas</span>
        </Link>
        <nav className="nav" aria-label="Primary navigation">
          <Link href="/models">Explore</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/rankings">Rankings</Link>
          <Link href="/labs">AI Labs</Link>
          <Link href="/providers">Providers</Link>
        </nav>
        <form className="header-search" action="/models" role="search">
          <div style={{ position:"relative" }}>
            <Search size={15} style={{ position:"absolute", left:12, top:13, color:"#7d8799" }} />
            <input className="input" name="q" placeholder="Search models" aria-label="Search models" style={{ paddingLeft:34, width:"100%" }} />
          </div>
        </form>
      </div>
    </header>
  );
}
