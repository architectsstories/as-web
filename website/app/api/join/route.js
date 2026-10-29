import {NextResponse} from 'next/server'
import {writeClient} from '../../../lib/sanityWriteClient'

const VALID_CATEGORIES = ['architectFirm', 'vendorBrand', 'industryProfessional', 'community']
const VALID_ROLES = ['Architect', 'Designer', 'Studio', 'Maker', 'Mentor', 'Student', 'Other']
const VALID_VENDOR_CATEGORIES = ['Surfaces', 'Lighting', 'Furniture', 'Sanitary', 'Hardware', 'Materials', 'Other']

function decodeDataUrl(dataUrl) {
  const match = String(dataUrl || '').match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
  if (!match) return null
  return {contentType: match[1], buffer: Buffer.from(match[2], 'base64')}
}

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({error: 'Invalid request body.'}, {status: 400})
  }

  const {
    category,
    organizationName,
    contactName,
    name,
    email,
    mobile,
    location,
    website,
    portfolioUrl,
    role,
    roleCustom,
    coaNumber,
    specialization,
    vendorCategory,
    message,
    photoDataUrl,
  } = body || {}

  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({error: 'Please choose a valid category.'}, {status: 400})
  }

  const primaryName = category === 'community' || category === 'industryProfessional' ? name : organizationName
  if (!primaryName || typeof primaryName !== 'string' || !primaryName.trim()) {
    return NextResponse.json({error: 'Name is required.'}, {status: 400})
  }

  if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    return NextResponse.json({error: 'A valid email is required.'}, {status: 400})
  }

  if (category === 'community' && !VALID_ROLES.includes(role)) {
    return NextResponse.json({error: 'Please select a community role.'}, {status: 400})
  }

  if (category === 'industryProfessional' && (!specialization || !String(specialization).trim())) {
    return NextResponse.json({error: 'Specialization is required.'}, {status: 400})
  }

  if (!process.env.SANITY_API_TOKEN) {
    console.error('SANITY_API_TOKEN is not set — cannot save join application.')
    return NextResponse.json({error: 'The form is not fully configured yet. Please try again later.'}, {status: 500})
  }

  try {
    let photo
    if (photoDataUrl) {
      const decoded = decodeDataUrl(photoDataUrl)
      if (!decoded) return NextResponse.json({error: 'Invalid photo.'}, {status: 400})
      if (decoded.buffer.length > 5 * 1024 * 1024) return NextResponse.json({error: 'Photo must be under 5MB.'}, {status: 400})
      const ext = decoded.contentType.split('/')[1] || 'jpg'
      const asset = await writeClient.assets.upload('image', decoded.buffer, {
        filename: `join-${Date.now()}.${ext}`,
        contentType: decoded.contentType,
      })
      photo = {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
    }

    await writeClient.create({
      _type: 'joinApplication',
      category,
      name: name ? String(name).trim() : undefined,
      organizationName: organizationName ? String(organizationName).trim() : undefined,
      contactName: contactName ? String(contactName).trim() : undefined,
      email: email.trim(),
      mobile: mobile ? String(mobile).trim() : undefined,
      location: location ? String(location).trim() : undefined,
      website: website ? String(website).trim() : undefined,
      portfolioUrl: portfolioUrl ? String(portfolioUrl).trim() : undefined,
      role: VALID_ROLES.includes(role) ? role : undefined,
      roleCustom: roleCustom ? String(roleCustom).trim().slice(0, 30) : undefined,
      coaNumber: category === 'community' && role === 'Architect' && coaNumber ? String(coaNumber).trim() : undefined,
      specialization: specialization ? String(specialization).trim() : undefined,
      vendorCategory: VALID_VENDOR_CATEGORIES.includes(vendorCategory) ? vendorCategory : undefined,
      message: message ? String(message).trim() : undefined,
      photo,
      status: 'New',
      draftCreated: false,
      submittedAt: new Date().toISOString(),
    })

    return NextResponse.json({ok: true})
  } catch (err) {
    console.error('Failed to save join application:', err)
    return NextResponse.json({error: 'Something went wrong. Please try again.'}, {status: 500})
  }
}
