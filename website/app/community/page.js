import Link from 'next/link'
import { client } from '../../lib/sanity'
import { urlFor } from '../../lib/image'
import { upcomingEventsQuery, pastEventsQuery, allPeopleQuery } from '../../lib/queries'
import PeopleDirectory from '../../components/PeopleDirectory'

export const revalidate = 60

function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default async function CommunityPage({ searchParams }) {
  const params = await searchParams
  const q = params?.q || ''
  const location = params?.location || ''
  const category = params?.category || ''

  const [people, upcoming, past] = await Promise.all([
    client.fetch(allPeopleQuery),
    client.fetch(upcomingEventsQuery),
    client.fetch(pastEventsQuery),
  ])

  return (
    <div className="wrap">
      <div className="crumb"><Link href="/">Home</Link><span>/</span><span style={{color: 'var(--black)'}}>Community</span></div>

      <section style={{paddingTop: 0}}>
        <div className="section-head">
          <div className="eyebrow-dot"><span className="dot" /><h2>Find Your People</h2></div>
        </div>
        {people.length === 0 ? (
          <div className="empty-state">No people published yet — add some in the Admin Panel.</div>
        ) : (
          <PeopleDirectory people={people} initialQuery={q} initialLocation={location} initialCategory={category} />
        )}
      </section>

      <section>
        <div className="section-head">
          <div className="eyebrow-dot"><span className="dot" /><h2>Upcoming Events</h2></div>
        </div>
        {upcoming.length === 0 ? (
          <div className="empty-state">No upcoming events right now — check back soon.</div>
        ) : (
          <div className="learn-page-grid">
            {upcoming.map((e) => (
              <div key={e.slug} className="learn-page-card">
                {e.coverImage && (
                  <div className="event-cover">
                    <img src={urlFor(e.coverImage).width(700).height(420).url()} alt={e.title} />
                  </div>
                )}
                <div className="learn-page-card-top">
                  <span className="learn-page-badge">{e.category || 'Event'}</span>
                  <span className="learn-page-mode">{e.mode || 'Offline'}</span>
                </div>
                <h4>{e.title}</h4>
                <div className="learn-page-meta">
                  {formatDate(e.startDateTime)}{e.location ? ` · ${e.location}` : ''}
                </div>
                {e.rsvpLink ? (
                  <a className="learn-page-cta" href={e.rsvpLink} target="_blank" rel="noopener noreferrer">
                    {e.ctaText || 'RSVP Now'}
                  </a>
                ) : (
                  <span className="learn-page-cta" style={{opacity: 0.5, pointerEvents: 'none'}}>Details Coming Soon</span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <div className="section-head">
            <div className="eyebrow-dot"><span className="dot" /><h2>Past Events</h2></div>
          </div>
          <div className="card-grid">
            {past.map((e) => (
              <div key={e.slug} className="card">
                <div className="thumb">
                  {e.coverImage && <img src={urlFor(e.coverImage).width(700).height(480).url()} alt={e.title} />}
                </div>
                <span className="cat">{e.category || 'Event'}</span>
                <h4>{e.title}</h4>
                <div className="sub">{formatDate(e.startDateTime)}</div>
                <div className="meta">{e.location || ''}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
