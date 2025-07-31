import React, { useEffect, useState } from 'react';
import { client } from '../Sanity';
import './Design.scss';

import WorkItems from '../components/WorkItems';

export default function Design() {
  const [designData, setDesignData] = useState(null);

  useEffect(() => {
    client
      .fetch(`*[_type == "design"][0]`)
      .then((data) => setDesignData(data))
      .catch(console.error);
  }, []);

  if (!designData) return <div>Chargement...</div>;

  return (
    <div className="design">
      <div className="design-header">
        <h1>{designData.title}</h1>
        <h2>{designData.subtitle}</h2>
      </div>

      <main>
        <section className="hero">
          {designData.paragraphBlock &&
            designData.paragraphBlock.map((block, i) => (
              <p key={i}>{block.children.map((child) => child.text).join('')}</p>
            ))}
        </section>

        {designData.infoBlock && (
          <section className="info-block">
            <h3>{designData.infoBlock.blockTitle}</h3>
            <h4>{designData.infoBlock.blockSubtitle}</h4>
            <p>{designData.infoBlock.blockParagraph}</p>
          </section>
        )}
      </main>

      {/* Filtrer sur la catégorie designprojects */}
      <WorkItems category="designprojects" />
    </div>
  );
}
