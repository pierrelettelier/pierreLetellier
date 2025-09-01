export default {
  name: 'About',
  type: 'document',
  title: 'About',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Titre principal',
    },
    {
      name: 'sousTitre',
      type: 'string',
      title: 'Sous Titre',
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description principale',
    },
    {
      name: 'button',
      type: 'string',
      title: 'Texte du bouton principal',
    },
    {
      name: 'carousel',
      type: 'object',
      title: 'Carrousel automatique',
      fields: [
        {
          name: 'images',
          type: 'array',
          title: 'Images du carrousel',
          of: [
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Texte alternatif (SEO/Accessibilité)',
                },
              ],
            },
          ],
        },
        {
          name: 'autoplay',
          type: 'boolean',
          title: 'Lecture automatique',
          initialValue: true,
        },
        {
          name: 'interval',
          type: 'number',
          title: 'Intervalle entre les slides (ms)',
          initialValue: 3000,
        },
      ],
    },
    {
      name: 'block13',
      type: 'object',
      title: 'Bloc avec 1 titre + 3 paragraphes',
      fields: [
        { name: 'title', type: 'string', title: 'Titre' },
        {
          name: 'paragraphs',
          type: 'array',
          title: 'Paragraphes',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'subtitle', type: 'string', title: 'Sous-titre' },
                { name: 'text', type: 'text', title: 'Texte' },
              ],
            },
          ],
          validation: Rule => Rule.max(3).warning('Maximum 3 paragraphes pour ce bloc.'),
        },
      ],
    },
    {
      name: 'block14',
      type: 'object',
      title: 'Bloc avec 1 titre + 4 paragraphes',
      fields: [
        { name: 'title', type: 'string', title: 'Titre' },
        {
          name: 'paragraphs',
          type: 'array',
          title: 'Paragraphes',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'subtitle', type: 'string', title: 'Sous-titre' },
                { name: 'text', type: 'text', title: 'Texte' },
              ],
            },
          ],
          validation: Rule => Rule.max(4).warning('Maximum 4 paragraphes pour ce bloc.'),
        },
      ],
    },
    {
      name: 'blockBtn',
      type: 'object',
      title: 'Bloc avec 1 titre + description + bouton',
      fields: [
        { name: 'title', type: 'string', title: 'Titre' },
        { name: 'subtitle', type: 'string', title: 'Sous-titre' },
        { name: 'description', type: 'text', title: 'Description' },
        { name: 'button', type: 'string', title: 'Texte du bouton' },
      ],
    },
  ],
}
