'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '../lib/image'

function excerptFromBlocks(blocks, maxLength = 140) {
  if (!Array.isArray(blocks)) return null
  const firstText = blocks
    .find((b) => b._type === 'block' && b.children?.length)
    ?.children.map((c) => c.text).join('')

  if (!firstText) return null
  if (firstText.length <= maxLength) return firstText

  const truncated = firstText.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`
}

export default function HeroCarousel({ slides }) {
  const [index, setIndex] = useState(0)
  const total = slides.length

  useEffect(() => {
    if (total < 2) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % total)
    }, 7000)
    return () => clearInterval(timer)
  }, [total])

  if (total === 0) {
    return (
      <section className="hero" style={{padding: 0}}>
        <div className="scrim" />
        <div className="hero-inner">
          <h1 className="hero-h">Add Hero Slides in the Featured module<span className="red">.</span></h1>
        </div>
      </section>
    )
  }

  const slide = slides[index]
  const excerpt = excerptFromBlocks(slide.description)

  const goTo = (i) => setIndex(((i % total) + total) % total)

  return (
    <section className="hero" style={{padding: 0}}>
      {slide.mainImage && (
        <Image
          key={slide.slug}
          className="bg"
          src={urlFor(slide.mainImage).width(2200).url()}
          alt={slide.title}
          fill
          priority
        />
      )}
      <div className="scrim" />
      <div className="hero-inner">
        <div className="hero-eyebrow"><span className="dot" />FEATURED PROJECT<span className="red">.</span></div>
        <h1 className="hero-h">{slide.title}<span className="red">.</span></h1>
        {excerpt && <p className="hero-sub">{excerpt}</p>}
        <p className="hero-meta">{[slide.location, slide.category].filter(Boolean).join(' — ')}</p>
        <Link className="hero-cta" href={`/projects/${slide.slug}`}>View Project →</Link>

        {total > 1 && (
          <button
            type="button"
            className="hero-pagination"
            onClick={() => goTo(index + 1)}
            aria-label={`Show next hero slide (${index + 2 > total ? 1 : index + 2} of ${total})`}
          >
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </button>
        )}
      </div>
    </section>
  )
}
