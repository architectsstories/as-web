import type {StructureResolver} from 'sanity/structure'

// This builds the left-hand navigation of the Studio (Admin Panel) to match:
// Dashboard · Projects · Courses · Events · People · Featured · Media · Settings
// "Dashboard" comes from the @sanity/dashboard plugin (see sanity.config.ts).
// "Media" comes from the sanity-plugin-media plugin (see sanity.config.ts).
//
// "Latest Stories" on the website is powered by Projects with the
// "Show in Latest Stories" toggle on — there is no separate Story content type.

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Projects')
        .schemaType('project')
        .child(S.documentTypeList('project').title('Projects')),

      S.listItem()
        .title('Courses')
        .schemaType('course')
        .child(S.documentTypeList('course').title('Courses')),

      S.listItem()
        .title('Events')
        .schemaType('event')
        .child(S.documentTypeList('event').title('Events')),

      S.listItem()
        .title('People')
        .schemaType('person')
        .child(S.documentTypeList('person').title('People (Instructors & Community)')),

      S.divider(),

      S.listItem()
        .title('Join Applications')
        .schemaType('joinApplication')
        .child(
          S.documentTypeList('joinApplication')
            .title('Join Applications')
            .defaultOrdering([{field: 'submittedAt', direction: 'desc'}])
        ),

      S.listItem()
        .title('Work Submissions')
        .schemaType('submission')
        .child(
          S.documentTypeList('submission')
            .title('Work Submissions')
            .defaultOrdering([{field: 'submittedAt', direction: 'desc'}])
        ),

      S.listItem()
        .title('Course Enrollments')
        .schemaType('enrollment')
        .child(
          S.documentTypeList('enrollment')
            .title('Course Enrollments')
            .defaultOrdering([{field: 'submittedAt', direction: 'desc'}])
        ),

      S.divider(),

      // Singleton: only one "Featured" document ever exists
      S.listItem()
        .title('Featured (Homepage)')
        .id('featured')
        .child(
          S.document()
            .schemaType('featured')
            .documentId('featured-singleton')
            .title('Homepage Featured Content')
        ),

      // Singleton: only one "Site Settings" document ever exists
      S.listItem()
        .title('Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('site-settings-singleton')
            .title('Site Settings')
        ),
    ])
