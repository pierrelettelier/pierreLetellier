export default {
  name: 'video',
  title: 'video',
  type: 'document',
  fields: [
    {
      name: 'titre',
      title: 'Titre',
      type: 'string',
      validation: Rule => Rule.required().min(3).max(100),
    },
    {
      name: 'subtitle',
      title: 'Sous-titre',
      type: 'string',
      validation: Rule => Rule.required().min(3).max(100),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      validation: Rule => Rule.required().min(10),
    },
       {
      name: 'description2',
      title: 'Description 2',
      type: 'text',
      rows: 5,
      validation: Rule => Rule.required().min(10),
    },

       {
      name: 'description3',
      title: 'Description 3',
      type: 'text',
      rows: 5,
      validation: Rule => Rule.required().min(10),
    },
  ],
};
