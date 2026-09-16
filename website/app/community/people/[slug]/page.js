import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client } from '../../../../lib/sanity'
import { urlFor } from '../../../../lib/image'
import { personBySlugQuery } from '../../../../lib/queries'
import { formatRole } from '../../../../lib/formatRole'

export const revalidate = 60

export default async function PersonDetailPage({ params }) {
  const person = await client.fetch(personBySlugQuery, { slug: params.slug })

  if (!person) notFound()

  // Dereferencing drops nulls for any related project that isn't published
  // (or was deleted), so this only ever lists projects that are actually live.
  const relatedProjects = (person.relatedProjects || []).filter((p) => p && p.slug)

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
          <div style={{fontSize: 14.5, color: 'var(--grey)', marginBottom: 4}}>{formatRole(person)}</div>
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

      {relatedProjects.length > 0 && (
        <section style={{paddingTop: 0}}>
          <div className="section-head">
            <div className="eyebrow-dot"><span className="dot" /><h2>Projects</h2></div>
            <p className="section-lede">Published work connected to {person.name}.</p>
          </div>
          <div className="card-grid">
            {relatedProjects.map((p) => (
              <Link key={p.slug} className="card" href={`/projects/${p.slug}`}>
                <div className="thumb">
                  {p.mainImage && <img src={urlFor(p.mainImage).width(700).height(480).url()} alt={p.title} />}
                </div>
                <span className="cat">{p.category}</span>
                <h4>{p.title}</h4>
                <div className="sub">{p.studio}</div>
                <div className="meta">{p.location}{p.area ? ` — ${p.area}` : ''}{p.year ? ` · ${p.year}` : ''}</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
