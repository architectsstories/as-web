import Link from 'next/link'

export const metadata = {
  title: 'About Architects Stories',
  description: 'Learn how Architects Stories shares architecture projects, studio perspectives, learning and community profiles.',
}

export default function AboutPage() {
  return (
    <main className="wrap prose-page">
      <div className="crumb"><Link href="/">Home</Link><span>/</span><span>About</span></div>
      <header className="prose-page-header">
        <div className="eyebrow-dot"><span className="dot" /><span>ABOUT US</span></div>
        <h1>Architecture is made by people, places and ideas.</h1>
        <p>Architects Stories is an architecture media and community platform. We document built work, introduce the people behind it, and make practical learning easier to find.</p>
      </header>

      <section className="prose-section">
        <h2>What you will find here</h2>
        <p><Link href="/projects">Project features</Link> bring together the studio, location, category, year and project description so readers can understand the work beyond its photographs. Our <Link href="/stories">latest stories</Link> highlight selected projects and perspectives from architecture and design.</p>
        <p>The <Link href="/learn">learning section</Link> presents courses and programmes with their instructors, curriculum and outcomes. The <Link href="/community">community directory</Link> helps readers discover architects, practices, makers, professionals and material brands.</p>
      </section>

      <section className="prose-section">
        <h2>How project features are prepared</h2>
        <p>Many projects are submitted by the practices and collaborators who created them. We ask for project information, image credits and permission to share the material. Our team reviews submissions for relevance to architecture and design readers, completeness of information and suitability for publication.</p>
        <p>Published project pages identify the studio and available project details. Image galleries support the written description; they are not a substitute for it. We may ask contributors to clarify facts or credits before publication. A submission does not guarantee a feature.</p>
      </section>

      <section className="prose-section">
        <h2>Features and photography</h2>
        <p>Submitting a project for consideration is free. Professional photography is a separate optional service with the scope and prices shown on our <Link href="/plans">featuring and photography plans</Link> page. Buying a photography service does not guarantee that a project will be selected for editorial publication.</p>
      </section>

      <section className="prose-section">
        <h2>Share your work or ask us a question</h2>
        <p>Practices and collaborators can send project details through our <Link href="/submit">submission page</Link>. For other questions, visit <Link href="/contact">Contact</Link>.</p>
      </section>
    </main>
  )
}
