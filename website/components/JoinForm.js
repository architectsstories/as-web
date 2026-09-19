'use client'

import { useState } from 'react'

const ROLES = ['Architect', 'Designer', 'Studio', 'Maker', 'Mentor', 'Material Brand', 'Student', 'Other']

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function JoinForm() {
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')
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

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const form = e.target
    const payload = {
      name: form.name.value,
      email: form.email.value,
      mobile: form.mobile.value,
      role: form.role.value,
      roleCustom: form.roleCustom.value,
      coaNumber: role === 'Architect' ? form.coaNumber?.value : '',
      location: form.location.value,
      portfolioUrl: form.portfolioUrl.value,
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
      <div className="join-success">
        <h3>Thanks for reaching out<span className="red">.</span></h3>
        <p>We've received your details and will be in touch soon.</p>
      </div>
    )
  }

  return (
    <form className="join-form" onSubmit={handleSubmit}>
      <div className="join-form-row">
        <label>
          Name<span className="red">*</span>
          <input name="name" type="text" required disabled={status === 'submitting'} />
        </label>
        <label>
          Email<span className="red">*</span>
          <input name="email" type="email" required disabled={status === 'submitting'} />
        </label>
      </div>
      <div className="join-form-row">
        <label>
          Mobile Number <span style={{fontWeight: 400, color: 'var(--grey)'}}>(optional)</span>
          <input name="mobile" type="tel" placeholder="+91" disabled={status === 'submitting'} />
        </label>
        <label>
          Location
          <input name="location" type="text" placeholder="City, Country" disabled={status === 'submitting'} />
        </label>
      </div>
      <div className="join-form-row">
        <label>
          Role
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={status === 'submitting'}
          >
            <option value="" disabled>Select one</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
        {role === 'Architect' ? (
          <label>
            COA Number <span style={{fontWeight: 400, color: 'var(--grey)'}}>(if registered)</span>
            <input name="coaNumber" type="text" placeholder="Council of Architecture reg. no." disabled={status === 'submitting'} />
          </label>
        ) : (
          <div aria-hidden="true" />
        )}
      </div>
      <label className="join-form-full">
        <span>Custom Role <span style={{fontWeight: 400, color: 'var(--grey)'}}>(optional, short)</span></span>
        <input name="roleCustom" type="text" maxLength={30} placeholder="e.g. Urban Planner" disabled={status === 'submitting'} />
      </label>
      <label className="join-form-full">
        Portfolio / Website
        <input name="portfolioUrl" type="url" placeholder="https://" disabled={status === 'submitting'} />
      </label>
      <label className="join-form-full">
        Photo <span style={{fontWeight: 400, color: 'var(--grey)'}}>(optional)</span>
        <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={status === 'submitting'} />
        {photoError && <span className="join-form-error" style={{marginTop: 6}}>{photoError}</span>}
        {photoPreview && (
          <img
            src={photoPreview}
            alt="Preview"
            style={{width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', marginTop: 10}}
          />
        )}
      </label>
      <label className="join-form-full">
        Tell us a bit about your work
        <textarea name="message" rows={4} disabled={status === 'submitting'} />
      </label>

      {status === 'error' && <p className="join-form-error">{errorMsg}</p>}

      <button type="submit" className="cta-btn lg" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
      </button>
    </form>
  )
}
