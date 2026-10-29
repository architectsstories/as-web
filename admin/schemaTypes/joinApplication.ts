import {defineType, defineField} from 'sanity'
import {JoinApprovalPanel} from '../components/JoinApprovalPanel'

export default defineType({
  name: 'joinApplication',
  title: 'Join Applications',
  type: 'document',
  fields: [
    defineField({name: 'category', title: 'Join As', type: 'string', options: {list: [
      {title: 'Architects & Firms', value: 'architectFirm'},
      {title: 'Vendors & Brands', value: 'vendorBrand'},
      {title: 'Industry Professionals', value: 'industryProfessional'},
      {title: 'Community', value: 'community'},
    ], layout: 'radio'}, validation: (Rule) => Rule.required()}),
    defineField({name: 'organizationName', title: 'Organisation / Brand / Firm Name', type: 'string'}),
    defineField({name: 'contactName', title: 'Contact Person', type: 'string'}),
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'email', title: 'Email', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'mobile', title: 'Mobile Number', type: 'string', description: 'Optional.'}),
    defineField({name: 'location', title: 'Location', type: 'string'}),
    defineField({name: 'website', title: 'Website', type: 'url'}),
    defineField({name: 'portfolioUrl', title: 'Portfolio / Website', type: 'url'}),
    defineField({name: 'role', title: 'Community Role', type: 'string', options: {list: ['Architect', 'Designer', 'Studio', 'Maker', 'Mentor', 'Student', 'Other']}, hidden: ({parent}) => parent?.category !== 'community'}),
    defineField({name: 'roleCustom', title: 'Role — Custom', type: 'string', validation: (Rule) => Rule.max(30).warning('Keep this short — under 30 characters.'), hidden: ({parent}) => parent?.category !== 'community'}),
    defineField({name: 'coaNumber', title: 'COA Number', type: 'string', hidden: ({parent}) => parent?.category !== 'community' || parent?.role !== 'Architect'}),
    defineField({name: 'specialization', title: 'Specialization', type: 'string', hidden: ({parent}) => parent?.category !== 'industryProfessional'}),
    defineField({name: 'vendorCategory', title: 'Brand Category', type: 'string', options: {list: ['Surfaces', 'Lighting', 'Furniture', 'Sanitary', 'Hardware', 'Materials', 'Other']}, hidden: ({parent}) => parent?.category !== 'vendorBrand'}),
    defineField({name: 'photo', title: 'Photo / Logo', type: 'image', options: {hotspot: true}}),
    defineField({name: 'message', title: 'About / Description', type: 'text', rows: 5}),
    defineField({name: 'status', title: 'Status', type: 'string', options: {list: ['New', 'Reviewed', 'Approved', 'Declined'], layout: 'radio'}, initialValue: 'New'}),
    defineField({
      name: 'draftCreated', title: 'Category Draft', type: 'boolean', readOnly: true, initialValue: false,
      description: 'Tracks whether this approved application has already been moved into the draft of its selected category.',
      components: {input: JoinApprovalPanel},
    }),
    defineField({name: 'submittedAt', title: 'Submitted At', type: 'datetime', readOnly: true}),
  ],
  orderings: [{title: 'Newest first', name: 'submittedAtDesc', by: [{field: 'submittedAt', direction: 'desc'}]}],
  preview: {
    select: {title: 'organizationName', personName: 'name', subtitle: 'email', status: 'status', category: 'category'},
    prepare({title, personName, subtitle, status, category}) {
      const categoryLabel = {architectFirm: 'Architects & Firms', vendorBrand: 'Vendors & Brands', industryProfessional: 'Industry Professionals', community: 'Community'}[category] || 'Join'
      return {title: title || personName || 'Application', subtitle: `${categoryLabel} — ${subtitle} — ${status || 'New'}`}
    },
  },
})
