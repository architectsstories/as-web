import Link from 'next/link'

export const metadata = {
  title: 'Terms of Use | Architects Stories',
  description: 'Terms for using the Architects Stories website and submitting architecture projects and profiles.',
}

export default function TermsPage() {
  return (
    <main className="wrap prose-page">
      <div className="crumb"><Link href="/">Home</Link><span>/</span><span>Terms</span></div>
      <header className="prose-page-header">
        <div className="eyebrow-dot"><span className="dot" /><span>TERMS</span></div>
        <h1>Terms of Use</h1>
        <p>These terms describe the basic conditions for using Architects Stories and submitting material to the website.</p>
      </header>

      <section className="prose-section">
        <h2>Using the website</h2>
        <p>Use the site lawfully and do not interfere with its operation, submit misleading information, or use another person's work or personal information without permission. Website material is provided for general information about architecture, design, learning and the people featured here; it is not professional, technical or construction advice.</p>
      </section>

      <section className="prose-section">
        <h2>Project and profile submissions</h2>
        <p>When you submit a project, profile, image or other material, you confirm that the information is accurate to the best of your knowledge and that you have authority to provide it for review. Include correct credits for architects, photographers and collaborators.</p>
        <p>Submitting material does not guarantee publication. Please contact us if published facts or credits need correction. Copyright in submitted work remains with its respective owner; do not reuse material from this site without permission from the rights holder.</p>
      </section>

      <section className="prose-section">
        <h2>Features and photography services</h2>
        <p>Project consideration is free. Photography services are optional and separately described on our <Link href="/plans">plans page</Link>. Any service scope, price or booking condition shown there applies to that service.</p>
      </section>

      <section className="prose-section">
        <h2>Corrections and questions</h2>
        <p>We may update these terms as the site changes. For corrections, permission requests or questions, contact <a href="mailto:architectsstories@gmail.com">architectsstories@gmail.com</a>.</p>
      </section>
    </main>
  )
}
