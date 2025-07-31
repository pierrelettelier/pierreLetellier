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
      name: 'mainImage',
      title: 'Image principale',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'image360',
      title: 'Image 360',
     type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'glbFile',
      title: 'Fichier .glb/.glTF',
      type: 'file',
      options: {
        accept: '.glb,.gltf'
      }
    },
    {
      name: 'surfaceImage',
      title: 'Image Surface',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'categories',
      title: 'Catégories',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Visualisation 3D', value: 'visualisation3d' },
          { title: 'Design Projects', value: 'designprojects' },
          { title: 'Video Animation 360', value: 'videoanimation360' },
          { title: 'Surfaces', value: 'surfaces' },
          { title: 'Home', value: 'home' }
        ],
       layout: 'checkbox'
      }
    }
  ]
}
