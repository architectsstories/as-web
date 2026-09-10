import {NextResponse} from 'next/server'
import {writeClient} from '../../../lib/sanityWriteClient'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({error: 'Invalid request body.'}, {status: 400})
  }

  const {slug} = body || {}
  if (!slug || typeof slug !== 'string') {
    return NextResponse.json({error: 'Missing slug.'}, {status: 400})
  }

  if (!process.env.SANITY_API_TOKEN) {
    // Not configured — silently no-op so it never breaks a page load.
    return NextResponse.json({ok: false})
  }

  try {
    const doc = await writeClient.fetch(
      `*[_type == "project" && slug.current == $slug][0]{_id}`,
      {slug}
    )
    if (!doc?._id) {
      return NextResponse.json({ok: false}, {status: 404})
    }

    await writeClient.patch(doc._id).setIfMissing({viewCount: 0}).inc({viewCount: 1}).commit()
    return NextResponse.json({ok: true})
  } catch (err) {
    console.error('Failed to track project view:', err)
    return NextResponse.json({ok: false}, {status: 500})
  }
}
