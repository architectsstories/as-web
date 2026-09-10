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

export const approveAndAddPersonAction: DocumentActionComponent = (props: DocumentActionProps) => {
  const {id, type, draft, published, onComplete} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const {patch, publish} = useDocumentOperation(id, type)
  const [isRunning, setIsRunning] = useState(false)

  if (type !== 'joinApplication') return null

  const doc: any = draft || published
  if (!doc) return null

  const alreadyAccepted = doc.status === 'Accepted'

  return {
    label: isRunning ? 'Adding…' : alreadyAccepted ? 'Already in Community' : 'Approve & Add to Community',
    disabled: isRunning || alreadyAccepted,
    onHandle: async () => {
      setIsRunning(true)
      try {
        const baseSlug = slugify(doc.name)
        let slug = baseSlug
        // avoid clashing with an existing person slug
        const existing = await client.fetch(
          `count(*[_type == "person" && slug.current == $slug])`,
          {slug}
        )
        if (existing > 0) {
          slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
        }

        await client.create({
          _type: 'person',
          name: doc.name,
          slug: {_type: 'slug', current: slug},
          role: doc.role || 'Other',
          roleCustom: doc.roleCustom,
          location: doc.location,
          portfolioUrl: doc.portfolioUrl,
          bio: doc.message,
        })

        patch.execute([{set: {status: 'Accepted'}}])
        publish.execute()
      } catch (err) {
        console.error('Failed to approve and add person:', err)
        // eslint-disable-next-line no-alert
        alert('Something went wrong creating the Person entry. Check the console for details.')
      } finally {
        setIsRunning(false)
        onComplete()
      }
    },
  }
}
