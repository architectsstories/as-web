import {NextResponse} from 'next/server'
import {writeClient} from '../../../lib/sanityWriteClient'

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({error: 'Invalid request body.'}, {status: 400})
  }

  const {name, email, phone, message, courseTitle, courseSlug} = body || {}

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({error: 'Name is required.'}, {status: 400})
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({error: 'A valid email is required.'}, {status: 400})
  }

  if (!process.env.SANITY_API_TOKEN) {
    console.error('SANITY_API_TOKEN is not set — cannot save enrollment.')
    return NextResponse.json(
      {error: 'The form is not fully configured yet. Please try again later.'},
      {status: 500}
    )
  }

  try {
    await writeClient.create({
      _type: 'enrollment',
      name: name.trim(),
      email: email.trim(),
      phone: phone ? String(phone).trim() : undefined,
      courseTitle: courseTitle ? String(courseTitle).trim() : undefined,
      courseSlug: courseSlug ? String(courseSlug).trim() : undefined,
      message: message ? String(message).trim() : undefined,
      status: 'New',
      submittedAt: new Date().toISOString(),
    })

    return NextResponse.json({ok: true})
  } catch (err) {
    console.error('Failed to save enrollment:', err)
    return NextResponse.json({error: 'Something went wrong. Please try again.'}, {status: 500})
  }
}
