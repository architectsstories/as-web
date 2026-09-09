import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { client } from '../../../lib/sanity'
import { urlFor } from '../../../lib/image'
import { projectBySlugQuery } from '../../../lib/queries'

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

  return (
    <div className="wrap">
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

      {project.description && (
        <div className="detail-body">
          <PortableText value={project.description} />
        </div>
      )}

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
