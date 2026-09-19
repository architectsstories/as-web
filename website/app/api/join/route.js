import {NextResponse} from 'next/server'
import {writeClient} from '../../../lib/sanityWriteClient'

const VALID_ROLES = ['Architect', 'Designer', 'Studio', 'Maker', 'Mentor', 'Material Brand', 'Student', 'Other']

// "data:image/png;base64,iVBORw0..." → {contentType, buffer}
function decodeDataUrl(dataUrl) {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl || '')
  if (!match) return null
  const [, contentType, base64] = match
  return {contentType, buffer: Buffer.from(base64, 'base64')}
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({error: 'Invalid request body.'}, {status: 400})
  }

  const {name, email, mobile, role, roleCustom, coaNumber, location, portfolioUrl, message, photoDataUrl} = body || {}

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
    let photo
    if (photoDataUrl) {
      const decoded = decodeDataUrl(photoDataUrl)
      // A photo that fails to decode shouldn't block the whole application —
      // it just gets skipped, same as if the applicant hadn't attached one.
      if (decoded) {
        if (decoded.buffer.length > 5 * 1024 * 1024) {
          return NextResponse.json({error: 'Photo must be under 5MB.'}, {status: 400})
        }
        const ext = decoded.contentType.split('/')[1] || 'jpg'
        const asset = await writeClient.assets.upload('image', decoded.buffer, {
          filename: `join-${Date.now()}.${ext}`,
          contentType: decoded.contentType,
        })
        photo = {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
      }
    }

    const isArchitect = role === 'Architect'

    await writeClient.create({
      _type: 'joinApplication',
      name: name.trim(),
      email: email.trim(),
      mobile: mobile ? String(mobile).trim() : undefined,
      role: VALID_ROLES.includes(role) ? role : undefined,
      roleCustom: roleCustom ? String(roleCustom).trim().slice(0, 30) : undefined,
      coaNumber: isArchitect && coaNumber ? String(coaNumber).trim() : undefined,
      location: location ? String(location).trim() : undefined,
      portfolioUrl: portfolioUrl ? String(portfolioUrl).trim() : undefined,
      message: message ? String(message).trim() : undefined,
      photo,
      status: 'New',
      submittedAt: new Date().toISOString(),
    })

    return NextResponse.json({ok: true})
  } catch (err) {
    console.error('Failed to save join application:', err)
    return NextResponse.json({error: 'Something went wrong. Please try again.'}, {status: 500})
  }
}
