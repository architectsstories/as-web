import Link from 'next/link'
import { client } from '../../lib/sanity'
import { allCoursesQuery } from '../../lib/queries'

export const revalidate = 60

export default async function CoursesPage() {
  const courses = await client.fetch(allCoursesQuery)

  return (
    <div className="wrap">
      <div className="crumb"><Link href="/">Home</Link><span>/</span><span style={{color:'var(--black)'}}>Learn</span></div>
      <section style={{paddingTop: 0}}>
        <div className="section-head">
          <div className="eyebrow-dot"><span className="dot" /><h2>All Programmes</h2></div>
        </div>
        {courses.length === 0 ? (
          <div className="empty-state">No courses published yet. Add one in the Admin Panel.</div>
        ) : (
          <div className="learn-page-grid">
            {courses.map((c) => (
              <div key={c.slug} className="learn-page-card">
                <div className="learn-page-card-top">
                  <span className="learn-page-badge">{c.category}</span>
                  <span className="learn-page-mode">{c.mode || 'Offline'}</span>
                </div>
                <h4>{c.title}</h4>
                <div className="learn-page-meta">{c.duration || ''}</div>
                <Link className="learn-page-cta" href={`/learn/${c.slug}`}>View Programme Breakdown</Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
