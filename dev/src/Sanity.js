import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: '9hozoqmh',      // ton project ID
  dataset: 'production',      // ton dataset
  apiVersion: '2025-09-01',
  useCdn: true,               // lecture publique
})
