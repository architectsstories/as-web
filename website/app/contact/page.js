import Link from 'next/link'

export const metadata = {
  title: 'Contact Architects Stories',
  description: 'Contact the Architects Stories team about project submissions, community profiles, learning and partnerships.',
}

export default function ContactPage() {
  return (
    <main className="wrap prose-page">
      <div className="crumb"><Link href="/">Home</Link><span>/</span><span>Contact</span></div>
      <header className="prose-page-header">
        <div className="eyebrow-dot"><span className="dot" /><span>CONTACT</span></div>
        <h1>Talk to the Architects Stories team.</h1>
        <p>For project features, profile updates, learning programmes and general questions, contact us directly. We aim to reply within three to five working days.</p>
      </header>

      <section className="contact-options" aria-label="Contact options">
        <article className="contact-option">
          <h2>Email</h2>
          <p>Send project information, credits, partnership enquiries or corrections.</p>
          <a href="mailto:architectsstories@gmail.com">architectsstories@gmail.com</a>
        </article>
        <article className="contact-option">
          <h2>Call or WhatsApp</h2>
          <p>For a quick question about submitting work or our photography services.</p>
          <a href="tel:+919744412828">+91 97444 12828</a>
        </article>
      </section>

      <section className="prose-section">
        <h2>Submitting a project</h2>
        <p>Use the <Link href="/submit">Submit Your Work</Link> page to share project details, credits and a link to your images. Please include only material you have permission to share.</p>
      </section>
    </main>
  )
}
