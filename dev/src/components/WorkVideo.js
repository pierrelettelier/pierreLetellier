import React, { useEffect, useState, useRef, useCallback } from 'react';
import { client } from '../Sanity';
import imageUrlBuilder from '@sanity/image-url';

import 'pannellum/build/pannellum.css';
import 'pannellum/build/pannellum.js';

import './WorkVideo.scss';

const builder = imageUrlBuilder(client);
const urlFor = (src) => builder.image(src);

const WorkVideo = () => {
  const [works, setWorks] = useState([]);
  const [selected, setSelected] = useState(null);
  const containerRef = useRef(null);
  const viewerInstance = useRef(null);

  useEffect(() => {
    client.fetch(`*[_type=="work"]{ title, image360 }`)
      .then(data => setWorks(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (selected && containerRef.current) {
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
      }

      viewerInstance.current = window.pannellum.viewer(containerRef.current, {
        type: 'equirectangular',
        panorama: urlFor(selected).url(),
        autoLoad: true,
        showZoomCtrl: true,
        showFullscreenCtrl: true,
      });
    }
    return () => {
      if (viewerInstance.current) {
        viewerInstance.current.destroy();
        viewerInstance.current = null;
      }
    };
  }, [selected]);

  const openModal = useCallback(img => setSelected(img), []);
  const closeModal = useCallback(() => setSelected(null), []);

  return (
    <div className="work-item3D">
      {works.map((w, i) => w.image360?.asset && (
        <div className="section" key={i}>
            <img
              src={urlFor(w.image360).width(2000).url()}
              alt={`360° ${w.title}`}
              onClick={() => openModal(w.image360)}
            />
        </div>
      ))}

      {selected && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label="Visualisation 360"
          onClick={closeModal}
        >
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={closeModal}
              aria-label="Fermer la visualisation"
              tabIndex={0}
            >
              &times;
            </button>
            <div
              ref={containerRef}
              className="viewer-container"
              tabIndex={-1}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkVideo;
