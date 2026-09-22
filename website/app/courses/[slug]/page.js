import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { client } from '../../../lib/sanity'
import { urlFor } from '../../../lib/image'
import { courseBySlugQuery } from '../../../lib/queries'
import { formatRole } from '../../../lib/formatRole'
import EnrollButton from '../../../components/EnrollButton'
import VerifiedBadge from '../../../components/VerifiedBadge'

export const revalidate = 60

export default async function CourseDetailPage({ params }) {
  const course = await client.fetch(courseBySlugQuery, { slug: params.slug })

  if (!course) {
    return (
      <div className="wrap">
        <div className="empty-state">Course not found.</div>
      </div>
    )
  }

  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Home</Link><span>/</span>
        <Link href="/courses">Learn</Link><span>/</span>
        <span style={{color:'var(--black)'}}>{course.title}</span>
      </div>

      <div className="detail-hero">
        {course.thumbnail && <img className="bg" src={urlFor(course.thumbnail).width(2000).url()} alt={course.title} />}
        <div className="scrim" />
        <div className="detail-hero-inner">
          <h1>{course.title}</h1>
        </div>
      </div>

      <div className="detail-meta-strip">
        {course.instructor && <div className="item"><div className="l">Instructor</div><div className="v">{course.instructor.name}{course.instructor.coaNumber && <VerifiedBadge />}</div></div>}
        <div className="item"><div className="l">Duration</div><div className="v">{course.duration || '—'}</div></div>
        <div className="item"><div className="l">Level</div><div className="v">{course.level || '—'}</div></div>
        <div className="item"><div className="l">Price</div><div className="v">{course.isFree ? 'Free' : `₹${course.price ?? '—'}`}</div></div>
      </div>

      <div style={{margin: '28px 0 40px'}}>
        <EnrollButton course={{title: course.title, slug: params.slug, ctaText: course.ctaText, ctaLink: course.ctaLink}} size="large" />
      </div>

      {course.description && (
        <div className="detail-body" style={{marginBottom: 32}}>
          <PortableText value={course.description} />
        </div>
      )}

      {course.outcomes?.length > 0 && (
        <div style={{marginBottom: 40}}>
          <h2 style={{fontSize: 19, textTransform: 'uppercase', marginBottom: 16}}>What You&apos;ll Learn</h2>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px'}}>
            {course.outcomes.map((o, i) => (
              <div key={i} style={{display: 'flex', gap: 10, fontSize: 14}}>
                <span style={{color: 'var(--red)', fontWeight: 700}}>＋</span>{o}
              </div>
            ))}
          </div>
        </div>
      )}

      {course.curriculum?.length > 0 && (
        <div style={{marginBottom: 40}}>
          <h2 style={{fontSize: 19, textTransform: 'uppercase', marginBottom: 8}}>Curriculum</h2>
          <div style={{borderTop: '1px solid var(--line)'}}>
            {course.curriculum.map((mod, i) => (
              <details key={i} style={{borderBottom: '1px solid var(--line)', padding: '18px 4px'}}>
                <summary style={{cursor: 'pointer', fontSize: 15, fontWeight: 600, display: 'flex', justifyContent: 'space-between'}}>
                  <span>{String(i + 1).padStart(2, '0')} — {mod.title}</span>
                  <span style={{color: 'var(--grey-light)', fontWeight: 400, fontSize: 13}}>{mod.length}</span>
                </summary>
                <p style={{fontSize: 13.5, color: 'var(--grey)', marginTop: 10, maxWidth: '60ch'}}>{mod.description}</p>
              </details>
            ))}
          </div>
        </div>
      )}


      {(course.benefits?.length > 0 || course.tools?.length > 0) && (
        <section className="course-extra-section">
          {course.benefits?.length > 0 && (
            <div className="course-benefits-block">
              <div className="course-extra-heading">
                <span>01</span>
                <h2>Course Benefits</h2>
              </div>
              <div className="course-benefits-grid">
                {course.benefits.map((benefit, i) => (
                  <div key={i} className="course-benefit-item">
                    <span className="course-benefit-index">{String(i + 1).padStart(2, '0')}</span>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {course.tools?.length > 0 && (
            <div className="course-tools-block">
              <div className="course-extra-heading">
                <span>02</span>
                <h2>Course Outcome</h2>
              </div>
              <div className="course-tools-label">Tools</div>
              <div className="course-tools-list">
                {course.tools.map((tool, i) => (
                  <span key={i} className="course-tool-pill">{tool}</span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {course.instructor && (
        <div style={{display: 'flex', gap: 20, alignItems: 'center', padding: 28, background: 'var(--off)', borderRadius: 2, marginBottom: 40}}>
          {course.instructor.photo && (
            <img
              src={urlFor(course.instructor.photo).width(150).height(150).url()}
              alt={course.instructor.name}
              style={{width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', flex: 'none'}}
            />
          )}
          <div>
            <h4 style={{fontSize: 16}}>{course.instructor.name}{course.instructor.coaNumber && <VerifiedBadge />}</h4>
            <div style={{fontSize: 13, color: 'var(--grey)', marginTop: 4}}>
              {formatRole(course.instructor)}{course.instructor.location ? ` — ${course.instructor.location}` : ''}
            </div>
            {course.instructor.bio && (
              <p style={{fontSize: 13, color: 'var(--grey)', marginTop: 10, maxWidth: '52ch', lineHeight: 1.55}}>
                {course.instructor.bio}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
