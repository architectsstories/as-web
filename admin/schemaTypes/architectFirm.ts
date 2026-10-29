import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'architectFirm',
  title: 'Architects & Firms',
  type: 'document',
  description: 'Architects, architecture practices, and firms listed in the Architects & Firms section.',
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
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image / Logo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'isEnabled',
      title: 'Show on Website',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'name', location: 'location', media: 'image'},
    prepare({title, location, media}) {
      return {title, subtitle: location, media}
    },
  },
})
