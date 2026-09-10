'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
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
          <Image src="/logo.png" alt="Architects Stories" width={160} height={54} style={{height: 38, width: 'auto'}} priority />
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
          <Link className="nav-btn-outline" href="/submit">Feature</Link>
          <Link className="nav-cta" href="/join">Join Community</Link>
        </div>
      </div>
    </header>
  )
}
