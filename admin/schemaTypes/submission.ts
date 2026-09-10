import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'submission',
  title: 'Work Submissions',
  type: 'document',
  groups: [
    {name: 'contact', title: 'Contact'},
    {name: 'project', title: 'Project'},
    {name: 'credits', title: 'Credits'},
    {name: 'plan', title: 'Plan'},
    {name: 'materials', title: 'Materials'},
    {name: 'admin', title: 'Admin'},
  ],
  fields: [
    // Contact
    defineField({name: 'name', title: 'Name', type: 'string', group: 'contact', validation: (Rule) => Rule.required()}),
    defineField({name: 'email', title: 'Email', type: 'string', group: 'contact', validation: (Rule) => Rule.required()}),
    defineField({name: 'phone', title: 'Phone / WhatsApp', type: 'string', group: 'contact'}),

    // Project
    defineField({
      name: 'projectTitle',
      title: 'Project Title',
      type: 'string',
      group: 'project',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      group: 'project',
      options: {list: ['Residential', 'Commercial', 'Hospitality', 'Institutional', 'Landscape', 'Interior', 'Other']},
    }),
    defineField({name: 'location', title: 'Location', type: 'string', group: 'project'}),
    defineField({name: 'area', title: 'Area', type: 'string', group: 'project', description: 'e.g. "2400 sqft"'}),
    defineField({name: 'year', title: 'Year', type: 'string', group: 'project'}),
    defineField({name: 'concept', title: 'Concept / Description', type: 'text', rows: 4, group: 'project'}),

    // Credits
    defineField({name: 'architectCredit', title: 'Architect / Studio', type: 'string', group: 'credits'}),
    defineField({name: 'photographerCredit', title: 'Photographer', type: 'string', group: 'credits'}),
    defineField({name: 'collaboratorCredits', title: 'Other Collaborators', type: 'text', rows: 2, group: 'credits'}),

    // Plan
    defineField({
      name: 'plan',
      title: 'Plan Selected',
      type: 'string',
      group: 'plan',
      options: {list: ['Essential', 'Studio', 'Showcase', 'Signature', 'Not sure']},
    }),

    // Materials
    defineField({name: 'driveLink', title: 'Drive Link', type: 'url', group: 'materials'}),
    defineField({name: 'shootDate', title: 'Preferred Shoot Date', type: 'date', group: 'materials'}),
    defineField({name: 'siteAddress', title: 'Site Address', type: 'text', rows: 2, group: 'materials'}),
    defineField({name: 'additionalNotes', title: 'Anything Else', type: 'text', rows: 4, group: 'materials'}),

    // Admin
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'admin',
      options: {list: ['New', 'Reviewed', 'Confirmed', 'Completed', 'Declined'], layout: 'radio'},
      initialValue: 'New',
    }),
    defineField({name: 'submittedAt', title: 'Submitted At', type: 'datetime', group: 'admin', readOnly: true}),
  ],
  orderings: [
    {title: 'Newest first', name: 'submittedAtDesc', by: [{field: 'submittedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'projectTitle', name: 'name', plan: 'plan', status: 'status'},
    prepare({title, name, plan, status}) {
      return {title: title || name, subtitle: `${plan || 'No plan'} — ${status || 'New'}`}
    },
  },
})
