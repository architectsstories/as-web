import Link from 'next/link'
import { client } from '../lib/sanity'
import { urlFor } from '../lib/image'
import { homepageQuery } from '../lib/queries'
import HeroCarousel from '../components/HeroCarousel'

export const revalidate = 60 // re-fetch from Sanity at most once a minute

export default async function HomePage() {
  const data = await client.fetch(homepageQuery)

  const heroSlides = data?.heroSlides || []
  const projects = data?.featuredProjects || []
  const latestProjects = data?.latestProjects || [] // newest projects, shown automatically in "Latest Stories"
  const courses = data?.featuredCourses || []
  const people = data?.featuredPeople || []

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

      {/* FEATURED PROJECTS */}
      <section id="projects" style={{background: 'var(--off)'}}>
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow-dot"><span className="dot" /><h2>Featured Projects</h2></div>
              <p className="section-lede">Exceptional spaces. Thoughtful ideas. Stories worth exploring.</p>
            </div>
            <Link className="view-all" href="/projects">Explore All Projects →</Link>
          </div>
          {projects.length === 0 ? (
            <div className="empty-state">No featured projects yet — add some in the Admin Panel's Featured module.</div>
          ) : (
            <div className="proj-grid">
              {projects[0] && (
                <div className="proj-lead">
                  <Link href={`/projects/${projects[0].slug}`}>
                    <div className="thumb-main">
                      {projects[0].mainImage && (
                        <img src={urlFor(projects[0].mainImage).width(900).height(650).url()} alt={projects[0].title} />
                      )}
                    </div>
                  </Link>
                  <div className="info">
                    <h3>{projects[0].title}</h3>
                    <p className="studio">{projects[0].studio}</p>
                    <p className="meta">{[projects[0].location, projects[0].category].filter(Boolean).join(' — ')}{projects[0].area ? ` · ${projects[0].area}` : ''}</p>
                    <Link className="explore" href={`/projects/${projects[0].slug}`}>Explore Project →</Link>
                  </div>
                </div>
              )}
              <div className="proj-mini-grid">
                {projects.slice(1, 5).map((p) => (
                  <Link key={p.slug} className="proj-mini" href={`/projects/${p.slug}`}>
                    <div className="thumb">
                      {p.mainImage && <img src={urlFor(p.mainImage).width(560).height(385).url()} alt={p.title} />}
                    </div>
                    <h4>{p.title}</h4>
                    <p className="studio">{p.studio}</p>
                    <p className="meta">{[p.location, p.category].filter(Boolean).join(' — ')}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
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
              <a className="go" href="#">Submit Your Work →</a>
            </div>
          </div>
        </div>
      </section>

      {/* PEOPLE */}
      <section id="community">
        <div className="wrap">
          <div className="section-head">
            <div className="eyebrow-dot"><span className="dot" /><h2>People Behind the Spaces</h2></div>
          </div>
          {people.length === 0 ? (
            <div className="empty-state">No featured people yet — add some in the Admin Panel's Featured module.</div>
          ) : (
            <div className="people-grid">
              {people.map((p) => (
                <div className="person" key={p.name}>
                  <div className="ph">
                    {p.photo && <img src={urlFor(p.photo).width(500).height(525).url()} alt={p.name} />}
                  </div>
                  <h4>{p.name}</h4>
                  <p className="role">{p.role}</p>
                  <p className="loc">{p.location}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LEARN WITH AS */}
      <section id="learn" style={{background: 'var(--off)'}}>
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

      {/* PEOPLE MAKE PLACES (static stats band) */}
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
              <div className="band-stat"><div className="n">12K+</div><div className="l">Creators</div></div>
              <div className="band-stat"><div className="n">500+</div><div className="l">Projects</div></div>
              <div className="band-stat"><div className="n">100+</div><div className="l">Practices</div></div>
              <div className="band-stat"><div className="n">50+</div><div className="l">Learning Programs</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* WEEKLY NEWSLETTER (static) */}
      <section id="weekly">
        <div className="wrap">
          <div className="weekly-grid">
            <div className="weekly-left">
              <div className="eyebrow-dot"><span className="dot" /><h3 style={{display: 'inline'}}>The AS Weekly<span className="red">.</span></h3></div>
              <p>Architecture worth knowing. Delivered once a week.</p>
              <div className="weekly-form">
                <input type="email" placeholder="Your email address" />
                <button>Subscribe</button>
              </div>
            </div>
            <div className="weekly-right">
              <nav>
                <Link href="/projects">Projects</Link>
                <Link href="/learn">Learn</Link>
                <Link href="/#community">Community</Link>
              </nav>
              <div className="socials">
                <a href="#">◎</a>
                <a href="#">▶</a>
                <a href="#">in</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
