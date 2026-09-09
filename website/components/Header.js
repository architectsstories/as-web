import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header>
      <div className="nav">
        <Link href="/" className="logo">
          <Image src="/logo.png" alt="Architects Stories" width={160} height={54} style={{height: 38, width: 'auto'}} priority />
        </Link>
        <nav className="links">
          <Link href="/#stories">Stories</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/learn">Learn</Link>
          <Link href="/community">Community</Link>
        </nav>
        <div className="nav-right">
          <span className="nav-search">⌕ Search</span>
          <Link href="/#find">Submit</Link>
          <Link className="nav-cta" href="/#find">Join AS</Link>
        </div>
      </div>
    </header>
  )
}
