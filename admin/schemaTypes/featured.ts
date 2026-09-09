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
  ],
  preview: {
    prepare() {
      return {title: 'Homepage Featured Content'}
    },
  },
})
