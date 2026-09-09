import Link from 'next/link'
import { client } from '../../lib/sanity'
import { urlFor } from '../../lib/image'
import { allStoriesQuery } from '../../lib/queries'

export const revalidate = 60

export default async function StoriesPage() {
  const stories = await client.fetch(allStoriesQuery)

  return (
    <div className="wrap">
      <div className="crumb"><Link href="/">Home</Link><span>/</span><span style={{color:'var(--black)'}}>Stories</span></div>
      <section style={{paddingTop: 0}}>
        <div className="section-head">
          <div className="eyebrow-dot"><span className="dot" /><h2>All Stories</h2></div>
        </div>
        {stories.length === 0 ? (
          <div className="empty-state">No stories published yet. Add one in the Admin Panel.</div>
        ) : (
          <div className="card-grid">
            {stories.map((s) => (
              <Link key={s.slug} className="card" href={`/stories/${s.slug}`}>
                <div className="thumb">
                  {s.mainImage && <img src={urlFor(s.mainImage).width(700).height(480).url()} alt={s.title} />}
                </div>
                <span className="cat">{s.category}</span>
                <h4>{s.title}</h4>
                <div className="sub">{s.studio}</div>
                <div className="meta">{s.location}{s.year ? ` · ${s.year}` : ''}</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
