import Link from 'next/link'
import { client } from '../../lib/sanity'
import { urlFor } from '../../lib/image'
import { allCoursesQuery } from '../../lib/queries'

export const revalidate = 60

export default async function CoursesPage() {
  const courses = await client.fetch(allCoursesQuery)

  return (
    <div className="wrap">
      <div className="crumb"><Link href="/">Home</Link><span>/</span><span style={{color:'var(--black)'}}>Learn</span></div>
      <section style={{paddingTop: 0}}>
        <div className="section-head">
          <div className="eyebrow-dot"><span className="dot" /><h2>Learn with AS</h2></div>
        </div>
        {courses.length === 0 ? (
          <div className="empty-state">No courses published yet. Add one in the Admin Panel.</div>
        ) : (
          <div className="card-grid">
            {courses.map((c) => (
              <Link key={c.slug} className="card" href={`/courses/${c.slug}`}>
                <div className="thumb">
                  {c.thumbnail && <img src={urlFor(c.thumbnail).width(700).height(480).url()} alt={c.title} />}
                </div>
                <span className="cat">{c.category}</span>
                <h4>{c.title}</h4>
                <div className="sub">{c.instructor?.name}</div>
                <div className="meta">{c.isFree ? 'Free' : `₹${c.price}`}{c.duration ? ` · ${c.duration}` : ''}</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
