import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | Architects Stories',
  description: 'How Architects Stories handles information submitted through the website and data used for analytics and advertising.',
}

export default function PrivacyPage() {
  return (
    <main className="wrap prose-page">
      <div className="crumb"><Link href="/">Home</Link><span>/</span><span>Privacy</span></div>
      <header className="prose-page-header">
        <div className="eyebrow-dot"><span className="dot" /><span>PRIVACY</span></div>
        <h1>Privacy Policy</h1>
        <p>This page explains what information the Architects Stories website receives and how it is used when you browse the site or contact us.</p>
      </header>

      <section className="prose-section">
        <h2>Information you provide</h2>
        <p>When you submit a project, apply to join the community or enrol in a programme, we receive the information you enter. This can include your name, email address, phone number, professional or project details, links, messages, and an optional profile photo. Please do not submit information you do not have permission to share.</p>
        <p>We use this information to review and manage submissions, respond to enquiries, maintain community profiles and administer enrolments. Website submissions are handled through our content management service, Sanity. You can contact us to request a correction or removal of information you submitted.</p>
      </section>

      <section className="prose-section">
        <h2>Analytics and project view counts</h2>
        <p>We use Google Analytics to understand how visitors use the website, such as which pages are visited and general device or browser information. Project pages also send a page-view count to our content system so we can show popular projects. The project counter records an aggregate count and does not require you to create an account.</p>
      </section>

      <section className="prose-section">
        <h2>Advertising and cookies</h2>
        <p>The website includes Google AdSense code. If advertising is served, Google and its partners may use cookies or similar technologies to deliver, measure and limit advertising, subject to your settings and Google's policies. You can review or change your Google ad-personalization settings through <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">My Ad Center</a> and manage cookies in your browser.</p>
        <p>Learn more about how Google uses data from sites that use its services in <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google's partner-site privacy information</a>.</p>
      </section>

      <section className="prose-section">
        <h2>Third-party services and links</h2>
        <p>We use Google Analytics and Google AdSense, and Sanity to manage website content and form submissions. Their handling of information is also governed by their own privacy policies. Links to other websites are provided for convenience; their privacy practices are outside our control.</p>
      </section>

      <section className="prose-section">
        <h2>Contact us</h2>
        <p>For a privacy question or a request to correct or remove information you submitted, email <a href="mailto:architectsstories@gmail.com">architectsstories@gmail.com</a>. For other enquiries, see our <Link href="/contact">contact page</Link>.</p>
      </section>
    </main>
  )
}
