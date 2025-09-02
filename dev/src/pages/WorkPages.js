// ./pages/WorkPage.jsx
import React, { useEffect, useState , useRef} from 'react'
import { useParams } from 'react-router-dom'
import { client } from '../Sanity'
import { Link } from 'react-router-dom';

import * as PANOLENS from 'panolens'
import * as THREE from 'three'


import './WorkPages.scss'

export default function WorkPage() {
  const { slug } = useParams() // slug = valeur de la catégorie
  const [workData, setWorkData] = useState([])
  const [headerData, setHeaderData] = useState(null)
  const [loading, setLoading] = useState(true)

  const [proposData, setProposData] = useState(null);
    const [selectedWork, setSelectedWork] = useState(null)

  const panoContainerRef = useRef(null)
  const viewerRef = useRef(null)

  useEffect(() => {
    if (!slug) return

    setLoading(true)

    const workQuery = `
      *[_type == "work" && $slug in categories] | order(_createdAt desc){
        title,
        description,
        "mainImage": mainImage.asset->url,
        "image360": image360.asset->url,
        "glbFile": glbFile.asset->url,
        "surfaceImage": surfaceImage.asset->url,
        categories
      }
    `

    const headerQuery = `
      *[_type == "headerTitle" && $slug in categories][0]{
        mainTitle,
        richTitle2,
        richBlock{
          richTitle,
          richDescription
        }
      }
    `

    Promise.all([
      client.fetch(workQuery, { slug }),
      client.fetch(headerQuery, { slug }),
    ]).then(([workRes, headerRes]) => {
      setWorkData(workRes)
      setHeaderData(headerRes)
      setLoading(false)
    })
  }, [slug])


  useEffect(() => {
    client
      .fetch(`*[_type == "About"][0]`)
      .then((data) => setProposData(data))
      .catch(console.error);
  }, []);

  // 🔥 Fonction pour ouvrir modal si image360 ou glbFile
  const handleOpenModal = (work) => {
    if (work.image360 || work.glbFile) {
      setSelectedWork(work)
    }
  }

  const handleCloseModal = () => {
    setSelectedWork(null)
  }

 useEffect(() => {
    if (selectedWork?.image360 && panoContainerRef.current) {
      // Nettoyage avant recréation
      if (viewerRef.current) {
        viewerRef.current.dispose()
        viewerRef.current = null
      }

      const panorama = new PANOLENS.ImagePanorama(selectedWork.image360)
      const viewer = new PANOLENS.Viewer({
        container: panoContainerRef.current,
        autoHideInfospot: false,
        controlBar: true
      })

      viewer.add(panorama)
      viewerRef.current = viewer
    }
  }, [selectedWork])

  if (loading) return <p></p>

  return (
    <div className="work-page">
      {/* 🔥 HEADER */}
      {headerData && (
        <header className="header-title">
        <h1 className="h1-alternate">
  {(() => {
    if (!headerData.mainTitle) return null;

    // Sépare en mots
    const words = headerData.mainTitle.trim().split(" ");
    const lastWord = words.pop(); // retire et récupère le dernier mot
    const firstPart = words.join(" "); // tout sauf le dernier mot

    return (
      <>
        <div className='wavy2'>
          <span>
            {firstPart}
          </span>
                 <svg height="15" viewBox="0 0 191 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 4.64843C0 3.11703 1.1825 1.86162 2.71298 1.80864C13.8868 1.42186 57.5449 0 95.5 0C133.455 0 177.113 1.42186 188.287 1.80864C189.818 1.86162 191 3.11703 191 4.64843V12.0499C191 13.6619 189.695 14.9541 188.084 14.9001C176.377 14.508 131.689 13.0952 95.5 13.0952C59.3114 13.0952 14.6228 14.508 2.91631 14.9001C1.30519 14.9541 0 13.6619 0 12.0499V4.64843Z" fill="#EAE5C8"/>
</svg>

          </div> <span className="highlight">{lastWord}</span>


        <div className="wave3"></div>
      </>
    );
  })()}
</h1>


          <div className='content'>
            <div className='left'>
              {headerData.richTitle2 && (
                <div className='bodyL-regular'>
                  {headerData.richTitle2.map((block, index) => (
                    <p key={index}>
                      {block.children.map((child, i) => {
                        if (child.marks?.includes('strong')) {
                          return <strong key={i}>{child.text}</strong>
                        }
                        return child.text
                      })}
                    </p>
                  ))}
                </div>
              )}


            </div>

            {/* Titre riche */}
            {headerData.richBlock?.richTitle && headerData.richBlock.richTitle.length > 0 && (
              <div className='right'>
                {headerData.richBlock.richTitle.map((block, i) => (
<h2 key={i}>
  {block.children?.map((child, j) => {
    const words = child.text.trim().split(" ");
    const lastWord = words.pop(); // récupère le dernier mot
    const firstPart = words.join(" "); // tout sauf le dernier mot

    return (
      <span key={j}>
        {firstPart && <span>{firstPart} </span>} 
        {lastWord && <span className="last-word">
          <span className='word'> {lastWord}</span>
<svg width="155" height="17" viewBox="0 0 155 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M153.942 2.69323C153.919 1.62214 153.063 0.759506 151.991 0.738804C143.451 0.573742 107.831 -0.0357487 76.9322 0.611497C46.033 1.25874 10.4701 3.35929 1.94414 3.88185C0.874831 3.94738 0.055028 4.84514 0.0774641 5.91622L0.249647 14.1362C0.273457 15.2728 1.22476 16.1624 2.35963 16.0944C11.3261 15.5567 47.7372 13.4479 77.1881 12.831C106.639 12.2141 143.107 12.7963 152.088 12.958C153.224 12.9785 154.138 12.0498 154.114 10.9132L153.942 2.69323Z" fill="white"/>
</svg>


          </span>}
    
      </span>
    );
  })}
</h2>

                ))}
                {/* Description riche */}
                {headerData.richBlock?.richDescription && (
                  <p className='bodyM-regular'>{headerData.richBlock.richDescription}</p>
                )}
              </div>
            )}

          </div>


        </header>
      )}

      {/* 🔥 LISTE DES PROJETS */}
      {/* LISTE DES PROJETS */}
      <section className="work-list">
        {workData.length > 0 ? (
          workData.map((work, index) => {
            const isB = index % 4 === 3
            const itemClass = isB ? 'work-item B' : 'work-item A'

            return (
              <article
                key={index}
                className={itemClass}
                onClick={() => handleOpenModal(work)}
                style={{ cursor: work.image360 || work.glbFile ? 'pointer' : 'default' }}
              >
                {work.mainImage && <img src={work.mainImage} alt={work.title} />}
              </article>
            )
          })
        ) : (
          <p>Aucun projet trouvé pour cette catégorie.</p>
        )}
      </section>

      {/* MODAL */}
      {selectedWork && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseModal}>✕</button>

            {/* Visionneuse 360 */}
            {selectedWork.image360 && (
              <div
                ref={panoContainerRef}
                style={{ width: '100%', height: '500px' }}
              ></div>
            )}

            {/* Visionneuse GLB */}
            {selectedWork.glbFile && (
              <model-viewer
                src={selectedWork.glbFile}
                alt="3D model"
                camera-controls
                auto-rotate
                style={{ width: '100%', height: '500px' }}
              ></model-viewer>
            )}
          </div>
        </div>
      )}



      {proposData?.blockBtn && (
  <section className="blockBtn">
    <div className='contain'>
      <div className='left'>
        <h2 className='h2-alternate'>{proposData.blockBtn.title}</h2>
        <p className='bodyL-regular'>{proposData.blockBtn.description}</p>
      </div>

      <div className="img-back">
        <svg width="641" height="355" viewBox="0 0 641 355" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.95011 331.58C-2.27411 320.411 1.19779 306.348 11.9523 299.432C65.3316 265.102 221.697 165.673 363.26 86.7868C504.823 7.90028 671.643 -72.7674 728.92 -100.102C740.46 -105.609 754.246 -101.163 760.47 -89.9939L791.047 -35.1233C797.901 -22.8243 793.024 -7.32741 780.331 -1.23579C719.417 27.9961 551.284 109.698 417.555 184.219C283.825 258.741 125.89 358.742 68.9835 395.165C57.1249 402.756 41.3806 398.75 34.527 386.451L3.95011 331.58Z" fill="#F2EEE2" />
        </svg>
      </div>

      <Link to="/contact" className='linkFirst'>
        <button className="btnAction">
          {proposData.button}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.1967 6.00934C13.4219 5.70362 ..." fill="#FCFCFB" />
          </svg>
        </button>
      </Link>
    </div>
  </section>
)}



    </div>
  )
}
