import {createClient} from '@sanity/client'

// Reads your Sanity project ID + dataset from .env.local
// (see .env.local.example in the project root)
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // fast, cached reads — fine for a public content site
})
