// src/sanity.js
import sanityClient from '@sanity/client'

export const client = sanityClient({
  projectId: '9hozoqmh',   // 🔁 Remplace avec ton vrai ID
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-07-30',
})
