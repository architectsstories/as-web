import Link from 'next/link'
import { client } from '../../lib/sanity'
import { urlFor } from '../../lib/image'
import { allProjectsQuery } from '../../lib/queries'

export const revalidate = 60

export default async function ProjectsPage() {
  const projects = await client.fetch(allProjectsQuery)

  return (
    <div className="wrap">
      <div className="crumb"><Link href="/">Home</Link><span>/</span><span style={{color:'var(--black)'}}>Projects</span></div>
      <section style={{paddingTop: 0}}>
        <div className="section-head">
          <div className="eyebrow-dot"><span className="dot" /><h2>All Projects</h2></div>
        </div>
        {projects.length === 0 ? (
          <div className="empty-state">No projects published yet. Add one in the Admin Panel.</div>
        ) : (
          <div className="card-grid">
            {projects.map((p) => (
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
        )}
      </section>
    </div>
  )
}
