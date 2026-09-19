'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { urlFor } from '../lib/image'
import { formatRole } from '../lib/formatRole'
import { personCategory } from '../lib/roleToCategory'
import VerifiedBadge from './VerifiedBadge'

const CATEGORIES = ['Architects', 'Designers', 'Studios', 'Makers', 'Mentors', 'Material Brands']

export default function PeopleDirectory({ people, initialQuery = '', initialLocation = '', initialCategory = '' }) {
  const [query, setQuery] = useState(initialQuery)
  const [location, setLocation] = useState(initialLocation)
  const [category, setCategory] = useState(initialCategory)

  const locations = useMemo(
    () => Array.from(new Set(people.map((p) => p.location).filter(Boolean))).sort(),
    [people]
  )

  const filtered = people.filter((p) => {
    const roleLabel = formatRole(p).toLowerCase()
    const matchesQuery =
      !query ||
      p.name?.toLowerCase().includes(query.toLowerCase()) ||
      roleLabel.includes(query.toLowerCase())
    const matchesLocation = !location || p.location === location
    const matchesCategory = !category || personCategory(p) === category
    return matchesQuery && matchesLocation && matchesCategory
  })

  return (
    <>
      <div className="search-row" style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by name or role…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">All Locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <button type="button" onClick={() => { /* filtering already happens live */ }}>Search →</button>
      </div>

      <div className="filter-tabs" style={{ marginBottom: 32 }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={category === c ? 'active' : ''}
            onClick={() => setCategory(category === c ? '' : c)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No people match those filters.</div>
      ) : (
        <div className="people-grid">
          {filtered.map((p) => (
            <Link className="person" key={p.slug} href={`/community/people/${p.slug}`}>
              <div className="ph">
                {p.photo && <img src={urlFor(p.photo).width(400).height(420).url()} alt={p.name} />}
              </div>
              <h4>{p.name}{p.coaNumber && <VerifiedBadge />}</h4>
              {formatRole(p) && <div className="role">{formatRole(p)}</div>}
              {p.location && <div className="loc">{p.location}</div>}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
