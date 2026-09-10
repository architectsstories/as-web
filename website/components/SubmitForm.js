'use client'

import { useState } from 'react'

const PROJECT_TYPES = ['Residential', 'Commercial', 'Hospitality', 'Institutional', 'Landscape', 'Interior', 'Other']

const PLAN_CARDS = [
  {name: 'Essential', price: 'FREE', was: '₹5,000'},
  {name: 'Studio', price: '₹12,000'},
  {name: 'Showcase', price: '₹20,000'},
  {name: 'Signature', price: '₹35,000'},
]

const STEP_LABELS = ['Contact', 'Project', 'Credits', 'Plan', 'Materials', 'Anything Else']

const PHOTOGRAPHY_PLANS = ['Studio', 'Showcase', 'Signature']

export default function SubmitForm({ initialPlan }) {
  const [step, setStep] = useState(1)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [data, setData] = useState({
    name: '', email: '', phone: '',
    projectTitle: '', projectType: '', location: '', area: '', year: '', concept: '',
    architectCredit: '', photographerCredit: '', collaboratorCredits: '',
    plan: initialPlan && PLAN_CARDS.some((p) => p.name === initialPlan) ? initialPlan : (initialPlan === 'Not sure' ? 'Not sure' : ''),
    driveLink: '', shootDate: '', siteAddress: '', additionalNotes: '',
  })

  const totalSteps = STEP_LABELS.length
  const needsShootDetails = PHOTOGRAPHY_PLANS.includes(data.plan)

  function update(field, value) {
    setData((d) => ({...d, [field]: value}))
  }

  function stepIsValid(s) {
    if (s === 1) return data.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
    if (s === 2) return data.projectTitle.trim()
    return true
  }

  function goNext() {
    if (!stepIsValid(step)) return
    setStep((s) => Math.min(s + 1, totalSteps))
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stepIsValid(1) || !stepIsValid(2)) return

    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      })
      const result = await res.json()

      if (!res.ok) {
        setErrorMsg(result.error || 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setErrorMsg('Network error — please check your connection and try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="join-success">
        <h3>Thanks — we've got it<span className="red">.</span></h3>
        <p>We'll review your submission and get back to you within 3–5 working days.</p>
      </div>
    )
  }

  return (
    <form className="join-form" onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); goNext() }}>
      <div className="submit-steps">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className={`submit-step-dot${i + 1 === step ? ' active' : ''}${i + 1 < step ? ' done' : ''}`}>
            <span>{i + 1}</span>{label}
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <div className="join-form-row">
            <label>
              Name<span className="red">*</span>
              <input value={data.name} onChange={(e) => update('name', e.target.value)} required />
            </label>
            <label>
              Email<span className="red">*</span>
              <input type="email" value={data.email} onChange={(e) => update('email', e.target.value)} required />
            </label>
          </div>
          <label className="join-form-full">
            Phone / WhatsApp
            <input value={data.phone} onChange={(e) => update('phone', e.target.value)} />
          </label>
        </>
      )}

      {step === 2 && (
        <>
          <label className="join-form-full">
            Project Title<span className="red">*</span>
            <input value={data.projectTitle} onChange={(e) => update('projectTitle', e.target.value)} required />
          </label>
          <div className="join-form-row">
            <label>
              Project Type
              <select value={data.projectType} onChange={(e) => update('projectType', e.target.value)}>
                <option value="">Select one</option>
                {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label>
              Location
              <input value={data.location} onChange={(e) => update('location', e.target.value)} />
            </label>
          </div>
          <div className="join-form-row">
            <label>
              Area
              <input value={data.area} onChange={(e) => update('area', e.target.value)} placeholder="e.g. 2400 sqft" />
            </label>
            <label>
              Year
              <input value={data.year} onChange={(e) => update('year', e.target.value)} />
            </label>
          </div>
          <label className="join-form-full">
            Concept / Description
            <textarea rows={4} value={data.concept} onChange={(e) => update('concept', e.target.value)} />
          </label>
        </>
      )}

      {step === 3 && (
        <>
          <p className="submit-step-note">Every plan requires full credits and tagging — let us know who to credit.</p>
          <div className="join-form-row">
            <label>
              Architect / Studio
              <input value={data.architectCredit} onChange={(e) => update('architectCredit', e.target.value)} />
            </label>
            <label>
              Photographer
              <input value={data.photographerCredit} onChange={(e) => update('photographerCredit', e.target.value)} />
            </label>
          </div>
          <label className="join-form-full">
            Other Collaborators
            <textarea rows={2} value={data.collaboratorCredits} onChange={(e) => update('collaboratorCredits', e.target.value)} placeholder="Interior designer, contractor, landscape consultant, etc." />
          </label>
        </>
      )}

      {step === 4 && (
        <>
          <div className="plan-picker">
            {PLAN_CARDS.map((p) => (
              <button
                type="button"
                key={p.name}
                className={`plan-pick${data.plan === p.name ? ' selected' : ''}`}
                onClick={() => update('plan', p.name)}
              >
                <div className="plan-pick-name">{p.name}</div>
                <div className="plan-pick-price">
                  {p.was && <span className="was">{p.was}</span>}
                  <span className={p.price === 'FREE' ? 'free' : ''}>{p.price}</span>
                </div>
              </button>
            ))}
          </div>
          <label className="join-form-full" style={{marginTop: 20}}>
            <span
              onClick={() => update('plan', data.plan === 'Not sure' ? '' : 'Not sure')}
              style={{cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8}}
            >
              <input
                type="checkbox"
                checked={data.plan === 'Not sure'}
                onChange={() => update('plan', data.plan === 'Not sure' ? '' : 'Not sure')}
                style={{width: 'auto'}}
              />
              Not sure which plan — help me choose
            </span>
          </label>
        </>
      )}

      {step === 5 && (
        <>
          <label className="join-form-full">
            Drive Link (images / video)
            <input
              type="url"
              value={data.driveLink}
              onChange={(e) => update('driveLink', e.target.value)}
              placeholder="https://drive.google.com/..."
            />
          </label>
          <p className="submit-step-note">
            Make sure sharing is set to "Anyone with the link can view" before submitting — we won't be able to access private links.
          </p>
          {needsShootDetails && (
            <div className="join-form-row">
              <label>
                Preferred Shoot Date
                <input type="date" value={data.shootDate} onChange={(e) => update('shootDate', e.target.value)} />
              </label>
              <label>
                Site Address
                <input value={data.siteAddress} onChange={(e) => update('siteAddress', e.target.value)} />
              </label>
            </div>
          )}
        </>
      )}

      {step === 6 && (
        <label className="join-form-full">
          Anything else we should know?
          <textarea rows={5} value={data.additionalNotes} onChange={(e) => update('additionalNotes', e.target.value)} />
        </label>
      )}

      {status === 'error' && <p className="join-form-error">{errorMsg}</p>}

      <div className="submit-step-nav">
        {step > 1 && (
          <button type="button" className="cta-btn sm" style={{background: 'transparent', color: 'var(--black)', border: '1px solid var(--line)'}} onClick={goBack}>
            ← Back
          </button>
        )}
        <div style={{flex: 1}} />
        {step < totalSteps ? (
          <button type="submit" className="cta-btn sm" disabled={!stepIsValid(step)}>
            Next →
          </button>
        ) : (
          <button type="submit" className="cta-btn lg" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Submitting…' : 'Submit Your Work'}
          </button>
        )}
      </div>
    </form>
  )
}
