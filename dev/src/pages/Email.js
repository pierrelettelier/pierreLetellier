// ./Email.js
import React, { useEffect, useState } from "react";
import { client, urlFor } from "../Sanity"; 
import './Email.scss';

export default function Email() {
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    // Récupère le document "gallery" avec ses images
    client.fetch(`
      *[_type == "gallery"][0]{
        images[]{asset->{_id, url}}
      }
    `).then((data) => {
      if (data?.images) {
        setGalleryImages(data.images);
      }
    }).catch(console.error);
  }, []);

  return (
    <div className="bodyEmail">
      <img src="/assets/email.png" alt="email" className="emailImage" />

      <div className="gallery">
        {galleryImages.map((image, index) => (
          <img 
            key={index} 
            src={urlFor(image).url()} 
            alt={`Gallery ${index + 1}`} 
            className="galleryImage" 
          />
        ))}
      </div>
    </div>
  );
}
