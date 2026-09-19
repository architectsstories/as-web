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

        // A COA number means this is a verified architect — prefix "Ar."
        // on their new Person record, unless they already typed it themselves.
        const hasCoa = Boolean(doc.coaNumber && String(doc.coaNumber).trim())
        let personName = String(doc.name || '').trim()
        if (hasCoa && !/^ar\.?\s/i.test(personName)) {
          personName = `Ar. ${personName}`
        }

        await client.create({
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
