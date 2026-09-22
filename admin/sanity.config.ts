import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {dashboardTool} from '@sanity/dashboard'
import {media} from 'sanity-plugin-media'

import {schemaTypes} from './schemaTypes'
import {deskStructure} from './structure/deskStructure'

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
})
