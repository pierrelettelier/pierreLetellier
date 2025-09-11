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

// Composant 404
function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404</h1>
      <p>Page non trouvée</p>
    </div>
  );
}

// Fonction pour précharger des images
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
  const [proposData, setProposData] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [congratData, setCongratData] = useState(null);
  const [workData, setWorkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('FR'); // ou ENG selon logique

  useEffect(() => {
    async function fetchAll() {
      try {
        // 1️⃣ Fetch navbar
        const navbar = await client.fetch(`*[_type == "navigationBar"][0]`);
        setNavbarData(navbar);

        // 2️⃣ Fetch About
        const aboutDocType = language === 'ENG' ? 'About-ENG' : 'About';
        const about = await client.fetch(`*[_type == "${aboutDocType}"][0]`);
        setProposData(about);

        // 3️⃣ Fetch Contact
        const contactDocType = language === 'ENG' ? 'Contact-ENG' : 'Contact';
        const contact = await client.fetch(`*[_type == "${contactDocType}"][0]`);
        setContactData(contact);

        // 4️⃣ Fetch Congrat
        const congratDocType = language === 'ENG' ? 'congrat-ENG' : 'congrat';
        const congrat = await client.fetch(`*[_type == "${congratDocType}"][0]`);
        setCongratData(congrat);

        // 5️⃣ Fetch Work
        const workQuery = `
          *[_type == "work"] | order(_createdAt desc){
            title,
            description,
            "mainImage": mainImage.asset->url,
            "image360": image360.asset->url,
            "glbFile": glbFile.asset->url,
            "surfaceImage": surfaceImage.asset->url,
            categories
          }
        `;
        const works = await client.fetch(workQuery);
        setWorkData(works);

        // 6️⃣ Précharger toutes les images
        const imageUrls = [
          navbar.logo?.asset?.url,
          about?.image?.asset?.url,
          contact?.image?.asset?.url,
          congrat?.image?.asset?.url,
          ...works.flatMap(w => [w.mainImage, w.image360, w.surfaceImage].filter(Boolean))
        ];
        await preloadImages(imageUrls);

        // ✅ Tout est chargé
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchAll();
  }, [language]);

  if (loading) return <Loading />;
  if (!navbarData) return <div>Erreur lors du chargement</div>;

  return (
    <LanguageProvider value={{ language, setLanguage }}>
      <Router>
        <Navbar data={navbarData} />
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Propos data={proposData} />} />
          <Route path="/contact" element={<Contact data={contactData} />} />
          <Route path="/mentions" element={<Mention />} />
          <Route path="/:slug" element={<WorkPage data={workData} />} />
        </Routes>
        <Footer />
      </Router>
    </LanguageProvider>
  );
}

export default App;
