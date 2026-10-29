import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'featured',
  title: 'Featured (Homepage)',
  type: 'document',
  description: 'Singleton — controls what shows in the homepage hero and featured sections.',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Homepage Featured Content',
      readOnly: true,
    }),
    defineField({
      name: 'heroSlides',
      title: 'Hero Slides',
      type: 'array',
      description: 'Up to 4 projects shown as rotating slides in the homepage hero banner. The first one shows by default.',
      of: [{type: 'reference', to: [{type: 'project'}]}],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Featured Projects',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
      validation: (Rule) => Rule.max(5),
    }),
    defineField({
      name: 'latestStories',
      title: 'Latest Stories',
      type: 'array',
      description: 'Pick which projects show in the homepage Latest Stories band. Only projects with "Show in Latest Stories" turned on (in Projects → Settings) will appear in the search below.',
      of: [
        {
          type: 'reference',
          to: [{type: 'project'}],
          options: {
            filter: 'showInLatestStories == true',
          },
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'featuredCourses',
      title: 'Featured Courses',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'course'}]}],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'featuredPeople',
      title: 'People Behind the Spaces',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'person'}]}],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({
      name: 'featuredVendors',
      title: 'Vendors & Brands',
      type: 'array',
      description: 'Pick which Material Brand profiles show in the homepage "Featured Vendors & Brands" section. The first one picked is the spotlight ("Featured Brand of the Month"); up to 4 more appear in the grid beside it. Only people with Role — Primary or Secondary set to "Material Brand" can be picked.',
      of: [
        {
          type: 'reference',
          to: [{type: 'person'}],
          options: {
            filter: 'role == "Material Brand" || roleSecondary == "Material Brand"',
          },
        },
      ],
      validation: (Rule) => Rule.max(5),
    }),
    defineField({
      name: 'featuredIndustryProfessionals',
      title: 'Industry Professionals',
      type: 'array',
      description: 'Pick which people show in the homepage "Industry Professionals" section — visualisers, photographers, consultants, contractors, fabricators, landscape designers, etc. The first one picked is the spotlight ("Featured Professional of the Month"); up to 4 more appear in the grid beside it. Material Brands are excluded — use the "Vendors & Brands" section above for them.',
      of: [
        {
          type: 'reference',
          to: [{type: 'person'}],
          options: {
            filter: 'role != "Material Brand" && roleSecondary != "Material Brand"',
          },
        },
      ],
      validation: (Rule) => Rule.max(5),
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Homepage Featured Content'}
    },
  },
})
