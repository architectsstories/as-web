import {NextResponse} from 'next/server'
import {writeClient} from '../../../lib/sanityWriteClient'

const VALID_ROLES = ['Architect', 'Designer', 'Studio', 'Maker', 'Mentor', 'Material Brand', 'Student', 'Other']

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({error: 'Invalid request body.'}, {status: 400})
  }

  const {name, email, role, roleCustom, location, portfolioUrl, message} = body || {}

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({error: 'Name is required.'}, {status: 400})
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({error: 'A valid email is required.'}, {status: 400})
  }

  if (!process.env.SANITY_API_TOKEN) {
    console.error('SANITY_API_TOKEN is not set — cannot save join application.')
    return NextResponse.json(
      {error: 'The form is not fully configured yet. Please try again later.'},
      {status: 500}
    )
  }

  try {
    await writeClient.create({
      _type: 'joinApplication',
      name: name.trim(),
      email: email.trim(),
      role: VALID_ROLES.includes(role) ? role : undefined,
      roleCustom: roleCustom ? String(roleCustom).trim().slice(0, 30) : undefined,
      location: location ? String(location).trim() : undefined,
      portfolioUrl: portfolioUrl ? String(portfolioUrl).trim() : undefined,
      message: message ? String(message).trim() : undefined,
      status: 'New',
      submittedAt: new Date().toISOString(),
    })

    return NextResponse.json({ok: true})
  } catch (err) {
    console.error('Failed to save join application:', err)
    return NextResponse.json({error: 'Something went wrong. Please try again.'}, {status: 500})
  }
}
