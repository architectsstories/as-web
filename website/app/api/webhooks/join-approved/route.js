import {NextResponse} from 'next/server'
import {writeClient} from '../../../../lib/sanityWriteClient'

// This is what makes "set Status to Approved, then hit Publish" actually
// move someone into People — no button to find, no menu to dig through.
// It's triggered by a Sanity webhook configured in manage.sanity.io
// (see website/README.md for the exact setup), which POSTs here whenever
// a joinApplication is published matching the webhook's GROQ filter.

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function newDraftId(prefix) {
  return `drafts.${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export async function POST(request) {
  // Shared-secret check — set as a custom header in the webhook's config
  // in manage.sanity.io, and as SANITY_WEBHOOK_SECRET here / in Vercel.
  // Without this, anyone who found this URL could create fake People.
  const secret = request.headers.get('x-webhook-secret')
  if (!process.env.SANITY_WEBHOOK_SECRET || secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({error: 'Unauthorized'}, {status: 401})
  }

  let doc
  try {
    doc = await request.json()
  } catch {
    return NextResponse.json({error: 'Invalid payload'}, {status: 400})
  }

  // The webhook's GROQ filter already restricts this to
  // status == "Approved" && personCreated != true, but checking again
  // here costs nothing and protects against a misconfigured filter.
  if (doc?._type !== 'joinApplication' || doc?.status !== 'Approved' || doc?.personCreated === true) {
    return NextResponse.json({ok: true, skipped: true})
  }

  try {
    const baseSlug = slugify(doc.name)
    let slug = baseSlug
    const existing = await writeClient.fetch(
      `count(*[_type == "person" && slug.current == $slug])`,
      {slug}
    )
    if (existing > 0) {
      slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
    }

    // A COA number means this is a verified architect — prefix "Ar." on
    // their new Person record, unless they already typed it themselves.
    const hasCoa = Boolean(doc.coaNumber && String(doc.coaNumber).trim())
    let personName = String(doc.name || '').trim()
    if (hasCoa && !/^ar\.?\s/i.test(personName)) {
      personName = `Ar. ${personName}`
    }

    // Created as a DRAFT on purpose — nothing goes live automatically.
    // It shows up in People ready for review; publishing it from there
    // is what puts it on the website.
    await writeClient.create({
      _id: newDraftId(`person-${slug}`),
      _type: 'person',
      name: personName,
      slug: {_type: 'slug', current: slug},
      role: doc.role || 'Other',
      roleCustom: doc.roleCustom,
      location: doc.location,
      mobile: doc.mobile,
      photo: doc.photo,
      coaNumber: hasCoa ? doc.coaNumber : undefined,
      portfolioUrl: doc.portfolioUrl,
      bio: doc.message,
    })

    await writeClient.patch(doc._id).set({personCreated: true}).commit()

    return NextResponse.json({ok: true, created: personName})
  } catch (err) {
    console.error('Webhook failed to create person from join application:', err)
    return NextResponse.json({error: 'Failed to create Person'}, {status: 500})
  }
}
