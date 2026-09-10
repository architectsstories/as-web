'use client'

import { useRef } from 'react'
import Link from 'next/link'
import PublicationCard from './PublicationCard'

export default function PopularPostsScroller({ posts }) {
  const scrollerRef = useRef(null)

  function scroll(direction) {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: direction * 320, behavior: 'smooth' })
  }

  return (
    <>
      <div className="section-head">
        <div>
          <div className="eyebrow-dot"><span className="dot" /><h2>Popular Posts</h2></div>
          <p className="section-lede">The projects readers keep coming back to.</p>
        </div>
        <div className="scroll-head-right">
          <div className="scroll-arrows">
            <button type="button" className="scroll-arrow" onClick={() => scroll(-1)} aria-label="Scroll left">‹</button>
            <button type="button" className="scroll-arrow" onClick={() => scroll(1)} aria-label="Scroll right">›</button>
          </div>
          <Link className="view-all" href="/projects">View all</Link>
        </div>
      </div>
      <div className="popular-scroll" ref={scrollerRef}>
        {posts.map((p) => (
          <div className="popular-scroll-item" key={p.slug}>
            <PublicationCard post={p} />
          </div>
        ))}
      </div>
    </>
  )
}
