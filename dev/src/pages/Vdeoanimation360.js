import React, { useEffect, useState } from 'react';
import { client } from '../Sanity';
import './Surfaces.scss';

import WorkVideo from '../components/WorkVideo';

export default function Vdeoanimation360() {
  const [surfaceData, setSurfaceData] = useState(null);

  useEffect(() => {
    client
      .fetch(`*[_type == "video"][0]`)
      .then((data) => setSurfaceData(data))
      .catch(console.error);
  }, []);

  if (!surfaceData) return <div>Chargement...</div>;

  return (
    <div className="surface">
      <div className="surface-header">
        <h1>{surfaceData.titre}</h1>
        <h2>{surfaceData.subtitle}</h2>
      </div>

      <main>
        <section className="hero">
                  <p>{surfaceData.description}</p>
                     <p>{surfaceData.description2}</p>
                      <p>{surfaceData.description3}</p>
        </section>

      </main>

      {/* Filtrer sur la catégorie surfaceprojects */}
      <WorkVideo  />
    </div>
  );
}
