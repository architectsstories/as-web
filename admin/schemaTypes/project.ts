import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content'},
    {name: 'media', title: 'Media'},
    {name: 'settings', title: 'Settings'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'studio',
      title: 'Studio / Practice',
      type: 'string',
      group: 'content',
      description: 'e.g. Studio XYZ',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'content',
      description: 'e.g. Kozhikode / Kerala',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: ['Residential', 'Institutional', 'Hospitality', 'Commercial', 'Interior', 'Landscape'],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'area',
      title: 'Area',
      type: 'string',
      group: 'content',
      description: 'e.g. 2,400 sq.ft.',
    }),
    defineField({
      name: 'year',
      title: 'Year Completed',
      type: 'number',
      group: 'content',
    }),
    defineField({
      name: 'mainImage',
      title: 'Main / Hero Image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      of: [{type: 'image', options: {hotspot: true}}],
      options: {layout: 'grid'},
      description: 'Drag-and-drop or use Upload to select multiple images at once — they\'ll all be added to the gallery in one go.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      group: 'content',
      of: [{type: 'block'}],
      description: 'Write the project story: the brief and site context, key design decisions, materials or environmental strategies, and how the spaces work. A few image captions or a list of specifications is not enough. Aim for at least 700 characters; this is an editorial guideline, not an AdSense word-count rule.',
      validation: (Rule) => Rule.custom((blocks) => {
        const text = Array.isArray(blocks)
          ? blocks
              .filter((block) => block?._type === 'block' && Array.isArray(block.children))
              .flatMap((block) => block.children.map((span) => span.text || ''))
              .join(' ')
              .trim()
          : ''

        return text.length >= 700 || 'Add a fuller project narrative with context, design decisions and outcomes.'
      }).warning(),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Show in Featured Projects',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description: 'Toggle on to surface this project in the homepage Featured Projects section.',
    }),
    defineField({
      name: 'showInLatestStories',
      title: 'Show in Latest Stories',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
      description: 'Toggle on to surface this project in the homepage Latest Stories section and the Stories page.',
    }),
    defineField({
      name: 'viewCount',
      title: 'View Count',
      type: 'number',
      group: 'settings',
      initialValue: 0,
      readOnly: true,
      description: 'Automatically increases each time someone opens this project\u2019s page. Powers the homepage "Popular Posts" section \u2014 nothing to set manually here.',
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'studio', media: 'mainImage'},
  },
})
