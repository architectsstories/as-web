'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function EnrollButton({ course, size, full }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  const label = course.ctaText || 'Join Now'
  const externalLink = course.ctaLink && course.ctaLink !== '#' ? course.ctaLink : null
  const large = size === 'large'
  const btnClass = `cta-btn ${large ? 'lg' : 'sm'}${full ? ' full' : ''}`

  // If an explicit external link is set in Sanity, use that instead of the popup.
  if (externalLink) {
    return (
      <a
        href={externalLink}
        target={externalLink.startsWith('http') ? '_blank' : undefined}
        rel={externalLink.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={btnClass}
      >
        {label}
      </a>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    const form = e.target
    const payload = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      message: form.message.value,
      courseTitle: course.title,
      courseSlug: course.slug,
    }

    try {
      const res = await fetch('/api/enroll', {
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

  function closeModal() {
    setOpen(false)
    setStatus('idle')
    setErrorMsg('')
  }

  return (
    <>
      <button type="button" className={btnClass} onClick={() => setOpen(true)}>
        {label}
      </button>

      {open && mounted && createPortal(
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-close" onClick={closeModal} aria-label="Close">×</button>

            {status === 'success' ? (
              <div className="join-success">
                <h3>You're in<span className="red">.</span></h3>
                <p>Thanks for your interest in {course.title} — we'll reach out shortly with next steps.</p>
              </div>
            ) : (
              <>
                <h3 className="modal-title">Join {course.title}</h3>
                <p className="modal-sub">Leave your details and we'll get back to you with enrollment info.</p>
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
                  <label className="join-form-full">
                    Phone / WhatsApp
                    <input name="phone" type="text" disabled={status === 'submitting'} />
                  </label>
                  <label className="join-form-full">
                    Anything you'd like us to know?
                    <textarea name="message" rows={3} disabled={status === 'submitting'} />
                  </label>

                  {status === 'error' && <p className="join-form-error">{errorMsg}</p>}

                  <button type="submit" className="cta-btn lg full" disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Submitting…' : 'Submit'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
