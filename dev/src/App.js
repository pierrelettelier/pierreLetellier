import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import { client } from './Sanity';
import { LanguageProvider } from './LanguageContext';

import Propos from './pages/Propos';
import Contact from './pages/Contact';
import WorkPage from './pages/WorkPages';
import Mention from './pages/Mention';

// Fonction pour créer un slug d'URL friendly
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Composant Loading
function Loading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAndPreloadImages() {
      try {
        // Récupère toutes les images depuis Sanity
        const data = await client.fetch(`
          *[_type == "sanity.imageAsset"]{
            _id,
            url
          }
        `);

        const urls = data.map((img) => img.url);

        // Précharger toutes les images
        await Promise.all(
          urls.map(
            (src) =>
              new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = resolve;
                img.onerror = reject;
              })
          )
        );

        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des images :", error);
        setIsLoading(false);
      }
    }

    fetchAndPreloadImages();
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <p>Chargement...</p>
        <div
          style={{
            border: "6px solid #f3f3f3",
            borderTop: "6px solid #333",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            animation: "spin 1s linear infinite",
            marginTop: "20px",
          }}
        />
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return null; // Ne rien rendre une fois chargé
}

// Composant 404
function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404</h1>
      <p>Page non trouvée</p>
    </div>
  );
}

// Fonction pour précharger des images précises
const preloadImages = (imageUrls) => {
  return Promise.all(
    imageUrls.map(
      (src) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        })
    )
  );
};

function App() {
  const [navbarData, setNavbarData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hasVisited = localStorage.getItem('siteVisited');

    const fetchNavbar = async () => {
      try {
        const data = await client.fetch(`*[_type == "navigationBar"][0]`);
        setNavbarData(data);

        const imageUrls = [];
        if (data.logo?.asset?.url) imageUrls.push(data.logo.asset.url);

        await preloadImages(imageUrls);
        setLoading(false);
        localStorage.setItem('siteVisited', 'true');
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    if (hasVisited) {
      // Déjà visité : on charge directement
      fetchNavbar();
    } else {
      // Première visite
      fetchNavbar();
    }
  }, []);

  if (loading) return <Loading />;

  if (!navbarData) return <div>Erreur lors du chargement</div>;

  return (
    <LanguageProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Propos />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentions" element={<Mention />} />
          <Route path="/:slug" element={<WorkPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </LanguageProvider>
  );
}

export default App;
