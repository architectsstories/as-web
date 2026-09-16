import Link from 'next/link'

export const metadata = {
  title: 'Featuring & Photography — Architects Stories',
  description: 'Get your project featured for free, or add professional photography and video — two separate services, pick what you need.',
}

const FEATURE_PLAN = {
  name: 'Feature',
  price: 'FREE',
  tagline: 'For projects that already have professional photography and need curated exposure.',
  includes: [
    'Website feature',
    '1 Instagram carousel post (6–10 images)',
    'Post collaboration with full credits and tagging',
    '1 story share',
    'Added to highlights',
    
  ],
  clientLabel: 'Client provides',
  client: ['High-resolution images', 'Project details', 'Credits'],
}

const PHOTO_PLANS = [
  {
    num: '01',
    name: 'Half-Day Shoot',
    price: '₹12,000',
    tagline: 'Half-day professional photoshoot.',
    includes: ['Half-day professional photoshoot'],
    clientLabel: 'Client receives',
    client: ['10–15 edited high-resolution images', 'Social media-ready files'],
  },
  {
    num: '02',
    name: 'Full-Day Shoot',
    price: '₹20,000',
    tagline: 'Full-day professional photography.',
    includes: ['Full-day professional photography'],
    clientLabel: 'Client receives',
    client: ['18–25 edited high-resolution images', 'Social media-ready files'],
  },
  {
    num: '03',
    name: 'Photo + Video Shoot',
    price: '₹35,000',
    tagline: 'Full-day photo + video shoot with an on-site architect video byte.',
    highlight: true,
    includes: ['Full-day photo + video shoot', 'On-site architect video byte (1–2 minutes)'],
    clientLabel: 'Client receives',
    client: ['Full image library', '2 edited videos'],
  },
]

const PHOTO_ADDONS = [
  {name: 'Drone shoot', price: '₹8,000–₹15,000', note: ''},
  {name: 'Extra reel', price: '₹5,000', note: ''},
  {name: 'Highlight pin', price: '₹2,000', note: '10 days'},
]

const TERMS = [
  'Featuring is free — no advance or payment required.',
  'For Photography bookings, 50% advance payment is required to confirm.',
  'Remaining 50% must be paid before the shoot, or before publishing if bundled with a feature.',
  'Travel and additional production costs (if any) will be charged separately.',
  'Clients must provide accurate project details and credits.',
  'Posting schedule will be confirmed after receiving materials (and advance payment, for Photography).',
  'Ad promotions require a separate ad budget.',
]

function PlanCard({ p, ctaPrefix }) {
  return (
    <div className={`plan${p.highlight ? ' highlight' : ''}`}>
      {p.num && <div className="pnum">{p.num}</div>}
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
        {ctaPrefix} {p.name} →
      </Link>
    </div>
  )
}

export default function PlansPage() {
  return (
    <>
      <section style={{background: 'var(--black)', color: 'var(--white)', padding: '64px 0 56px', textAlign: 'center'}}>
        <div className="wrap">
          <div className="eyebrow-dot" style={{justifyContent: 'center', color: '#e8b8ab', fontSize: 12, fontWeight: 600, letterSpacing: '.08em'}}>
            <span className="dot" />FEATURING &amp; PHOTOGRAPHY
          </div>
          <h1 style={{fontSize: 'clamp(30px,4.2vw,46px)', textTransform: 'uppercase', lineHeight: 1.05}}>
            Get your project the exposure it deserves<span className="red">.</span>
          </h1>
          <p style={{margin: '16px auto 0', fontSize: 15.5, color: '#c9c7c0', maxWidth: '56ch', lineHeight: 1.6}}>
            Featuring on Architects Stories is completely free. Already have photography? Submit
            it as-is — or add a professional shoot from our separate Photography plans below.
          </p>
        </div>
      </section>

      {/* FEATURING — free */}
      <section>
        <div className="wrap">
          <div className="section-head" style={{display: 'block', textAlign: 'center', maxWidth: '60ch', margin: '0 auto 46px'}}>
            <div className="eyebrow-dot" style={{justifyContent: 'center'}}><span className="dot" /><h2>Featuring</h2></div>
            <p className="section-lede">Free — for projects that already have their own photography.</p>
          </div>
          <div className="plan-wide">
            <div className="plan-wide-head">
              <h3>{FEATURE_PLAN.name}</h3>
              <div className="price"><span className="free">{FEATURE_PLAN.price}</span></div>
              <p className="tagline">{FEATURE_PLAN.tagline}</p>
              <Link className="choose" href={`/submit?plan=${encodeURIComponent(FEATURE_PLAN.name)}`}>
                Choose {FEATURE_PLAN.name} →
              </Link>
            </div>
            <div className="plan-wide-col">
              <div className="blabel">Includes</div>
              <ul>
                {FEATURE_PLAN.includes.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="plan-wide-col">
              <div className="blabel">{FEATURE_PLAN.clientLabel}</div>
              <ul>
                {FEATURE_PLAN.client.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTOGRAPHY — paid, separate service */}
      <section id="photography">
        <div className="wrap">
          <div className="section-head" style={{display: 'block', textAlign: 'center', maxWidth: '60ch', margin: '0 auto 46px'}}>
            <div className="eyebrow-dot" style={{justifyContent: 'center'}}><span className="dot" /><h2>Photography</h2></div>
            <p className="section-lede">A separate paid service — let our team shoot your project, start to finish.</p>
          </div>
          <div className="plans-grid cols-3">
            {PHOTO_PLANS.map((p) => (
              <PlanCard p={p} key={p.name} ctaPrefix="Choose" />
            ))}
          </div>
        </div>
      </section>

      <section id="addons" style={{background: 'var(--off)'}}>
        <div className="wrap">
          <div className="section-head" style={{display: 'block', textAlign: 'center', maxWidth: '60ch', margin: '0 auto 46px'}}>
            <div className="eyebrow-dot" style={{justifyContent: 'center'}}><span className="dot" /><h2>Photography Add-Ons</h2></div>
            <p className="section-lede">Add these to any Photography plan above.</p>
          </div>
          <div className="addons-grid cols-3">
            {PHOTO_ADDONS.map((a) => (
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
            <div><b>+91 97444 12828</b>Call or WhatsApp</div>
            <div><b>architectsstories@gmail.com</b>Email</div>
          </div>
        </div>
      </section>
    </>
  )
}
