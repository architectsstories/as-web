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
              <h4>Price Cheat-Sheet</h4>
              <ul className="submit-price-list">
                <li><span>Essential</span><span className="submit-price-free">Free</span></li>
                <li><span>Studio</span><span>₹12,000</span></li>
                <li><span>Showcase</span><span>₹20,000</span></li>
                <li><span>Signature</span><span>₹35,000</span></li>
              </ul>
              <Link href="/plans" className="submit-sidebar-link">View full plans →</Link>
            </div>

            <div className="submit-sidebar-card">
              <h4>Talk to a Human First</h4>
              <div className="submit-contact"><b>Naseef VP</b>Founder, Architects Stories</div>
              <div className="submit-contact"><b>+91 97444 12828</b>Call or WhatsApp</div>
              <div className="submit-contact"><b>architectsstories@gmail.com</b>Email</div>
            </div>

            <div className="submit-sidebar-card">
              <h4>Before You Submit</h4>
              <ul className="submit-terms-mini">
                <li>50% advance confirms the booking</li>
                <li>Full credits (architect, photographer, collaborators) are required</li>
                <li>Drive link sharing must be set to "Anyone with the link"</li>
                <li>We'll respond within 3–5 working days</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
