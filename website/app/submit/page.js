import Link from 'next/link'
import SubmitForm from '../../components/SubmitForm'

export const metadata = {
  title: 'Submit Your Work — Architects Stories',
  description: 'Have a project, idea or practice worth sharing? Submit your work for a feature on Architects Stories.',
}

export default function SubmitPage({ searchParams }) {
  const initialPlan = searchParams?.plan || ''

  return (
    <div className="wrap">
      <div className="crumb"><Link href="/">Home</Link><span>/</span><span style={{color: 'var(--black)'}}>Submit Work</span></div>

      <section style={{paddingTop: 0}}>
        <div className="eyebrow-dot"><span className="dot" /><h2>Submit Your Work<span className="red">.</span></h2></div>
        <p style={{fontSize: 15, color: 'var(--grey)', maxWidth: '56ch', marginTop: 10, marginBottom: 32}}>
          Have a project, idea or practice worth sharing? Tell us about it below.
        </p>

        <div className="submit-layout">
          <div className="submit-main">
            <SubmitForm initialPlan={initialPlan} />
          </div>

          <aside className="submit-sidebar">
            <div className="submit-sidebar-card">
              <h4>What's Included (Free)</h4>
              <ul className="submit-terms-mini">
                <li>Website feature</li>
                <li>1 Instagram carousel post (6–10 images)</li>
                <li>Full credits and tagging</li>
                <li>1 story share, added to highlights</li>
              </ul>
            </div>

            <div className="submit-sidebar-card">
              <h4>Don't Have Photography Yet?</h4>
              <p style={{fontSize: 13, color: 'var(--grey)', lineHeight: 1.6, marginBottom: 14}}>
                No problem — we can shoot it for you as a separate paid service.
              </p>
              <Link href="/plans#photography" className="submit-sidebar-link">Get Photography Plans →</Link>
            </div>

            <div className="submit-sidebar-card">
              <h4>Talk to a Human First</h4>
              <div className="submit-contact"><b>+91 97444 12828</b>Call or WhatsApp</div>
              <div className="submit-contact"><b>architectsstories@gmail.com</b>Email</div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
