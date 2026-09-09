import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { client } from '../../../lib/sanity'
import { urlFor } from '../../../lib/image'
import { storyBySlugQuery } from '../../../lib/queries'

export const revalidate = 60

export default async function StoryDetailPage({ params }) {
  const story = await client.fetch(storyBySlugQuery, { slug: params.slug })

  if (!story) {
    return (
      <div className="wrap">
        <div className="empty-state">Story not found.</div>
      </div>
    )
  }

  return (
    <div className="wrap">
      <div className="crumb">
        <Link href="/">Home</Link><span>/</span>
        <Link href="/stories">Stories</Link><span>/</span>
        <span style={{color:'var(--black)'}}>{story.title}</span>
      </div>

      <div className="detail-hero">
        {story.mainImage && <img className="bg" src={urlFor(story.mainImage).width(2000).url()} alt={story.title} />}
        <div className="scrim" />
        <div className="detail-hero-inner">
          <h1>{story.title}</h1>
        </div>
      </div>

      <div className="detail-meta-strip">
        <div className="item"><div className="l">Category</div><div className="v">{story.category || '—'}</div></div>
        <div className="item"><div className="l">Studio</div><div className="v">{story.studio || '—'}</div></div>
        <div className="item"><div className="l">Location</div><div className="v">{story.location || '—'}</div></div>
        <div className="item"><div className="l">Year</div><div className="v">{story.year || '—'}</div></div>
      </div>

      {story.description && (
        <div className="detail-body">
          <PortableText value={story.description} />
        </div>
      )}

      {story.gallery?.length > 0 && (
        <div className="gallery-grid">
          {story.gallery.map((img, i) => (
            <img key={i} src={urlFor(img).width(900).height(650).url()} alt="" />
          ))}
        </div>
      )}
    </div>
  )
}
