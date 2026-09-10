'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()

  function handleSearchSubmit(e) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/community?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <header>
      <div className="nav">
        <Link href="/" className="logo">
          <Image src="/logo.png" alt="Architects Stories" width={160} height={54} className="logo-img" priority />
        </Link>
        <nav className="links">
          <Link href="/#stories">Stories</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/learn">Learn</Link>
          <Link href="/community">Community</Link>
        </nav>
        <div className="nav-right">
          <form className={`nav-search-wrap${searchOpen ? ' open' : ''}`} onSubmit={handleSearchSubmit}>
            {searchOpen && (
              <input
                type="text"
                autoFocus
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => { if (!query) setSearchOpen(false) }}
              />
            )}
            <button
              type={searchOpen ? 'submit' : 'button'}
              className="nav-search"
              onClick={() => { if (!searchOpen) setSearchOpen(true) }}
              aria-label="Search"
            >
              ⌕ Search
            </button>
          </form>
          <Link className="nav-btn-outline" href="/submit">Get Featured</Link>
          <Link className="nav-cta" href="/join">Join Community</Link>
          <button
            className={`nav-burger${mobileOpen ? ' open' : ''}`}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="mobile-menu">
          <nav className="mobile-links">
            <Link href="/#stories" onClick={() => setMobileOpen(false)}>Stories</Link>
            <Link href="/projects" onClick={() => setMobileOpen(false)}>Projects</Link>
            <Link href="/learn" onClick={() => setMobileOpen(false)}>Learn</Link>
            <Link href="/community" onClick={() => setMobileOpen(false)}>Community</Link>
          </nav>
        </div>
      )}
    </header>
  )
}
