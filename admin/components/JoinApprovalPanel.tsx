import {useState} from 'react'
import {useClient, useDocumentOperation, useFormValue} from 'sanity'
import type {InputProps} from 'sanity'
import {Box, Button, Card, Flex, Text} from '@sanity/ui'

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

// This replaces the plain "Added to Community" toggle with two real
// buttons, always both visible, always both clickable independently:
//   - Publish: the document's normal publish, exactly as if you'd used
//     the button at the bottom of the screen. Use this to just save/keep
//     the application record without approving anyone yet.
//   - Approve & Add to Community: creates the draft Person AND publishes
//     this application (marking it Approved) in one click.
// Neither button depends on finding a menu, and neither one replaces the
// other — they're two separate actions sitting side by side.
export function JoinApprovalPanel(props: InputProps) {
  const doc = useFormValue([]) as any
  const client = useClient({apiVersion: '2024-01-01'})
  const baseId = String(doc?._id || '').replace(/^drafts\./, '')
  const {publish} = useDocumentOperation(baseId, 'joinApplication')
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState('')

  const alreadyAdded = doc?.personCreated === true

  async function handleApprove() {
    setIsRunning(true)
    setError('')
    try {
      const baseSlug = slugify(doc?.name)
      let slug = baseSlug
      const existing = await client.fetch(
        `count(*[_type == "person" && slug.current == $slug])`,
        {slug}
      )
      if (existing > 0) {
        slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
      }

      // A COA number means this is a verified architect — prefix "Ar." on
      // their new Person record, unless they already typed it themselves.
      const hasCoa = Boolean(doc?.coaNumber && String(doc.coaNumber).trim())
      let personName = String(doc?.name || '').trim()
      if (hasCoa && !/^ar\.?\s/i.test(personName)) {
        personName = `Ar. ${personName}`
      }

      // Created as a DRAFT on purpose — nothing goes live automatically.
      // It shows up in People ready for review; publishing it from there
      // is what puts it on the website.
      await client.create({
        _id: newDraftId(`person-${slug}`),
        _type: 'person',
        name: personName,
        slug: {_type: 'slug', current: slug},
        role: doc?.role || 'Other',
        roleCustom: doc?.roleCustom,
        location: doc?.location,
        mobile: doc?.mobile,
        photo: doc?.photo,
        coaNumber: hasCoa ? doc.coaNumber : undefined,
        portfolioUrl: doc?.portfolioUrl,
        bio: doc?.message,
      })

      // Patch whichever versions of this document exist, then publish so
      // the application itself ends up in a clean, published state too.
      await client.patch(`drafts.${baseId}`).set({status: 'Approved', personCreated: true}).commit({autoGenerateArrayKeys: true}).catch(() => {})
      await client.patch(baseId).set({status: 'Approved', personCreated: true}).commit({autoGenerateArrayKeys: true}).catch(() => {})
      publish.execute()
    } catch (err) {
      console.error('Failed to approve and add person:', err)
      setError('Something went wrong — check the browser console for details.')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <Card padding={3} radius={2} tone={alreadyAdded ? 'positive' : 'default'} border>
      <Flex gap={3} align="center" wrap="wrap">
        <Button
          text="Publish"
          tone="default"
          mode="ghost"
          disabled={Boolean(publish.disabled)}
          onClick={() => publish.execute()}
        />
        <Button
          text={isRunning ? 'Adding…' : alreadyAdded ? 'Already Added to Community ✓' : 'Approve & Add to Community'}
          tone={alreadyAdded ? 'positive' : 'primary'}
          disabled={isRunning || alreadyAdded}
          onClick={handleApprove}
        />
      </Flex>
      <Box marginTop={3}>
        <Text size={1} muted>
          <strong>Publish</strong> just saves this application as-is.{' '}
          <strong>Approve &amp; Add to Community</strong> creates a draft Person and
          publishes this application as Approved, in one click.
        </Text>
      </Box>
      {error && (
        <Box marginTop={2}>
          <Text size={1} style={{color: '#e8392c'}}>{error}</Text>
        </Box>
      )}
    </Card>
  )
}
