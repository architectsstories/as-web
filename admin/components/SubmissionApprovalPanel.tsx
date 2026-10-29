import {useState} from 'react'
import {useClient, useDocumentOperation, useEditState, useFormValue} from 'sanity'
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

// Project's Category options don't include "Other" — a submission's
// Project Type does. Anything that doesn't match exactly is left blank
// rather than saving an invalid value.
const PROJECT_CATEGORIES = ['Residential', 'Institutional', 'Hospitality', 'Commercial', 'Interior', 'Landscape']

// Same two-step gate as JoinApprovalPanel: set Status → Completed, click
// Publish, and only once this submission is genuinely PUBLISHED as
// Completed does "Create Draft Project" appear at all. See that file for
// the full reasoning.
export function SubmissionApprovalPanel(props: InputProps) {
  const doc = useFormValue([]) as any
  const client = useClient({apiVersion: '2024-01-01'})
  const baseId = String(doc?._id || '').replace(/^drafts\./, '')
  const {publish} = useDocumentOperation(baseId, 'submission')
  const {published} = useEditState(baseId, 'submission')
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState('')

  const isPublishedCompleted = (published as any)?.status === 'Completed'
  const alreadySent = (published as any)?.projectCreated === true

  async function handleCreateProject() {
    setIsRunning(true)
    setError('')
    try {
      if (!doc?.projectTitle) {
        setError('This submission has no Project Title yet — add one before creating a Project.')
        setIsRunning(false)
        return
      }

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
      // ever have a Drive link, never an uploaded file), so this can't be
      // published as-is. It shows up in Projects ready for someone to
      // pull the real photos from the Drive link, add a Main Image +
      // Gallery, and publish from there.
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

      // Flip the tracking flag on both draft and published copies, and
      // publish, so nothing is left as an unpublished edit afterward.
      await client.patch(`drafts.${baseId}`).set({projectCreated: true}).commit({autoGenerateArrayKeys: true}).catch(() => {})
      await client.patch(baseId).set({projectCreated: true}).commit({autoGenerateArrayKeys: true}).catch(() => {})
      publish.execute()
    } catch (err) {
      console.error('Failed to create project from submission:', err)
      setError('Something went wrong — check the browser console for details.')
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <Card padding={3} radius={2} tone={alreadySent ? 'positive' : 'default'} border>
      <Flex gap={3} align="center" wrap="wrap">
        <Button
          text="Publish"
          tone="default"
          mode="ghost"
          disabled={Boolean(publish.disabled)}
          onClick={() => publish.execute()}
        />
        {isPublishedCompleted && (
          <Button
            text={isRunning ? 'Sending…' : alreadySent ? 'Already Sent to Projects ✓' : 'Create Draft Project'}
            tone={alreadySent ? 'positive' : 'primary'}
            disabled={isRunning || alreadySent}
            onClick={handleCreateProject}
          />
        )}
      </Flex>
      <Box marginTop={3}>
        {isPublishedCompleted ? (
          <Text size={1} muted>
            <strong>Create Draft Project</strong> maps this (already-published, Completed)
            submission's fields onto a new draft Project. That draft has no Main Image
            yet — pull the real photos from the Drive link above, then publish it from
            Projects.
          </Text>
        ) : (
          <Text size={1} muted>
            Set Status to Completed above, then click <strong>Publish</strong> — once
            this submission is actually published as Completed, a{' '}
            <strong>Create Draft Project</strong> button appears here.
          </Text>
        )}
      </Box>
      {error && (
        <Box marginTop={2}>
          <Text size={1} style={{color: '#e8392c'}}>{error}</Text>
        </Box>
      )}
    </Card>
  )
}
