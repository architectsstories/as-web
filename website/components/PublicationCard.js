import Link from 'next/link'
import { urlFor } from '../lib/image'
import { formatPostedDate } from '../lib/formatDate'

export default function PublicationCard({ post }) {
  return (
    <Link className="pub-card" href={`/projects/${post.slug}`}>
      <div className="pub-thumb">
        {post.mainImage && (
          <img src={urlFor(post.mainImage).width(560).height(370).url()} alt={post.title} />
        )}
        {post.location && <span className="pub-loc">{post.location}</span>}
      </div>
      <div className="pub-body">
        {post.category && <span className="pub-cat">{post.category}</span>}
        <h4 className="pub-title">{post.title}</h4>
        {post.excerpt && <p className="pub-excerpt">{post.excerpt}</p>}
        {post.category && (
          <div className="pub-tagrow">
            <span className="pub-tag">{post.category}</span>
          </div>
        )}
        <div className="pub-date">{formatPostedDate(post._createdAt)}</div>
      </div>
    </Link>
  )
}
