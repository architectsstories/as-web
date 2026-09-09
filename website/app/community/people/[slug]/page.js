import Link from 'next/link'
import { client } from '../../../../lib/sanity'
import { urlFor } from '../../../../lib/image'
import { personBySlugQuery } from '../../../../lib/queries'

export const revalidate = 60

export default async function PersonDetailPage({ params }) {
  const person = await client.fetch(personBySlugQuery, { slug: params.slug })

  if (!person) {
    return (
      <div className="wrap">
        <div className="empty-state">Person not found.</div>
      </div>
    )
  }

  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Home</Link><span>/</span>
        <Link href="/community">Community</Link><span>/</span>
        <span style={{color: 'var(--black)'}}>{person.name}</span>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '260px 1fr', gap: 40, alignItems: 'start', marginBottom: 40}}>
        <div className="ph" style={{aspectRatio: '1/1.05', borderRadius: 2, overflow: 'hidden', background: 'var(--off)'}}>
          {person.photo && (
            <img
              src={urlFor(person.photo).width(600).height(630).url()}
              alt={person.name}
              style={{width: '100%', height: '100%', objectFit: 'cover'}}
            />
          )}
        </div>
        <div>
          <h1 style={{fontSize: 30, textTransform: 'uppercase', marginBottom: 8}}>{person.name}</h1>
          <div style={{fontSize: 14.5, color: 'var(--grey)', marginBottom: 4}}>{person.role}</div>
          <div style={{fontSize: 13, color: 'var(--grey-light)', marginBottom: 20}}>{person.location}</div>
          {person.bio && (
            <p style={{fontSize: 14.5, lineHeight: 1.7, color: 'var(--grey)', maxWidth: '60ch'}}>{person.bio}</p>
          )}
          {person.portfolioUrl && (
            <a
              className="cta-btn sm"
              href={person.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{display: 'inline-block', marginTop: 20}}
            >
              View Portfolio →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
