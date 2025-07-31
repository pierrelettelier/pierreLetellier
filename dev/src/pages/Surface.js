import React, { useEffect, useState } from 'react';
import { client } from '../Sanity';
import './Surfaces.scss';

import WorkItems from '../components/WorkItems';

export default function Surface() {
  const [surfaceData, setSurfaceData] = useState(null);

  useEffect(() => {
    client
      .fetch(`*[_type == "surface"][0]`)
      .then((data) => setSurfaceData(data))
      .catch(console.error);
  }, []);

  if (!surfaceData) return <div>Chargement...</div>;

  return (
    <div className="surface">
      <div className="surface-header">
        <h1>{surfaceData.titre}</h1>
      </div>

      <main>
        <section className="hero">
                  <p>{surfaceData.description}</p>
                     <p>{surfaceData.description2}</p>
        </section>

      </main>

      {/* Filtrer sur la catégorie surfaceprojects */}
      <WorkItems category="surfaces" />
    </div>
  );
}
