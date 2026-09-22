import {NextResponse} from 'next/server'
import {writeClient} from '../../../../lib/sanityWriteClient'

// Same mechanism as /api/webhooks/join-approved — set Status to Completed
// on a Work Submission, hit Publish, and this creates the draft Project
// automatically. See website/README.md for the Sanity webhook setup.

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

// Project's Category options don't include "Other" — a submission's
// Project Type does. Anything that doesn't match exactly is left blank
// rather than saving an invalid value.
const PROJECT_CATEGORIES = ['Residential', 'Institutional', 'Hospitality', 'Commercial', 'Interior', 'Landscape']

export async function POST(request) {
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

  if (doc?._type !== 'submission' || doc?.status !== 'Completed' || doc?.projectCreated === true) {
    return NextResponse.json({ok: true, skipped: true})
  }
  if (!doc.projectTitle) {
    return NextResponse.json({ok: true, skipped: true, reason: 'no projectTitle'})
  }

  try {
    const baseSlug = slugify(doc.projectTitle)
    let slug = baseSlug
    const existing = await writeClient.fetch(
      `count(*[_type == "project" && slug.current == $slug])`,
      {slug}
    )
    if (existing > 0) {
      slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
    }

    const category = PROJECT_CATEGORIES.includes(doc.projectType) ? doc.projectType : undefined
    const year = doc.year && !Number.isNaN(Number(doc.year)) ? Number(doc.year) : undefined

    // Created as a DRAFT — no mainImage exists yet (submissions only ever
    // have a Drive link, never an uploaded file), so this can't be
    // published as-is. It shows up in Projects ready for someone to pull
    // the real photos from the Drive link, add a Main Image + Gallery,
    // and publish from there.
    await writeClient.create({
      _id: newDraftId(`project-${slug}`),
      _type: 'project',
      title: doc.projectTitle,
      slug: {_type: 'slug', current: slug},
      studio: doc.architectCredit,
      location: doc.location,
      category,
      area: doc.area,
      year,
      description: doc.concept
        ? [{_type: 'block', style: 'normal', children: [{_type: 'span', text: doc.concept}]}]
        : undefined,
    })

    await writeClient.patch(doc._id).set({projectCreated: true}).commit()

    return NextResponse.json({ok: true, created: doc.projectTitle})
  } catch (err) {
    console.error('Webhook failed to create project from submission:', err)
    return NextResponse.json({error: 'Failed to create Project'}, {status: 500})
  }
}
