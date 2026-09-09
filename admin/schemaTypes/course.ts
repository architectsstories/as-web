import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content'},
    {name: 'curriculum', title: 'Curriculum'},
    {name: 'media', title: 'Media'},
    {name: 'settings', title: 'Settings'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Course Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, ''),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: ['Masterclass', 'Case Study', 'Workshop', 'Talk', 'Programme'],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'instructor',
      title: 'Instructor / Mentor',
      type: 'reference',
      group: 'content',
      to: [{type: 'person'}],
    }),
    defineField({
      name: 'level',
      title: 'Level',
      type: 'string',
      group: 'content',
      options: {list: ['Beginner', 'Beginner–Intermediate', 'Intermediate', 'Advanced']},
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      group: 'content',
      description: 'e.g. "4 hrs · 6 modules"',
    }),
    defineField({
      name: 'mode',
      title: 'Mode',
      type: 'string',
      group: 'content',
      options: {list: ['Online', 'Offline'], layout: 'radio'},
      initialValue: 'Offline',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail / Cover Image',
      description: 'Used for course cards on the homepage and Learn listing page.',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bannerImage',
      title: 'Detail Page Banner Image',
      description: 'Wide image used as the hero banner on the course detail page. Leave empty to fall back to the thumbnail.',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      group: 'settings',
      initialValue: 'Enroll Now',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Button Link',
      description: 'Where the enroll/join button should go (external form, WhatsApp link, mailto, etc.)',
      type: 'url',
      group: 'settings',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      group: 'content',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'outcomes',
      title: "What You'll Learn",
      type: 'array',
      group: 'content',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'curriculum',
      title: 'Curriculum Modules',
      type: 'array',
      group: 'curriculum',
      of: [
        {
          type: 'object',
          name: 'module',
          fields: [
            {name: 'title', title: 'Module Title', type: 'string'},
            {name: 'description', title: 'Module Description', type: 'text', rows: 2},
            {name: 'length', title: 'Length', type: 'string', description: 'e.g. "32 min"'},
          ],
          preview: {select: {title: 'title', subtitle: 'length'}},
        },
      ],
    }),
    defineField({
      name: 'isFree',
      title: 'Free Course',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
    defineField({
      name: 'price',
      title: 'Price (₹)',
      type: 'number',
      group: 'settings',
      hidden: ({document}) => Boolean(document?.isFree),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Show in Learn with AS',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'category', media: 'thumbnail'},
  },
})
