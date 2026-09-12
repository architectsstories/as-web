import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { client } from '../../../lib/sanity'
import { urlFor } from '../../../lib/image'
import { projectBySlugQuery } from '../../../lib/queries'
import { formatRole } from '../../../lib/formatRole'
import TrackProjectView from '../../../components/TrackProjectView'

export const revalidate = 60

export default async function ProjectDetailPage({ params }) {
  const project = await client.fetch(projectBySlugQuery, { slug: params.slug })

  if (!project) {
    return (
      <div className="wrap">
        <div className="empty-state">Project not found.</div>
      </div>
    )
  }

  const relatedPeople = (project.relatedPeople || []).filter((p) => p && p.slug)

  return (
    <div className="wrap">
      <TrackProjectView slug={params.slug} />
      <div className="crumb">
        <Link href="/">Home</Link><span>/</span>
        <Link href="/projects">Projects</Link><span>/</span>
        <span style={{color:'var(--black)'}}>{project.title}</span>
      </div>

      <div className="detail-hero">
        {project.mainImage && <img className="bg" src={urlFor(project.mainImage).width(2000).url()} alt={project.title} />}
        <div className="scrim" />
        <div className="detail-hero-inner">
          <h1>{project.title}</h1>
        </div>
      </div>

      <div className="detail-meta-strip">
        <div className="item"><div className="l">Studio</div><div className="v">{project.studio || '—'}</div></div>
        <div className="item"><div className="l">Location</div><div className="v">{project.location || '—'}</div></div>
        <div className="item"><div className="l">Category</div><div className="v">{project.category || '—'}</div></div>
        <div className="item"><div className="l">Area</div><div className="v">{project.area || '—'}</div></div>
        <div className="item"><div className="l">Year</div><div className="v">{project.year || '—'}</div></div>
      </div>

      <div className={`detail-row${relatedPeople.length ? ' has-people' : ''}`}>
        {project.description && (
          <div className="detail-body">
            <PortableText value={project.description} />
          </div>
        )}

        {relatedPeople.length > 0 && (
          <aside className="people-side">
            <div className="people-side-head">Project By</div>
            {relatedPeople.map((p) => (
              <Link key={p.slug} className="people-side-card" href={`/community/people/${p.slug}`}>
                <div className="people-side-ph">
                  {p.photo && <img src={urlFor(p.photo).width(120).height(120).url()} alt={p.name} />}
                </div>
                <div>
                  <div className="people-side-name">{p.name}</div>
                  <div className="people-side-role">{formatRole(p)}</div>
                </div>
              </Link>
            ))}
          </aside>
        )}
      </div>

      {project.gallery?.length > 0 && (
        <div className="gallery-grid">
          {project.gallery.map((img, i) => (
            <img key={i} src={urlFor(img).width(900).height(675).url()} alt={`${project.title} ${i + 1}`} />
          ))}
        </div>
      )}
    </div>
  )
}
