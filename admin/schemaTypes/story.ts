import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'story',
  title: 'Story',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content'},
    {name: 'media', title: 'Media'},
    {name: 'settings', title: 'Settings'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Story Title',
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
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: ['Architecture', 'Materials', 'People', 'Process', 'Ideas'],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'content',
      to: [{type: 'person'}],
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Short summary shown on story cards.',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time',
      type: 'string',
      group: 'content',
      description: 'e.g. "5 min read"',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'settings',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Show as Featured Story',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'category', media: 'coverImage'},
  },
})
