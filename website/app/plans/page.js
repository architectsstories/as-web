import Link from 'next/link'

export const metadata = {
  title: 'Featuring & Promotion Plans — Architects Stories',
  description: 'Get your project the exposure it deserves — curated Instagram features, professional photography, and website stories.',
}

const PLANS = [
  {
    num: '01',
    name: 'Essential',
    was: '₹5,000',
    price: 'FREE',
    tagline: 'For projects that already have professional photography and need curated exposure.',
    includes: [
      '1 Instagram carousel post (6–10 images)',
      'Story-driven caption writing',
      'Post collaboration with full credits and tagging',
      '1 story share',
      'Added to highlights',
    ],
    clientLabel: 'Client provides',
    client: ['High-resolution images', 'Project details', 'Credits'],
  },
  {
    num: '02',
    name: 'Studio',
    price: '₹12,000',
    tagline: 'Professional documentation with curated features.',
    includes: [
      'Half-day professional photoshoot',
      '1 Instagram carousel post',
      'Caption writing',
      'Post collaboration with full credits and tagging',
      '2 story shares',
      'Highlight placement',
    ],
    clientLabel: 'Client receives',
    client: ['10–15 edited high-resolution images', 'Social media-ready files'],
  },
  {
    num: '03',
    name: 'Showcase',
    price: '₹20,000',
    tagline: 'Professional documentation with curated features.',
    includes: [
      'Professional photography',
      '1 Instagram carousel post',
      '1 Instagram reel (30–60 seconds)',
      '3 story promotions',
      'Post collaboration with full credits and tagging',
    ],
    clientLabel: 'Client receives',
    client: ['18–25 edited high-resolution images', 'Social media-ready files'],
  },
  {
    num: '04',
    name: 'Signature',
    price: '₹35,000',
    tagline: 'Complete storytelling and premium exposure.',
    highlight: true,
    includes: [
      'Full-day photo + video shoot',
      '1 carousel post',
      '1 cinematic reel',
      'On-site architect video byte (1–2 minutes)',
      'Website feature article',
      '7-day ad campaign management (ad budget separate)',
      'Highlight placement',
    ],
    clientLabel: 'Client receives',
    client: ['Full image library', '2 edited videos', 'Written feature article'],
  },
]

const ADDONS = [
  {name: 'Meta Ads management', price: '₹3,000', note: 'ad budget separate'},
  {name: 'Drone shoot', price: '₹8,000–₹15,000', note: ''},
  {name: 'Extra reel', price: '₹5,000', note: ''},
  {name: 'Highlight pin', price: '₹2,000', note: '10 days'},
]

const TERMS = [
  '50% advance payment is required to confirm the booking.',
  'Remaining 50% must be paid before publishing the feature.',
  'Travel and additional production costs (if any) will be charged separately.',
  'Clients must provide accurate project details and credits.',
  'Posting schedule will be confirmed after receiving materials and advance payment.',
  'Ad promotions require a separate ad budget.',
]

export default function PlansPage() {
  return (
    <>
      <section style={{background: 'var(--black)', color: 'var(--white)', padding: '64px 0 56px', textAlign: 'center'}}>
        <div className="wrap">
          <div className="eyebrow-dot" style={{justifyContent: 'center', color: '#e8b8ab', fontSize: 12, fontWeight: 600, letterSpacing: '.08em'}}>
            <span className="dot" />FEATURING &amp; PROMOTION
          </div>
          <h1 style={{fontSize: 'clamp(30px,4.2vw,46px)', textTransform: 'uppercase', lineHeight: 1.05}}>
            Get your project the exposure it deserves<span className="red">.</span>
          </h1>
          <p style={{margin: '16px auto 0', fontSize: 15.5, color: '#c9c7c0', maxWidth: '56ch', lineHeight: 1.6}}>
            For projects that already have professional photography and need curated exposure —
            or let our team shoot it for you, start to finish.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="plans-grid">
            {PLANS.map((p) => (
              <div className={`plan${p.highlight ? ' highlight' : ''}`} key={p.name}>
                <div className="pnum">{p.num}</div>
                <h3>{p.name}</h3>
                <div className="price">
                  {p.was && <span className="was">{p.was}</span>}
                  <span className={p.price === 'FREE' ? 'free' : ''}>{p.price}</span>
                </div>
                <p className="tagline">{p.tagline}</p>
                <div className="divider" />
                <div className="blabel">Includes</div>
                <ul>
                  {p.includes.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <div className="blabel">{p.clientLabel}</div>
                <ul>
                  {p.client.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <Link className="choose" href={`/submit?plan=${encodeURIComponent(p.name)}`}>
                  Choose {p.name} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="addons" style={{background: 'var(--off)'}}>
        <div className="wrap">
          <div className="section-head" style={{display: 'block', textAlign: 'center', maxWidth: '60ch', margin: '0 auto 46px'}}>
            <div className="eyebrow-dot" style={{justifyContent: 'center'}}><span className="dot" /><h2>Optional Add-Ons</h2></div>
            <p className="section-lede">Add these to any plan above.</p>
          </div>
          <div className="addons-grid">
            {ADDONS.map((a) => (
              <div className="addon" key={a.name}>
                <div className="aname">{a.name}</div>
                <div className="aprice">{a.price}</div>
                <div className="anote">{a.note || '\u00A0'}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="section-head" style={{display: 'block', textAlign: 'center', maxWidth: '60ch', margin: '0 auto 46px'}}>
            <div className="eyebrow-dot" style={{justifyContent: 'center'}}><span className="dot" /><h2>Terms &amp; Conditions</h2></div>
          </div>
          <ul className="terms-list">
            {TERMS.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
      </section>

      <section id="cta" style={{background: 'var(--black)', color: 'var(--white)', textAlign: 'center'}}>
        <div className="wrap">
          <h2 style={{fontSize: 'clamp(24px,3vw,32px)', textTransform: 'uppercase'}}>Ready to feature your project<span className="red">?</span></h2>
          <p style={{fontSize: 14.5, color: '#c9c7c0', marginTop: 14}}>Submit your details and we'll get back to you within 3–5 working days.</p>
          <Link className="cta-btn lg" href="/submit" style={{marginTop: 26, background: 'var(--white)', color: 'var(--black)'}}>
            Submit Your Work →
          </Link>
          <div className="cta-contact">
            <div><b>Naseef VP</b>Founder, Architects Stories</div>
            <div><b>+91 97444 12828</b>Call or WhatsApp</div>
            <div><b>architectsstories@gmail.com</b>Email</div>
          </div>
        </div>
      </section>
    </>
  )
}
