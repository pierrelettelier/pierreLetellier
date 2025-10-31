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

import Email from './pages/Email';

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
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDrops((prev) => [
        ...prev,
        {
          id: Date.now(),
          left: Math.random() * 100,
          size: 20 + Math.random() * 30,
          duration: 3 + Math.random() * 3,
        },
      ]);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        height: "100vh",
        width: "100%",
        background: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <p style={{ marginBottom: "30px", fontSize: "20px" }}>Chargement...</p>

      {drops.map((drop) => (
        <div
          key={drop.id}
          style={{
            position: "absolute",
            top: "-80px",
            left: `${drop.left}%`,
            width: `${drop.size}px`,
            height: `${drop.size}px`,
            animation: `fall ${drop.duration}s linear forwards`,
            opacity: 0.9,
          }}
        >
         
          <svg  style={{ width: "100%", height: "100%" }} viewBox="0 0 82 82" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M73.3003 31.0457L47.9833 12.9632C45.9324 11.4985 43.2867 11.1278 40.9083 11.9721L13.2651 21.7852C10.9691 22.6006 9.43597 24.7593 9.43509 27.1807L9.43066 47.7383C9.43066 48.5378 9.81128 49.2908 10.4583 49.7679L36.5994 69.0629C42.1431 73.1546 50.0713 69.75 50.8618 62.9373L51.2114 59.9281C51.3335 58.8764 52.0364 57.9802 53.033 57.605L70.0757 51.1912C72.47 50.2898 74.0535 48.0133 74.0535 45.4715V32.5051C74.0535 31.927 73.7729 31.384 73.3003 31.0457ZM39.0875 27.3143C39.0875 27.881 38.7406 28.3906 38.2112 28.6014L19.971 35.8868C19.5267 36.0643 19.2354 36.4922 19.2354 36.9675V43.094C19.2346 43.528 18.9805 43.9217 18.584 44.1035C17.5926 44.5586 16.5455 44.8855 15.47 45.0753C15.2859 45.1078 15.1169 44.9672 15.1169 44.7818V34.7446C15.1169 34.4784 15.2788 34.2386 15.5267 34.1366L33.3801 26.8346C34.2927 26.4612 34.8919 25.5826 34.9026 24.6029L34.9079 24.1241C34.9185 23.0873 33.8705 22.3677 32.8968 22.7447L16.2162 29.1963C15.5293 29.4563 14.7929 28.952 14.7929 28.2219V27.8063C14.7929 27.0085 15.2877 26.2933 16.0374 26.0069L37.9466 17.6347C38.4963 17.4247 39.0875 17.8271 39.0875 18.4123V27.3143Z" fill="#2B2B2B"/>
</svg>

        </div>
      ))}

      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
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
    imageUrls.filter(Boolean).map(
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
  const [workData, setWorkData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('FR');

  useEffect(() => {
    async function fetchAll() {
      try {
        // Navbar
        const navbar = await client.fetch(`*[_type == "navigationBar"][0]`);
        setNavbarData(navbar);

        // About
        const aboutDocType = language === 'ENG' ? 'About-ENG' : 'About';
        const about = await client.fetch(`*[_type == "${aboutDocType}"][0]`);
        setProposData(about);

        // Contact
        const contact = await client.fetch(`*[_type == "Contact"][0]`);
        setContactData(contact);

        // Works
        const works = await client.fetch(`*[_type == "work"]`);
        setWorkData(works);

        // Précharger toutes les images
        const imageUrls = [
          navbar?.logo?.asset?.url,
          about?.image?.asset?.url,
          contact?.image?.asset?.url,
          ...works.flatMap(w => [w.mainImage?.asset?.url, w.image360?.asset?.url, w.surfaceImage?.asset?.url])
        ];
        await preloadImages(imageUrls);

        setLoading(false);
      } catch (err) {
        console.error("Erreur de chargement :", err);
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

          <Route path="/emailToSueHiddenPPageForThis" element={<Email />} />
        </Routes>
        <Footer />
      </Router>
    </LanguageProvider>
  );
}

export default App;
