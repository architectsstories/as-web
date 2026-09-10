'use client'

import { useState } from 'react'

const ROLES = ['Architect', 'Designer', 'Studio', 'Maker', 'Mentor', 'Material Brand', 'Student', 'Other']

export default function JoinForm() {
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const form = e.target
    const payload = {
      name: form.name.value,
      email: form.email.value,
      role: form.role.value,
      roleCustom: form.roleCustom.value,
      location: form.location.value,
      portfolioUrl: form.portfolioUrl.value,
      message: form.message.value,
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
          Role
          <select name="role" defaultValue="" disabled={status === 'submitting'}>
            <option value="" disabled>Select one</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
        <label>
          Location
          <input name="location" type="text" placeholder="City, Country" disabled={status === 'submitting'} />
        </label>
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
