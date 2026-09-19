import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  description: 'Instructors, mentors, and community members featured across the site.',
  fields: [
    defineField({
      name: 'isEnabled',
      title: 'Enable Person on Website',
      type: 'boolean',
      description: 'When OFF, this person is completely hidden from the public website, including Community, profiles, course instructors, and related people.',
      initialValue: true,
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
    }),
    defineField({
      name: 'role',
      title: 'Role — Primary',
      type: 'string',
      description: 'Required. Main role shown for this person.',
      options: {
        list: ['Architect', 'Designer', 'Studio', 'Maker', 'Mentor', 'Material Brand', 'Student', 'Other'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'roleSecondary',
      title: 'Role — Secondary',
      type: 'string',
      description: 'Optional. Pick a second role if this person fits more than one.',
      options: {
        list: ['Architect', 'Designer', 'Studio', 'Maker', 'Mentor', 'Material Brand', 'Student', 'Other'],
      },
    }),
    defineField({
      name: 'roleCustom',
      title: 'Role — Custom (short)',
      type: 'string',
      description: 'Optional. Type a short custom role if the list above doesn\u2019t fit (e.g. "Urban Planner"). Shown together with the primary/secondary roles above, e.g. "Architect / Mentor / Urban Planner".',
      validation: (Rule) => Rule.max(30).warning('Keep this short — under 30 characters.'),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'mobile',
      title: 'Mobile Number',
      type: 'string',
      description: 'Optional. Not shown publicly — for internal contact only.',
    }),
    defineField({
      name: 'coaNumber',
      title: 'COA Number',
      type: 'string',
      description: 'Council of Architecture registration number. If set, a small verified badge appears next to this person\u2019s name everywhere on the website. Filled in automatically when a Join Application with a COA number is approved — or set it directly here for anyone added manually.',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'portfolioUrl',
      title: 'Portfolio URL',
      type: 'url',
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
      description: 'Pick any published project(s) on the site this person is connected to (as architect, designer, or collaborator). Shown on their community profile page.',
    }),
  ],
  preview: {
    select: {title: 'name', role: 'role', roleSecondary: 'roleSecondary', roleCustom: 'roleCustom', media: 'photo', coa: 'coaNumber'},
    prepare({title, role, roleSecondary, roleCustom, media, coa}) {
      const subtitle = roleCustom || [role, roleSecondary].filter(Boolean).join(' / ')
      return {title, subtitle: coa ? `✓ Verified — ${subtitle}` : subtitle, media}
    },
  },
})
