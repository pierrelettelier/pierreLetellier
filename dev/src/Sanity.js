// src/sanity.js
import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: '9hozoqmh',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-07-30',
})
