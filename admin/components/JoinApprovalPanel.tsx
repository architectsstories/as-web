import {useState} from 'react'
import {useClient, useDocumentOperation, useEditState, useFormValue} from 'sanity'
import type {InputProps} from 'sanity'
import {Box, Button, Card, Flex, Text} from '@sanity/ui'

function slugify(input: string) {
  return String(input || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function newDraftId(prefix: string) {
  return `drafts.${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

const CATEGORY_META: Record<string, {label: string; type: string}> = {
  architectFirm: {label: 'Architects & Firms', type: 'architectFirm'},
  vendorBrand: {label: 'Vendors & Brands', type: 'vendorBrand'},
  industryProfessional: {label: 'Industry Professionals', type: 'industryProfessional'},
  community: {label: 'Community', type: 'person'},
}

export function JoinApprovalPanel(props: InputProps) {
  const doc = useFormValue([]) as any
  const client = useClient({apiVersion: '2024-01-01'})
  const baseId = String(doc?._id || '').replace(/^drafts\./, '')
  const {publish} = useDocumentOperation(baseId, 'joinApplication')
  const {published} = useEditState(baseId, 'joinApplication')
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState('')

  const isPublishedApproved = (published as any)?.status === 'Approved'
  const alreadyMoved = (published as any)?.draftCreated === true
  const category = doc?.category as string
  const meta = CATEGORY_META[category]

  async function handleMoveToDraft() {
    if (!meta) return
    setIsRunning(true)
    setError('')
    try {
      const sourceName = String(doc?.organizationName || doc?.name || '').trim()
      const baseSlug = slugify(sourceName)
      let slug = baseSlug
      const existing = await client.fetch(
        `count(*[_type == $type && slug.current == $slug])`,
        {type: meta.type, slug}
      )
      if (existing > 0) slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`

      if (category === 'architectFirm') {
        await client.create({_id: newDraftId(`architect-firm-${slug}`), _type: 'architectFirm', name: sourceName, slug: {_type: 'slug', current: slug}, location: doc?.location, image: doc?.photo, website: doc?.website, description: doc?.message, isEnabled: true})
      }

      if (category === 'vendorBrand') {
        await client.create({_id: newDraftId(`vendor-brand-${slug}`), _type: 'vendorBrand', name: sourceName, slug: {_type: 'slug', current: slug}, category: doc?.vendorCategory, location: doc?.location, image: doc?.photo, website: doc?.website, description: doc?.message, isEnabled: true})
      }

      if (category === 'industryProfessional') {
        await client.create({_id: newDraftId(`industry-professional-${slug}`), _type: 'industryProfessional', name: sourceName, slug: {_type: 'slug', current: slug}, specialization: doc?.specialization, location: doc?.location, photo: doc?.photo, website: doc?.portfolioUrl || doc?.website, description: doc?.message, isEnabled: true})
      }

      if (category === 'community') {
        const hasCoa = Boolean(doc?.coaNumber && String(doc.coaNumber).trim())
        let personName = String(doc?.name || '').trim()
        if (hasCoa && !/^ar\.?\s/i.test(personName)) personName = `Ar. ${personName}`
        await client.create({_id: newDraftId(`person-${slug}`), _type: 'person', name: personName, slug: {_type: 'slug', current: slug}, isEnabled: true, role: doc?.role || 'Other', roleCustom: doc?.roleCustom, location: doc?.location, mobile: doc?.mobile, photo: doc?.photo, coaNumber: hasCoa ? doc.coaNumber : undefined, portfolioUrl: doc?.portfolioUrl, bio: doc?.message})
      }

      await client.patch(`drafts.${baseId}`).set({draftCreated: true}).commit({autoGenerateArrayKeys: true}).catch(() => {})
      await client.patch(baseId).set({draftCreated: true}).commit({autoGenerateArrayKeys: true}).catch(() => {})
      publish.execute()
    } catch (err) {
      console.error('Failed to move join application to category draft:', err)
      setError('Something went wrong — check the browser console for details.')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <Card padding={3} radius={2} tone={alreadyMoved ? 'positive' : 'default'} border>
      <Flex gap={3} align="center" wrap="wrap">
        <Button text="Publish" tone="default" mode="ghost" disabled={Boolean(publish.disabled)} onClick={() => publish.execute()} />
        {isPublishedApproved && meta && (
          <Button
            text={isRunning ? 'Moving…' : alreadyMoved ? `Moved to ${meta.label} Draft ✓` : `Move to ${meta.label} Draft`}
            tone={alreadyMoved ? 'positive' : 'primary'}
            disabled={isRunning || alreadyMoved}
            onClick={handleMoveToDraft}
          />
        )}
      </Flex>
      <Box marginTop={3}>
        {isPublishedApproved && meta ? (
          <Text size={1} muted>
            This application will create a <strong>draft</strong> in <strong>{meta.label}</strong>. It will not appear on the public website until you review and publish that draft.
          </Text>
        ) : (
          <Text size={1} muted>
            Set Status to <strong>Approved</strong> and click <strong>Publish</strong>. Then the category-specific draft action will appear here.
          </Text>
        )}
      </Box>
      {error && <Box marginTop={2}><Text size={1} style={{color: '#e8392c'}}>{error}</Text></Box>}
    </Card>
  )
}
