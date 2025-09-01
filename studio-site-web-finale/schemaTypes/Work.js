// ./schemas/work.js
export default {
  name: 'work',
  title: 'Work',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Titre',
      type: 'string'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      }
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'image360',
      title: 'Image 360',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'glbFile',
      title: 'Fichier .glb/.glTF',
      type: 'file',
      options: { accept: '.glb,.gltf' }
    },
    {
      name: 'surfaceImage',
      title: 'Image Surface',
      type: 'image',
      options: { hotspot: true }
    },
    {
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
          { title: 'Home', value: 'home' }
        ],
        layout: 'checkbox'
      }
    }
  ]
}
