import {NextResponse} from 'next/server'
import {writeClient} from '../../../lib/sanityWriteClient'

const VALID_PLANS = ['Essential', 'Studio', 'Showcase', 'Signature', 'Not sure']
const VALID_TYPES = ['Residential', 'Commercial', 'Hospitality', 'Institutional', 'Landscape', 'Interior', 'Other']

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({error: 'Invalid request body.'}, {status: 400})
  }

  const {
    name, email, phone,
    projectTitle, projectType, location, area, year, concept,
    architectCredit, photographerCredit, collaboratorCredits,
    plan,
    driveLink, shootDate, siteAddress, additionalNotes,
  } = body || {}

  if (!name || typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({error: 'Name is required.'}, {status: 400})
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({error: 'A valid email is required.'}, {status: 400})
  }
  if (!projectTitle || typeof projectTitle !== 'string' || !projectTitle.trim()) {
    return NextResponse.json({error: 'Project title is required.'}, {status: 400})
  }

  if (!process.env.SANITY_API_TOKEN) {
    console.error('SANITY_API_TOKEN is not set — cannot save submission.')
    return NextResponse.json(
      {error: 'The form is not fully configured yet. Please try again later.'},
      {status: 500}
    )
  }

  try {
    await writeClient.create({
      _type: 'submission',
      name: name.trim(),
      email: email.trim(),
      phone: phone ? String(phone).trim() : undefined,
      projectTitle: projectTitle.trim(),
      projectType: VALID_TYPES.includes(projectType) ? projectType : undefined,
      location: location ? String(location).trim() : undefined,
      area: area ? String(area).trim() : undefined,
      year: year ? String(year).trim() : undefined,
      concept: concept ? String(concept).trim() : undefined,
      architectCredit: architectCredit ? String(architectCredit).trim() : undefined,
      photographerCredit: photographerCredit ? String(photographerCredit).trim() : undefined,
      collaboratorCredits: collaboratorCredits ? String(collaboratorCredits).trim() : undefined,
      plan: VALID_PLANS.includes(plan) ? plan : undefined,
      driveLink: driveLink ? String(driveLink).trim() : undefined,
      shootDate: shootDate ? String(shootDate).trim() : undefined,
      siteAddress: siteAddress ? String(siteAddress).trim() : undefined,
      additionalNotes: additionalNotes ? String(additionalNotes).trim() : undefined,
      status: 'New',
      submittedAt: new Date().toISOString(),
    })

    return NextResponse.json({ok: true})
  } catch (err) {
    console.error('Failed to save submission:', err)
    return NextResponse.json({error: 'Something went wrong. Please try again.'}, {status: 500})
  }
}
