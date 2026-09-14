import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'enrollment',
  title: 'Course Enrollments',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'email', title: 'Email', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'phone', title: 'Phone / WhatsApp', type: 'string'}),
    defineField({name: 'courseTitle', title: 'Course', type: 'string', readOnly: true}),
    defineField({name: 'courseSlug', title: 'Course Slug', type: 'string', readOnly: true}),
    defineField({name: 'message', title: 'Message', type: 'text', rows: 3}),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {list: ['New', 'Contacted', 'Enrolled', 'Declined'], layout: 'radio'},
      initialValue: 'New',
    }),
    defineField({name: 'submittedAt', title: 'Submitted At', type: 'datetime', readOnly: true}),
  ],
  orderings: [
    {title: 'Newest first', name: 'submittedAtDesc', by: [{field: 'submittedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'name', course: 'courseTitle', status: 'status'},
    prepare({title, course, status}) {
      return {title, subtitle: `${course || 'No course'} — ${status || 'New'}`}
    },
  },
})
