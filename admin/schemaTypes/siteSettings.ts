import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  description: 'Singleton — global site settings.',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Site Settings',
      readOnly: true,
    }),
    defineField({name: 'siteName', title: 'Site Name', type: 'string', initialValue: 'Architects Stories'}),
    defineField({name: 'logo', title: 'Logo', type: 'image'}),
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        {name: 'instagram', title: 'Instagram URL', type: 'url'},
        {name: 'youtube', title: 'YouTube URL', type: 'url'},
        {name: 'linkedin', title: 'LinkedIn URL', type: 'url'},
      ],
    }),
    defineField({name: 'contactEmail', title: 'Contact Email', type: 'string'}),
    defineField({name: 'newsletterText', title: 'Newsletter Blurb', type: 'text', rows: 2}),
    defineField({name: 'footerText', title: 'Footer Copyright Text', type: 'string'}),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
