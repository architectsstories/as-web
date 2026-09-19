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
      name: 'mobile',
      title: 'Mobile Number',
      type: 'string',
      description: 'Optional.',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
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
      name: 'coaNumber',
      title: 'COA Number',
      type: 'string',
      description: 'Council of Architecture registration number. Only asked when the applicant selects "Architect" as their role. If present, approving this application marks the resulting Person as verified (blue badge on the website) and prefixes their name with "Ar."',
      hidden: ({parent}) => parent?.role !== 'Architect',
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
    select: {title: 'name', subtitle: 'email', status: 'status', coa: 'coaNumber'},
    prepare({title, subtitle, status, coa}) {
      return {title, subtitle: `${subtitle} — ${status || 'New'}${coa ? ' — COA on file' : ''}`}
    },
  },
})
