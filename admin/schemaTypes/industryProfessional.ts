import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'industryProfessional',
  title: 'Industry Professionals',
  type: 'document',
  description: 'Specialists and service professionals in the architecture and built-environment ecosystem.',
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
      name: 'specialization',
      title: 'Specialization',
      type: 'string',
      description: 'For example: Architectural Photographer, Landscape Designer, 3D Visualizer, Structural Consultant.',
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
      name: 'website',
      title: 'Website / Portfolio',
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
    select: {title: 'name', specialization: 'specialization', media: 'photo'},
    prepare({title, specialization, media}) {
      return {title, subtitle: specialization, media}
    },
  },
})
