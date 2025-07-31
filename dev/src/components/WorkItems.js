import React, { useEffect, useState } from 'react';
import { client } from '../Sanity';
import imageUrlBuilder from '@sanity/image-url';
import '../App.scss';

const builder = imageUrlBuilder(client);

function urlFor(source) {
  return builder.image(source);
}

export default function WorkItems({ category }) {
  const [workItems, setWorkItems] = useState(null);

  useEffect(() => {
    const query = category
      ? `*[_type == "work" && $category in categories]{
          _id,
          title,
          mainImage,
          categories
        }`
      : `*[_type == "work"]{
          _id,
          title,
          mainImage,
          categories
        }`;

    client
      .fetch(query, { category })
      .then((data) => setWorkItems(data))
      .catch(console.error);
  }, [category]);

  if (!workItems) return <div>Chargement des projets...</div>;
  if (workItems.length === 0) return <p>Aucun projet trouvé.</p>;

  const items = workItems.slice(0, 5);

  return (
    <div className="work_items">
      {/* Ligne 1 : 3 items */}
      <div className="row row-3">
        {items.slice(0, 3).map((item) => (
          <div key={item._id} className="work_item">
            <img
              className="img_work"
              src={urlFor(item.mainImage).height(1000).url()}
              alt={item.title}
              loading="lazy"
            />
            <div className="overlay" />
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>

      {/* Ligne 2 : 2 items */}
      <div className="row row-2">
        {items[3] && (
          <div className="work_item">
            <img
              className="img_work"
              src={urlFor(items[3].mainImage).height(1000).url()}
              alt={items[3].title}
              loading="lazy"
            />
            <div className="overlay" />
            <h3>{items[3].title}</h3>
          </div>
        )}
        {items[4] && (
          <div className="work_item">
            <img
              className="img_work"
              src={urlFor(items[4].mainImage).height(1000).url()}
              alt={items[4].title}
              loading="lazy"
            />
            <div className="overlay" />
            <h3>{items[4].title}</h3>
          </div>
        )}
      </div>
    </div>
  );
}
