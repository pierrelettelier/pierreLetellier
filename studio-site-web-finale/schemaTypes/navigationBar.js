export default {
  name: 'navigationBar',
  title: 'Barre de navigation',
  type: 'document',
  fields: [
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Logo en SVG ou PNG',
      options: {
        accept: 'image/svg+xml,image/png',
      },
    },
    {
      name: 'titleBlock',
      title: 'Bloc Titre',
      type: 'object',
      fields: [
        { name: 'title', title: 'Titre', type: 'string' },
        { name: 'subtitle', title: 'Sous-titre', type: 'string' },
      ],
    },
    {
      name: 'linksBlock',
      title: 'Bloc de Liens',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'linkItem',
          title: 'Lien',
          fields: [
            { name: 'label', title: 'Nom du lien', type: 'string' },
            {
              name: 'dropdown',
              title: 'Dropdown (facultatif)',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'dropdownItem',
                  title: 'Élément du dropdown',
                  fields: [
                    { name: 'label', title: 'Nom du lien', type: 'string' },
                  ],
                },
              ],
              options: {
                collapsible: true,
                collapsed: true,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'dualTitleBlock',
      title: 'Bloc Deux Titres',
      type: 'object',
      fields: [
        { name: 'titleOne', title: 'Titre 1', type: 'string' },
        { name: 'titleTwo', title: 'Titre 2', type: 'string' },
      ],
    },
  ],
}
