import {createClient} from '@sanity/client'

// SERVER-ONLY client — never import this into a 'use client' component or
// anything that ships to the browser. It uses a write-enabled API token
// (SANITY_API_TOKEN in .env.local) so it can create documents, unlike the
// public read-only client in lib/sanity.js.
export const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})
