// ./schemas/headerTitle.js
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'headerTitle',
  title: 'Header Title',
  type: 'document',
  fields: [
    // TITRE PRINCIPAL
    defineField({
      name: 'mainTitle',
      title: 'Titre Principal',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // BLOC AVEC DESCRIPTION SIMPLE
    defineField({
      name: 'richTitle2',
      title: 'Titre Riche2',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [], // Pas de styles h1/h2 etc.
          marks: {
            decorators: [{ title: 'Strong', value: 'strong' }],
          },
        },
      ],
    }),

    // BLOC AVEC TITRE ENRICHI + DESCRIPTION
    defineField({
      name: 'richBlock',
      title: 'Bloc avec Titre Riche + Description',
      type: 'object',
      fields: [
        defineField({
          name: 'richTitle',
          title: 'Titre Riche',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [], // Pas de styles h1/h2 etc.
              marks: {
                decorators: [{ title: 'Strong', value: 'strong' }],
              },
            },
          ],
        }),
        defineField({
          name: 'richDescription',
          title: 'Description',
          type: 'text',
          rows: 3,
        }),
      ],
    }),

    // 🔥 AJOUT DES CATÉGORIES POUR LIER AUX SLUGS
    defineField({
      name: 'categories',
      title: 'Catégories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Visualisation 3D', value: 'plan3damenage' },
          { title: 'Perspective 3D', value: 'perspective3d' },
          { title: 'Panorama 360', value: 'panorama360' },
          { title: 'Animation 3D', value: 'animation3d' },
          { title: 'Design Projects', value: 'designprojects' },
          { title: 'Home', value: 'home' },
        ],
        layout: 'checkbox',
      },
    }),
  ],
})
