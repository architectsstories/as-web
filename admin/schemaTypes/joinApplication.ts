import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'joinApplication',
  title: 'Join Applications',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: ['Architect', 'Designer', 'Studio', 'Maker', 'Mentor', 'Material Brand', 'Student', 'Other'],
      },
    }),
    defineField({
      name: 'roleCustom',
      title: 'Role — Custom (short)',
      type: 'string',
      description: 'Optional. What the applicant typed if their role wasn\u2019t in the list above.',
      validation: (Rule) => Rule.max(30).warning('Keep this short — under 30 characters.'),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'portfolioUrl',
      title: 'Portfolio / Website',
      type: 'url',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {list: ['New', 'Reviewed', 'Accepted', 'Declined'], layout: 'radio'},
      initialValue: 'New',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'submittedAtDesc',
      by: [{field: 'submittedAt', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'name', subtitle: 'email', status: 'status'},
    prepare({title, subtitle, status}) {
      return {title, subtitle: `${subtitle} — ${status || 'New'}`}
    },
  },
})
