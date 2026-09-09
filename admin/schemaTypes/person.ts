import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  description: 'Instructors, mentors, and community members featured across the site.',
  fields: [
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
      title: 'Role',
      type: 'string',
      description: 'e.g. Architect, Designer, Visualization Lead',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Used to power the "Find your people" search and filter tabs on the homepage.',
      options: {
        list: [
          {title: 'Architects', value: 'Architects'},
          {title: 'Designers', value: 'Designers'},
          {title: 'Studios', value: 'Studios'},
          {title: 'Makers', value: 'Makers'},
          {title: 'Mentors', value: 'Mentors'},
          {title: 'Material Brands', value: 'Material Brands'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
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
  ],
  preview: {
    select: {title: 'name', subtitle: 'role', media: 'photo'},
  },
})
