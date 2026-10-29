'use client'

import {useState} from 'react'
import Link from 'next/link'

const CATEGORIES = [
  {
    value: 'architectFirm',
    title: 'Architects & Firms',
    brief: 'For architects, architecture studios and practices looking to be part of the AS professional directory.',
  },
  {
    value: 'vendorBrand',
    title: 'Vendors & Brands',
    brief: 'For material brands, manufacturers, product companies and trusted suppliers serving the built environment.',
  },
  {
    value: 'industryProfessional',
    title: 'Industry Professionals',
    brief: 'For specialists and independent professionals working across architecture, design and the built environment.',
  },
  {
    value: 'community',
    title: 'Community',
    brief: 'For students, architects, designers, mentors and other individuals who want to join the AS community.',
  },
]

const ROLES = ['Architect', 'Designer', 'Studio', 'Maker', 'Mentor', 'Student', 'Other']
const VENDOR_CATEGORIES = ['Surfaces', 'Lighting', 'Furniture', 'Sanitary', 'Hardware', 'Materials', 'Other']

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function JoinHead({step}) {
  // step: 1 = choose category, 2 = details, 3 = submitted
  const items = ['Category', 'Your details']
  return (
    <div className="section-head join-head">
      <div>
        <div className="eyebrow-dot"><span className="dot" /><h1>Join Architects Stories<span className="red">.</span></h1></div>
        <p className="section-lede">Become part of the architecture ecosystem — features, connections and opportunities.</p>
      </div>
      <ol className="join-steps" aria-label="Progress">
        {items.map((label, i) => {
          const n = i + 1
          const state = step > n ? 'is-done' : step === n ? 'is-current' : ''
          return (
            <li key={label} className={state} aria-current={step === n ? 'step' : undefined}>
              <span className="n">{step > n ? '✓' : n}</span>{label}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export default function JoinForm() {
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [category, setCategory] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [role, setRole] = useState('')
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoDataUrl, setPhotoDataUrl] = useState(null)
  const [photoError, setPhotoError] = useState('')

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    setPhotoError('')
    if (!file) {
      setPhotoPreview(null)
      setPhotoDataUrl(null)
      return
    }
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please choose an image file.')
      e.target.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Please choose an image under 5MB.')
      e.target.value = ''
      return
    }
    const dataUrl = await readFileAsDataURL(file)
    setPhotoDataUrl(dataUrl)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function chooseCategory(value) {
    setSelectedCategory(value)
    setErrorMsg('')
  }

  function goNext() {
    if (!selectedCategory || status === 'submitting') return
    setCategory(selectedCategory)
    setRole('')
    setErrorMsg('')
  }

  function goBack() {
    if (status === 'submitting') return
    setCategory('')
    setSelectedCategory('')
    setRole('')
    setErrorMsg('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const form = e.target
    const payload = {
      category,
      organizationName: form.organizationName?.value || '',
      contactName: form.contactName?.value || '',
      name: form.name?.value || '',
      email: form.email.value,
      mobile: form.mobile.value,
      location: form.location.value,
      website: form.website?.value || '',
      portfolioUrl: form.portfolioUrl?.value || '',
      role: form.role?.value || '',
      roleCustom: form.roleCustom?.value || '',
      coaNumber: form.coaNumber?.value || '',
      specialization: form.specialization?.value || '',
      vendorCategory: form.vendorCategory?.value || '',
      message: form.message.value,
      photoDataUrl: photoDataUrl || '',
    }

    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
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
      <>
        <JoinHead step={3} />
        <div className="join-success">
          <h3>Thanks for reaching out<span className="red">.</span></h3>
          <p>We've received your details and will review your application shortly.</p>
          <div className="join-success-actions">
            <Link className="join-btn" href="/">Back to home</Link>
            <Link className="join-textlink" href="/community">Explore the community →</Link>
          </div>
        </div>
      </>
    )
  }

  if (!category) {
    const picked = CATEGORIES.find((item) => item.value === selectedCategory)
    return (
      <>
        <JoinHead step={1} />
        <p className="join-prompt">Select the category that best describes you or your organisation.</p>
        <div className="join-cells" role="group" aria-label="Join as">
          {CATEGORIES.map((item) => {
            const on = selectedCategory === item.value
            return (
              <button
                key={item.value}
                type="button"
                className={`join-cell${on ? ' is-selected' : ''}`}
                onClick={() => chooseCategory(item.value)}
                aria-pressed={on}
              >
                <h3>{item.title}</h3>
                <p>{item.brief}</p>
                <span className="arrow-circle" aria-hidden="true">{on ? '✓' : '→'}</span>
              </button>
            )
          })}
        </div>
        <div className="join-bar">
          <p className="join-bar-note" aria-live="polite">
            {picked ? <>Joining as <strong>{picked.title}</strong></> : 'Choose one to continue.'}
          </p>
          <button type="button" className="join-btn" onClick={goNext} disabled={!selectedCategory}>Continue →</button>
        </div>
      </>
    )
  }

  const selected = CATEGORIES.find((item) => item.value === category)
  const isFirm = category === 'architectFirm'
  const isVendor = category === 'vendorBrand'
  const isProfessional = category === 'industryProfessional'
  const isCommunity = category === 'community'

  return (
    <>
      <JoinHead step={2} />
      <div className="join-layout">
    <form className="join-form join-panel" onSubmit={handleSubmit}>
      {isFirm && (
        <>
          <div className="join-form-section"><h3>Practice Details</h3><p>Tell us about your architecture practice.</p></div>
          <div className="join-form-row">
            <label>Firm / Practice Name<span className="red">*</span><input name="organizationName" required disabled={status === 'submitting'} /></label>
            <label>Contact Person<span className="red">*</span><input name="contactName" required disabled={status === 'submitting'} /></label>
          </div>
          <div className="join-form-row">
            <label>Email<span className="red">*</span><input name="email" type="email" required disabled={status === 'submitting'} /></label>
            <label>Mobile <span className="join-optional">(optional)</span><input name="mobile" type="tel" placeholder="+91" disabled={status === 'submitting'} /></label>
          </div>
          <div className="join-form-row">
            <label>Location<input name="location" placeholder="City, Country" disabled={status === 'submitting'} /></label>
            <label>Website<input name="website" type="url" placeholder="https://" disabled={status === 'submitting'} /></label>
          </div>
          <label className="join-form-full">About the Practice<textarea name="message" rows={5} placeholder="Tell us about your practice, work and areas of focus." disabled={status === 'submitting'} /></label>
          <label className="join-form-full">Logo / Image <span className="join-optional">(optional)</span><input type="file" accept="image/*" onChange={handlePhotoChange} disabled={status === 'submitting'} /></label>
        </>
      )}

      {isVendor && (
        <>
          <div className="join-form-section"><h3>Brand Details</h3><p>Tell us about the brand and what you offer to the architecture ecosystem.</p></div>
          <div className="join-form-row">
            <label>Brand Name<span className="red">*</span><input name="organizationName" required disabled={status === 'submitting'} /></label>
            <label>Contact Person<span className="red">*</span><input name="contactName" required disabled={status === 'submitting'} /></label>
          </div>
          <div className="join-form-row">
            <label>Email<span className="red">*</span><input name="email" type="email" required disabled={status === 'submitting'} /></label>
            <label>Mobile <span className="join-optional">(optional)</span><input name="mobile" type="tel" placeholder="+91" disabled={status === 'submitting'} /></label>
          </div>
          <div className="join-form-row">
            <label>Category<select name="vendorCategory" defaultValue="" disabled={status === 'submitting'}><option value="">Select category</option>{VENDOR_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label>Location<input name="location" placeholder="City, Country" disabled={status === 'submitting'} /></label>
          </div>
          <label className="join-form-full">Website<input name="website" type="url" placeholder="https://" disabled={status === 'submitting'} /></label>
          <label className="join-form-full">About the Brand<textarea name="message" rows={5} placeholder="Tell us about your products, materials or services." disabled={status === 'submitting'} /></label>
          <label className="join-form-full">Logo / Image <span className="join-optional">(optional)</span><input type="file" accept="image/*" onChange={handlePhotoChange} disabled={status === 'submitting'} /></label>
        </>
      )}

      {isProfessional && (
        <>
          <div className="join-form-section"><h3>Professional Details</h3><p>Tell us about your expertise and the work you do.</p></div>
          <div className="join-form-row">
            <label>Full Name<span className="red">*</span><input name="name" required disabled={status === 'submitting'} /></label>
            <label>Specialization<span className="red">*</span><input name="specialization" required placeholder="e.g. Architectural Photographer" disabled={status === 'submitting'} /></label>
          </div>
          <div className="join-form-row">
            <label>Email<span className="red">*</span><input name="email" type="email" required disabled={status === 'submitting'} /></label>
            <label>Mobile <span className="join-optional">(optional)</span><input name="mobile" type="tel" placeholder="+91" disabled={status === 'submitting'} /></label>
          </div>
          <div className="join-form-row">
            <label>Location<input name="location" placeholder="City, Country" disabled={status === 'submitting'} /></label>
            <label>Website / Portfolio<input name="portfolioUrl" type="url" placeholder="https://" disabled={status === 'submitting'} /></label>
          </div>
          <label className="join-form-full">About Your Work<textarea name="message" rows={5} placeholder="Tell us about your expertise, services and work." disabled={status === 'submitting'} /></label>
          <label className="join-form-full">Photo <span className="join-optional">(optional)</span><input type="file" accept="image/*" onChange={handlePhotoChange} disabled={status === 'submitting'} /></label>
        </>
      )}

      {isCommunity && (
        <>
          <div className="join-form-section"><h3>Community Profile</h3><p>Tell us a little about yourself and how you are connected to architecture and design.</p></div>
          <div className="join-form-row">
            <label>Full Name<span className="red">*</span><input name="name" required disabled={status === 'submitting'} /></label>
            <label>Role<span className="red">*</span><select name="role" value={role} onChange={(e) => setRole(e.target.value)} required disabled={status === 'submitting'}><option value="" disabled>Select one</option>{ROLES.map((r) => <option key={r}>{r}</option>)}</select></label>
          </div>
          {role === 'Architect' && <label className="join-form-full">COA Number <span className="join-optional">(if registered)</span><input name="coaNumber" placeholder="Council of Architecture registration number" disabled={status === 'submitting'} /></label>}
          <div className="join-form-row">
            <label>Email<span className="red">*</span><input name="email" type="email" required disabled={status === 'submitting'} /></label>
            <label>Mobile <span className="join-optional">(optional)</span><input name="mobile" type="tel" placeholder="+91" disabled={status === 'submitting'} /></label>
          </div>
          <div className="join-form-row">
            <label>Location<input name="location" placeholder="City, Country" disabled={status === 'submitting'} /></label>
            <label>Portfolio / Website<input name="portfolioUrl" type="url" placeholder="https://" disabled={status === 'submitting'} /></label>
          </div>
          <label className="join-form-full">Custom Role <span className="join-optional">(optional)</span><input name="roleCustom" maxLength={30} placeholder="e.g. Urban Planner" disabled={status === 'submitting'} /></label>
          <label className="join-form-full">Tell us about yourself<textarea name="message" rows={5} placeholder="Your work, interests, experience or what you would like to be part of." disabled={status === 'submitting'} /></label>
          <label className="join-form-full">Photo <span className="join-optional">(optional)</span><input type="file" accept="image/*" onChange={handlePhotoChange} disabled={status === 'submitting'} />{photoError && <span className="join-form-error" style={{marginTop: 6}}>{photoError}</span>}{photoPreview && <img src={photoPreview} alt="Preview" style={{width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', marginTop: 10}} />}</label>
        </>
      )}

      {photoError && !isCommunity && <p className="join-form-error">{photoError}</p>}
      {status === 'error' && <p className="join-form-error" role="alert">{errorMsg}</p>}
      <div className="join-actions">
        <button type="submit" className="join-btn" disabled={status === 'submitting'}>{status === 'submitting' ? 'Submitting…' : 'Submit Application'}</button>
      </div>
    </form>

    <aside className="join-aside">
      <div className="join-aside-card">
        <span className="cat">Joining as</span>
        <h3>{selected?.title}</h3>
        <p>{selected?.brief}</p>
        <button type="button" className="join-back" onClick={goBack} disabled={status === 'submitting'}>← Change category</button>
      </div>
      <p className="join-aside-note">Every application is reviewed by the AS team before it goes live. Fields marked <span className="red">*</span> are required.</p>
    </aside>
      </div>
    </>
  )
}
