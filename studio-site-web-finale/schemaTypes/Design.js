export default {
  name: 'design',
  title: 'Design',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string',
    },
    {
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'string',
    },
    {
      name: 'paragraphBlock',
      title: 'Bloc de paragraphes',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Paragraphe', value: 'normal' },
            // tu peux ajouter d'autres styles si besoin, ex : { title: 'Titre 1', value: 'h1' }
          ],
          lists: [
            // tu peux activer les listes si besoin :
            // { title: 'Liste à puces', value: 'bullet' },
            // { title: 'Liste numérotée', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Gras', value: 'strong' },
              { title: 'Italique', value: 'em' },
              { title: 'Souligné', value: 'underline' },
              // { title: 'Barré', value: 'strike-through' }, // optionnel
            ],
            annotations: [
              // Exemple d'annotation lien (décommenter si besoin)
              /*
              {
                name: 'link',
                type: 'object',
                title: 'Lien',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                  },
                ],
              },
              */
            ],
          },
        },
      ],
      description: 'Contient plusieurs paragraphes avec mise en forme.',
    },
    {
      name: 'infoBlock',
      title: 'Bloc avec titre, sous-titre et paragraphe',
      type: 'object',
      fields: [
        {
          name: 'blockTitle',
          title: 'Titre du bloc',
          type: 'string',
        },
        {
          name: 'blockSubtitle',
          title: 'Sous-titre du bloc',
          type: 'string',
        },
        {
          name: 'blockParagraph',
          title: 'Paragraphe',
          type: 'text',
        },
      ],
    },
  ],
};
