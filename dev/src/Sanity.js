// ./Sanity.js
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: '9hozoqmh',      // ton project ID
  dataset: 'production',      // ton dataset
  apiVersion: '2025-09-01',
  useCdn: true,               // lecture publique
});

// Builder pour générer les URL d'images
const builder = imageUrlBuilder(client);

// Fonction utilitaire pour récupérer l'URL optimisée d'une image
export function urlFor(source) {
  return builder.image(source);
}
