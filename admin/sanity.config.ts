import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {dashboardTool} from '@sanity/dashboard'
import {media} from 'sanity-plugin-media'

import {schemaTypes} from './schemaTypes'
import {deskStructure} from './structure/deskStructure'
import {approveAndAddPersonAction} from './actions/approveAndAddPerson'
import {publishSubmissionAsProjectAction} from './actions/publishSubmissionAsProject'

export default defineConfig({
  name: 'default',
  title: 'Architects Stories — Admin Panel',

  projectId: 'k5fw7bl7',
  dataset: 'production',

  plugins: [
    dashboardTool(),                          // "Dashboard" module
    structureTool({structure: deskStructure}), // custom nav for Projects / Stories / Courses / Featured / Settings
    media(),                                   // "Media" module (asset library)
    visionTool(),                              // GROQ query tester, handy for building the Next.js site later
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'joinApplication') {
        return [...prev, approveAndAddPersonAction]
      }
      if (context.schemaType === 'submission') {
        return [...prev, publishSubmissionAsProjectAction]
      }
      return prev
    },
  },
})
