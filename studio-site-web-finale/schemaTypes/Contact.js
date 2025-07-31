export default {
  name: 'Contact',
  type: 'document',
  title: 'Contact',
  fields: [
    {
      name: 'blockIntro',
      type: 'object',
      title: 'Bloc Introductif',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Titre',
        },
        {
          name: 'subtitle',
          type: 'string',
          title: 'Sous-titre',
        },
        {
          name: 'description',
          type: 'text',
          title: 'Paragraphe de description',
        },
        {
          name: 'description2',
          type: 'text',
          title: 'Paragraphe de description',
        },
      ],
    },
    {
      name: 'blockContact',
      type: 'object',
      title: 'Bloc Coordonnées',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Titre',
        },
        {
          name: 'emailText',
          type: 'string',
          title: 'Texte pour Email (par ex. : "Écrivez-nous à")',
        },
        {
          name: 'emailLink',
          type: 'string',
          title: 'Adresse email (mailto)',
          validation: Rule => Rule.regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/).error('Adresse email invalide'),
        },
        {
          name: 'mobileText',
          type: 'string',
          title: 'Texte pour Mobile (par ex. : "Appelez-nous au")',
        },
        {
          name: 'mobileLink',
          type: 'string',
          title: 'Numéro de téléphone (tel)',
          validation: Rule => Rule.regex(/^\+?[0-9\s\-()]{7,}$/).error('Numéro invalide'),
        },
      ],
    },
  ],
}
