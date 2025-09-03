import React, { useEffect, useState, useRef, useContext } from 'react';
import { client } from '../Sanity'; // Adapte ce chemin si besoin
import './Apropos.scss'; // Assure-toi que le fichier SCSS est bien importé

import { NavLink } from 'react-router-dom';

import { Link } from 'react-router-dom';
import imageUrlBuilder from '@sanity/image-url'

import { LanguageContext } from '../LanguageContext'

const builder = imageUrlBuilder(client);
export function urlFor(source) {
  return builder.image(source)
    .width(800)       // Largeur max pour limiter le poids
    .format('webp')   // Format optimisé
    .quality(80);     // Compression
}


const Propos = () => {
  const [proposData, setProposData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const trackRef = useRef(null);

    const { language } = useContext(LanguageContext)

 useEffect(() => {
    const docType = language === 'ENG' ? 'About-ENG' : 'About'
    client
      .fetch(`*[_type == "${docType}"][0]`)
      .then(data => setProposData(data))
      .catch(console.error)
  }, [language])


  const images = proposData?.carousel?.images || [];
  const visible = 5;

  // 🔁 Carrousel en boucle infinie avec modulo
  // 🔁 Autoplay en boucle infinie, slide par slide
  useEffect(() => {
    if (images.length === 0) return;

    let visibleSlides = window.innerWidth <= 1060 ? 3 : 5; // nombre d'éléments visibles
    let position = 0;
    const track = trackRef.current;

    // recalculer slideWidth si l'utilisateur redimensionne
    const getSlideWidth = () => track.querySelector("img")?.offsetWidth + 28 || 0;

    let slideWidth = getSlideWidth();
    let animationFrame;

    const animate = () => {
      position -= 1; // vitesse du défilement en px/frame
      if (Math.abs(position) >= track.scrollWidth / 2) {
        position = 0; // reset pour boucle infinie
      }
      track.style.transform = `translateX(${position}px)`;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      visibleSlides = window.innerWidth <= 1060 ? 3 : 5;
      slideWidth = getSlideWidth();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
    };
  }, [images]);

  const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')
      .replace(/[^\w-]+/g, '');


  if (!proposData) return <div></div>;


  return (
    <div className="about-container">
      {/* Bloc principal */}
      <section className="main-section">
        <div className="title">
          <h1 className="h1-default">
            {proposData.title}
            <span className="h1-alternate elementRotate">
              {proposData.sousTitre}
              <svg
                height="24"
                viewBox="0 0 143 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.223313 9.8016C0.149965 7.70119 1.71183 5.90431 3.80343 5.6986C14.1849 4.67757 44.5108 1.85239 71.1317 0.922766C97.7525 -0.00685398 128.202 0.696023 138.629 0.990388C140.73 1.04969 142.413 2.73324 142.487 4.83365L142.847 15.152C142.928 17.4649 141.053 19.3663 138.739 19.306C127.638 19.0167 96.9192 18.3668 71.7715 19.2449C46.6237 20.1231 16.0253 22.9143 4.97089 23.9773C2.66728 24.1989 0.664405 22.4328 0.58364 20.12L0.223313 9.8016Z"
                  fill="#EAE5C8"
                />
              </svg>
            </span>
          </h1>
        </div>


        <p className='bodyL-regular'>{proposData.description}</p>
        <Link to="/contact">
          <button className="btnAction">
            {proposData.button}
            {/* SVG inchangé */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.1967 6.00934C13.4219 5.70362 13.8515 5.63832 14.1573 5.86342H14.1582L14.1591 5.86432C14.1597 5.8648 14.1607 5.86534 14.1617 5.86611L14.2119 5.90371C14.2465 5.92954 14.2975 5.96734 14.3614 6.0156C14.4891 6.11209 14.6707 6.25107 14.8886 6.42112C15.324 6.76087 15.9071 7.22839 16.4919 7.73614C17.0734 8.24101 17.6735 8.79903 18.1328 9.31883C18.3617 9.57789 18.5702 9.84383 18.7254 10.1012C18.8692 10.3398 19.0208 10.6576 19.0208 11C19.0208 11.3424 18.8692 11.6602 18.7254 11.8987C18.5702 12.1561 18.3617 12.4221 18.1328 12.6811C17.6735 13.2009 17.0734 13.7589 16.4919 14.2638C15.9071 14.7716 15.324 15.2391 14.8886 15.5788C14.6707 15.7489 14.4891 15.8879 14.3614 15.9844C14.2975 16.0326 14.2465 16.0704 14.2119 16.0963L14.1617 16.1338C14.1607 16.1346 14.1597 16.1352 14.1591 16.1356L14.1582 16.1365H14.1573C13.8515 16.3616 13.4219 16.2963 13.1967 15.9906C12.9716 15.6849 13.0369 15.2552 13.3427 15.0301V15.0292C13.3431 15.0289 13.3435 15.0281 13.3444 15.0274C13.3464 15.026 13.3502 15.0242 13.3543 15.0211C13.3624 15.0151 13.3749 15.0063 13.391 14.9943C13.4235 14.9701 13.471 14.9332 13.5324 14.8869C13.6553 14.7941 13.8321 14.6598 14.0436 14.4948C14.4675 14.164 15.0306 13.7122 15.5914 13.2254C16.1554 12.7356 16.7015 12.2234 17.1015 11.7707C17.1263 11.7427 17.15 11.7145 17.1731 11.6875H3.66663C3.28693 11.6875 2.97913 11.3797 2.97913 11C2.97913 10.6203 3.28693 10.3125 3.66663 10.3125H17.1731C17.15 10.2854 17.1263 10.2572 17.1015 10.2292C16.7015 9.77654 16.1554 9.26431 15.5914 8.77456C15.0306 8.28773 14.4675 7.83596 14.0436 7.50519C13.8321 7.34013 13.6553 7.20588 13.5324 7.1131C13.471 7.06673 13.4235 7.02987 13.391 7.00568C13.3749 6.99369 13.3624 6.98486 13.3543 6.97882C13.3502 6.9758 13.3464 6.97399 13.3444 6.97255C13.3435 6.97187 13.3431 6.97107 13.3427 6.97076V6.96987C13.0369 6.74473 12.9716 6.31507 13.1967 6.00934Z" fill="#FCFCFB" />
            </svg>
          </button>
        </Link>
      </section>

      {/* Carrousel */}
      <div className="carousselBlock">
        {images.length > 0 && (
          <div className="carousel-container" ref={trackRef}>
            {images.concat(images.slice(0, visible)).map((img, index) => (
              <img
              onContextMenu={(e) => e.preventDefault()} // Empêche clic droit
  draggable="false"  
                key={index}
                src={urlFor(img).url()}
                alt={img.alt || `Slide ${index}`}
                className="carousel-image"
              />
            ))}
          </div>
        )}
      </div>

      {/* Bloc 13 */}
      <section className="block13">
        <div className='contain'>
          <h2 className='h2-alternate'>{proposData.block13?.title}</h2>
          <div className='main'>
            {proposData.block13?.paragraphs?.map((para, index) => (
              <div key={index} className="paragraph">
                <h3 className='h4-alternate'>{para.subtitle}</h3>
                <p className='bodyM-regular'>{para.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="block14">
        <h2 className='h2-alternate'>{proposData.block14?.title}</h2>

        <div className='paragraphs'>
          {proposData.block14?.paragraphs?.map((para, index) => (
            <NavLink
              to={`/${slugify(para.subtitle)}`}
              key={index}
              className="paragraph"
              id={slugify(para.subtitle)} // <-- Chaque paragraphe a un ID unique
            >
              <h3 className='h3-alternate'>{para.subtitle}</h3>
              <p className='bodyM-regular'>{para.text}</p>
            </NavLink>
          ))}
        </div>
      </section>

      {/* Bloc avec bouton */}
      <section className="blockBtn">
        <div className='contain'>
          <div className='left'>
            <h2 className='h2-alternate '>{proposData.blockBtn?.title}</h2>
            <p className='bodyL-regular'>{proposData.blockBtn?.description}</p>
          </div>

          <div className="img-back">
            {/* SVG inchangé */}
            <svg width="641" height="355" viewBox="0 0 641 355" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.95011 331.58C-2.27411 320.411 1.19779 306.348 11.9523 299.432C65.3316 265.102 221.697 165.673 363.26 86.7868C504.823 7.90028 671.643 -72.7674 728.92 -100.102C740.46 -105.609 754.246 -101.163 760.47 -89.9939L791.047 -35.1233C797.901 -22.8243 793.024 -7.32741 780.331 -1.23579C719.417 27.9961 551.284 109.698 417.555 184.219C283.825 258.741 125.89 358.742 68.9835 395.165C57.1249 402.756 41.3806 398.75 34.527 386.451L3.95011 331.58Z" fill="#F2EEE2" />
            </svg>
          </div>

          <Link to="/contact" className='linkFirst'>
            <button className="btnAction">
              {proposData.button}
              {/* SVG inchangé */}
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.1967 6.00934C13.4219 5.70362 13.8515 5.63832 14.1573 5.86342H14.1582L14.1591 5.86432C14.1597 5.8648 14.1607 5.86534 14.1617 5.86611L14.2119 5.90371C14.2465 5.92954 14.2975 5.96734 14.3614 6.0156C14.4891 6.11209 14.6707 6.25107 14.8886 6.42112C15.324 6.76087 15.9071 7.22839 16.4919 7.73614C17.0734 8.24101 17.6735 8.79903 18.1328 9.31883C18.3617 9.57789 18.5702 9.84383 18.7254 10.1012C18.8692 10.3398 19.0208 10.6576 19.0208 11C19.0208 11.3424 18.8692 11.6602 18.7254 11.8987C18.5702 12.1561 18.3617 12.4221 18.1328 12.6811C17.6735 13.2009 17.0734 13.7589 16.4919 14.2638C15.9071 14.7716 15.324 15.2391 14.8886 15.5788C14.6707 15.7489 14.4891 15.8879 14.3614 15.9844C14.2975 16.0326 14.2465 16.0704 14.2119 16.0963L14.1617 16.1338C14.1607 16.1346 14.1597 16.1352 14.1591 16.1356L14.1582 16.1365H14.1573C13.8515 16.3616 13.4219 16.2963 13.1967 15.9906C12.9716 15.6849 13.0369 15.2552 13.3427 15.0301V15.0292C13.3431 15.0289 13.3435 15.0281 13.3444 15.0274C13.3464 15.026 13.3502 15.0242 13.3543 15.0211C13.3624 15.0151 13.3749 15.0063 13.391 14.9943C13.4235 14.9701 13.471 14.9332 13.5324 14.8869C13.6553 14.7941 13.8321 14.6598 14.0436 14.4948C14.4675 14.164 15.0306 13.7122 15.5914 13.2254C16.1554 12.7356 16.7015 12.2234 17.1015 11.7707C17.1263 11.7427 17.15 11.7145 17.1731 11.6875H3.66663C3.28693 11.6875 2.97913 11.3797 2.97913 11C2.97913 10.6203 3.28693 10.3125 3.66663 10.3125H17.1731C17.15 10.2854 17.1263 10.2572 17.1015 10.2292C16.7015 9.77654 16.1554 9.26431 15.5914 8.77456C15.0306 8.28773 14.4675 7.83596 14.0436 7.50519C13.8321 7.34013 13.6553 7.20588 13.5324 7.1131C13.471 7.06673 13.4235 7.02987 13.391 7.00568C13.3749 6.99369 13.3624 6.98486 13.3543 6.97882C13.3502 6.9758 13.3464 6.97399 13.3444 6.97255C13.3435 6.97187 13.3431 6.97107 13.3427 6.97076V6.96987C13.0369 6.74473 12.9716 6.31507 13.1967 6.00934Z" fill="#FCFCFB" />
              </svg>
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Propos;
