import Link from 'next/link'
import { client } from '../lib/sanity'
import { urlFor } from '../lib/image'
import { homepageQuery, recentProjectsQuery } from '../lib/queries'
import { excerptFromBlocks } from '../lib/excerpt'
import { formatRole } from '../lib/formatRole'
import HeroCarousel from '../components/HeroCarousel'
import PublicationCard from '../components/PublicationCard'

export const revalidate = 60 // re-fetch from Sanity at most once a minute

export default async function HomePage() {
  const [data, recentRaw] = await Promise.all([
    client.fetch(homepageQuery),
    client.fetch(recentProjectsQuery),
  ])

  const recentPosts = recentRaw.map((p) => ({ ...p, excerpt: excerptFromBlocks(p.description) }))

  const heroSlides = data?.heroSlides || []
  const latestProjects = data?.latestProjects || [] // newest projects, shown automatically in "Latest Stories"
  const courses = data?.featuredCourses || []
  const vendors = data?.featuredVendors || [] // curated in Admin Panel → Featured → Vendors & Brands
  const professionals = data?.featuredIndustryProfessionals || [] // curated in Admin Panel → Featured → Industry Professionals

  return (
    <>
      {/* HERO */}
      <HeroCarousel slides={heroSlides} />

      {/* LATEST STORIES — automatically the newest published projects, no curation needed */}
      <section id="stories">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow-dot"><span className="dot" /><h2>Latest Stories</h2></div>
              <p className="section-lede">Ideas, projects and conversations from the world of architecture.</p>
            </div>
            <Link className="view-all" href="/projects">View All Projects →</Link>
          </div>
          {latestProjects.length === 0 ? (
            <div className="empty-state">No stories yet — toggle "Show in Latest Stories" on a project in the Admin Panel to feature it here.</div>
          ) : (
            <div className="stories-grid">
              {latestProjects[0] && (
                <Link className="story-lead" href={`/projects/${latestProjects[0].slug}`}>
                  <div className="thumb">
                    {latestProjects[0].mainImage && (
                      <img src={urlFor(latestProjects[0].mainImage).width(900).height(690).url()} alt={latestProjects[0].title} />
                    )}
                  </div>
                  <div className="meta-row">
                    <div>
                      <span className="cat">{latestProjects[0].category}</span>
                      <h3>{latestProjects[0].title}</h3>
                      <p className="sub">{[latestProjects[0].location, latestProjects[0].studio].filter(Boolean).join(' — ')}</p>
                    </div>
                    <span className="arrow-circle">→</span>
                  </div>
                </Link>
              )}
              <div className="story-mini-grid">
                {latestProjects.slice(1, 5).map((p) => (
                  <Link key={p.slug} className="story-mini" href={`/projects/${p.slug}`}>
                    <div className="thumb">
                      {p.mainImage && <img src={urlFor(p.mainImage).width(560).height(370).url()} alt={p.title} />}
                    </div>
                    <span className="cat">{p.category}</span>
                    <h4>{p.title}</h4>
                    <div className="read">{p.studio}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* THE ARCHITECTURE ECOSYSTEM (static) */}
      <section id="ecosystem">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow-dot"><span className="dot" /><h2>The Architecture Ecosystem<span className="red">.</span></h2></div>
            <Link className="head-btn" href="/join">Join the Ecosystem →</Link>
          </div>

          <div className="eco-grid">
            <Link className="eco-card" href="/community?category=Architects">
              <h3>Architects &amp; Firms</h3>
              <p>Firms, architects and young practices building their body of work.</p>
              <span className="arrow-circle">→</span>
            </Link>
            <Link className="eco-card" href="/community?category=Material%20Brands">
              <h3>Vendors &amp; Brands</h3>
              <p>Materials, lighting, furniture, surfaces, hardware and technology.</p>
              <span className="arrow-circle">→</span>
            </Link>
            <Link className="eco-card" href="/community?category=Makers">
              <h3>Industry Professionals</h3>
              <p>Visualisers, photographers, consultants, contractors and fabricators.</p>
              <span className="arrow-circle">→</span>
            </Link>
            <Link className="eco-card" href="/community">
              <h3>Community</h3>
              <p>Learning, opportunities and events for the next generation.</p>
              <span className="arrow-circle">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED VENDORS & BRANDS — curated in Admin Panel / Featured */}
      <section id="vendors">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow-dot"><span className="dot" /><h2>Featured Vendors &amp; Brands</h2></div>
              <p className="section-lede">Materials, lighting, furniture and surfaces — trusted by studios featured on AS.</p>
            </div>
            <Link className="view-all" href="/community?category=Material%20Brands">Explore All Vendors →</Link>
          </div>

          {vendors.length === 0 ? (
            <div className="empty-state">No featured vendors yet — add some in the Admin Panel's Featured module (Vendors &amp; Brands).</div>
          ) : (
            <div className="vendor-layout">
              <Link className="vendor-spotlight" href={`/community/people/${vendors[0].slug}`}>
                <div
                  className="shot"
                  style={vendors[0].photo ? { backgroundImage: `url(${urlFor(vendors[0].photo).width(900).height(560).url()})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                >
                  <span className="brand-chip">{vendors[0].name}</span>
                </div>
                <div className="info">
                  <div className="cat">{vendors[0].roleCustom || formatRole(vendors[0])}</div>
                  <h3>Featured Brand of the Month</h3>
                  <p>{vendors[0].bio || `Trusted by studios featured on AS${vendors[0].location ? ` — ${vendors[0].location}` : ''}.`}</p>
                  <span className="explore">View Profile →</span>
                </div>
              </Link>

              <div className="vendor-mini-grid">
                {vendors.slice(1, 5).map((v) => (
                  <Link className="vendor-mini" key={v.slug} href={`/community/people/${v.slug}`}>
                    <div className="logo-row">
                      {v.photo ? (
                        <img src={urlFor(v.photo).width(160).height(112).url()} alt={v.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                      ) : (
                        <span>{v.name}</span>
                      )}
                    </div>
                    <h4>{v.name}</h4>
                    <div className="cat">{v.roleCustom || formatRole(v)}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="vendor-cta-row">
            <p>Are you a materials or product brand studios should know about?</p>
            <Link href="/submit">List Your Brand →</Link>
          </div>
        </div>
      </section>

      {/* FIND YOUR PEOPLE (search + category links to /community) */}
      <section id="find">
        <div className="wrap">
          <div className="find-grid">
            <div>
              <div className="eyebrow-dot"><span className="dot" /><h2>Find your people<span className="red">.</span></h2></div>
              <p className="section-lede">Architects, designers, studios, makers and more.</p>
              <form className="search-row" action="/community" method="GET">
                <input type="text" name="q" placeholder="What are you looking for?" />
                <input type="text" name="location" placeholder="Where?" />
                <button type="submit">Search →</button>
              </form>
              <div className="filter-tabs">
                <Link href="/community?category=Architects">Architects</Link>
                <Link href="/community?category=Designers">Designers</Link>
                <Link href="/community?category=Studios">Studios</Link>
                <Link href="/community?category=Makers">Makers</Link>
                <Link href="/community?category=Mentors">Mentors</Link>
                <Link href="/community?category=Material%20Brands">Material Brands</Link>
              </div>
            </div>
            <div className="submit-box">
              <h3>Your work<br />deserves a story<span className="red">.</span></h3>
              <p>Have a project, idea or practice worth sharing?</p>
              <Link className="go" href="/submit">Submit Your Work →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRY PROFESSIONALS — curated in Admin Panel / Featured */}
      <section id="professionals">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow-dot"><span className="dot" /><h2>Industry Professionals</h2></div>
              <p className="section-lede">Visualisers, photographers, contractors, fabricators and landscape designers trusted by studios on AS.</p>
            </div>
            <Link className="view-all" href="/community?category=Makers">Explore All Industry Professionals →</Link>
          </div>

          {professionals.length === 0 ? (
            <div className="empty-state">No featured professionals yet — add some in the Admin Panel's Featured module (Industry Professionals).</div>
          ) : (
            <div className="spec-layout">
              <Link className="spec-spotlight" href={`/community/people/${professionals[0].slug}`}>
                <div
                  className="shot"
                  style={professionals[0].photo ? { backgroundImage: `url(${urlFor(professionals[0].photo).width(900).height(560).url()})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                >
                  <span className="brand-chip">{professionals[0].name}</span>
                </div>
                <div className="info">
                  <div className="cat">{professionals[0].roleCustom || formatRole(professionals[0])}</div>
                  <h3>Featured Professional of the Month</h3>
                  <p>{professionals[0].bio || `Trusted by studios featured on AS${professionals[0].location ? ` — ${professionals[0].location}` : ''}.`}</p>
                  <span className="explore">View Profile →</span>
                </div>
              </Link>

              <div className="spec-mini-grid">
                {professionals.slice(1, 5).map((p) => (
                  <Link className="spec-mini" key={p.slug} href={`/community/people/${p.slug}`}>
                    <div
                      className="avatar-row"
                      style={p.photo ? { backgroundImage: `url(${urlFor(p.photo).width(112).height(112).url()})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                    />
                    <h4>{p.name}</h4>
                    <div className="cat">{p.roleCustom || formatRole(p)}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="spec-cta-row">
            <p>Are you a professional studios should know about?</p>
            <Link href="/submit">List Your Profile →</Link>
          </div>
        </div>
      </section>

      {/* LEARN WITH AS */}
      <section id="learn">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow-dot"><span className="dot" /><h2>Learn with AS</h2></div>
              <p className="section-lede">Don't just see great work. Understand it.</p>
            </div>
            <Link className="view-all" href="/learn">Explore Learning →</Link>
          </div>
          {courses.length === 0 ? (
            <div className="empty-state">No featured courses yet — add some in the Admin Panel's Featured module.</div>
          ) : (
            <div className="learn-grid">
              {courses.map((c) => {
                const [short, ...rest] = c.title.includes(' - ') ? c.title.split(' - ') : [null, c.title]
                const heading = rest.length ? rest.join(' - ') : c.title
                return (
                  <Link key={c.slug} className="learn-card" href={`/learn/${c.slug}`}>
                    <div className="thumb">
                      {c.thumbnail && <img src={urlFor(c.thumbnail).width(560).height(385).url()} alt={c.title} />}
                    </div>
                    <span className="cat">{short ? `${short} · ${c.category}` : c.category}</span>
                    <h4>{heading}</h4>
                    <p className="by">{c.instructor?.name}</p>
                    <div className="price">Explore {short || ''} →</div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* RECENTLY PUBLISHED — auto-sorted by publish date, newest first, no curation needed */}
      {recentPosts.length > 0 && (
        <section id="recent">
          <div className="wrap">
            <div className="section-head">
              <div>
                <div className="eyebrow-dot"><span className="dot" /><h2>Recently Published</h2></div>
                <p className="section-lede">Fresh off the press — newest projects first.</p>
              </div>
              <Link className="view-all" href="/projects">View all</Link>
            </div>
            <div className="pub-grid-4">
              {recentPosts.map((p) => (
                <PublicationCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PEOPLE MAKE PLACES */}
      <section id="community-band">
        <div className="wrap">
          <div className="band-grid">
            <img className="ph" src="/images/community.png" alt="People make places" />
            <div>
              <h2 className="band-h">People<br />make places<span>.</span></h2>
              <p className="band-desc">Join a growing network of students, architects, designers, makers and thinkers.</p>
              <Link className="band-cta" href="/#find">Join AS Community →</Link>
            </div>
            <div className="band-stats">
              <Link className="band-stat" href="/projects"><div className="n">Projects</div><div className="l">Built work and studio stories</div></Link>
              <Link className="band-stat" href="/community"><div className="n">Community</div><div className="l">People across architecture and design</div></Link>
              <Link className="band-stat" href="/learn"><div className="n">Learning</div><div className="l">Courses and practical programmes</div></Link>
            </div>
          </div>
        </div>
      </section>

      {/* WEEKLY NEWSLETTER */}
      <section id="weekly">
        <div className="wrap">
          <div className="weekly-grid">
            <div className="weekly-left">
              <div className="eyebrow-dot"><span className="dot" /><h3 style={{display: 'inline'}}>The AS Weekly<span className="red">.</span></h3></div>
              <p>Architecture worth knowing. Contact us if you would like to hear about future editions.</p>
              <a className="weekly-subscribe" href="mailto:architectsstories@gmail.com?subject=AS%20Weekly%20updates">Ask about The AS Weekly â†’</a>
            </div>
            <div className="weekly-right">
              <nav>
                <Link href="/projects">Projects</Link>
                <Link href="/learn">Learn</Link>
                <Link href="/community">Community</Link>
              </nav>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
