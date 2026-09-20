import {useState} from 'react'
import {useClient, useDocumentOperation} from 'sanity'
import type {DocumentActionComponent, DocumentActionProps} from 'sanity'

function slugify(input: string) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function newDraftId(prefix: string) {
  return `drafts.${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

// Project's Category options don't include "Other" — a submission's
// Project Type does. Anything that doesn't match exactly is left blank
// rather than saving an invalid value.
const PROJECT_CATEGORIES = ['Residential', 'Institutional', 'Hospitality', 'Commercial', 'Interior', 'Landscape']

export const publishSubmissionAsProjectAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const {id, type, draft, published, onComplete} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const {patch, publish} = useDocumentOperation(id, type)
  const [isRunning, setIsRunning] = useState(false)

  if (type !== 'submission') return null

  const doc: any = draft || published
  if (!doc) return null

  // Tracked by a dedicated field, not the Status radio — same reasoning
  // as the Join Application action: someone can set Status to "Completed"
  // by hand without this action ever running.
  const alreadySent = doc.projectCreated === true

  return {
    label: isRunning ? 'Sending…' : alreadySent ? 'Already Sent to Projects' : 'Create Draft Project',
    disabled: isRunning || alreadySent || !doc.projectTitle,
    onHandle: async () => {
      setIsRunning(true)
      try {
        const baseSlug = slugify(doc.projectTitle)
        let slug = baseSlug
        const existing = await client.fetch(
          `count(*[_type == "project" && slug.current == $slug])`,
          {slug}
        )
        if (existing > 0) {
          slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
        }

        const category = PROJECT_CATEGORIES.includes(doc.projectType) ? doc.projectType : undefined
        const year = doc.year && !Number.isNaN(Number(doc.year)) ? Number(doc.year) : undefined

        // Created as a DRAFT — no mainImage exists yet (submissions only
        // ever have a Drive link, never an uploaded file), so this can't
        // be published as-is. It shows up in Projects ready for someone to
        // open, pull the real photos from the Drive link, add a Main
        // Image + Gallery, and publish from there.
        await client.create({
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

        patch.execute([{set: {status: 'Completed', projectCreated: true}}])
        publish.execute()
        // eslint-disable-next-line no-alert
        alert(
          `Draft created in Projects — open "${doc.projectTitle}" there. It has no Main Image yet ` +
          `(submissions only ever include a Drive link, never uploaded files) — pull the photos from ` +
          `this submission's Drive link, add a Main Image and Gallery, then publish.`
        )
      } catch (err) {
        console.error('Failed to create project from submission:', err)
        // eslint-disable-next-line no-alert
        alert('Something went wrong creating the Project entry. Check the console for details.')
      } finally {
        setIsRunning(false)
        onComplete()
      }
    },
  }
}
