import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'vendorBrand',
  title: 'Vendors & Brands',
  type: 'document',
  description: 'Vendors, material brands, manufacturers, and product brands listed on Architects Stories.',
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
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['Surfaces', 'Lighting', 'Furniture', 'Sanitary', 'Hardware', 'Materials', 'Other'],
      },
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
    select: {title: 'name', category: 'category', media: 'image'},
    prepare({title, category, media}) {
      return {title, subtitle: category, media}
    },
  },
})
