import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content'},
    {name: 'media', title: 'Media'},
    {name: 'settings', title: 'Settings'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      group: 'content',
      options: {
        list: ['Meetup', 'Webinar', 'Workshop', 'Talk', 'Site Visit'],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'startDateTime',
      title: 'Date & Time',
      type: 'datetime',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      group: 'content',
      description: 'e.g. "Kochi" or "Zoom" for online events',
    }),
    defineField({
      name: 'mode',
      title: 'Mode',
      type: 'string',
      group: 'content',
      options: {list: ['Online', 'Offline'], layout: 'radio'},
      initialValue: 'Offline',
    }),
    defineField({
      name: 'summary',
      title: 'Short Summary',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Shown on the event card and at the top of the event page.',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'media',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'rsvpLink',
      title: 'RSVP / Registration Link',
      description: 'External link (Luma, Eventbrite, Google Form, WhatsApp group, etc.)',
      type: 'url',
      group: 'settings',
    }),
    defineField({
      name: 'ctaText',
      title: 'RSVP Button Text',
      type: 'string',
      group: 'settings',
      initialValue: 'RSVP Now',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Show on Homepage',
      type: 'boolean',
      group: 'settings',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'startDateTime', media: 'coverImage'},
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'}) : '',
        media,
      }
    },
  },
})
