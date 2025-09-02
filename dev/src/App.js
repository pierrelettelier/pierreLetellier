import React, { useEffect, useState } from 'react';
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { client } from './Sanity';
import { LanguageProvider } from './LanguageContext';

import Propos from './pages/Propos';
import Contact from './pages/Contact';
import WorkPage from './pages/WorkPages';

import Footer from './components/Footer';

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


// Nouveau composant 404
function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404</h1>
      <p>Page non trouvée</p>
    </div>
  );
}

function App() {
  const [navbarData, setNavbarData] = useState(null);
  const [loading, setLoading] = useState(true); // état pour le loading

  useEffect(() => {
    client
      .fetch(`*[_type == "navigationBar"][0]`)
      .then((data) => setNavbarData(data))
      .catch(console.error);

    // Afficher le loading pendant 2.5s pour la transition
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!navbarData) return <div>E</div>;

  const { logo, titleBlock, linksBlock, dualTitleBlock } = navbarData;

  return (
    <LanguageProvider>
   <Router>
  <Navbar />
  <Routes>
    {/* Redirection vers /propos si tu veux garder cette URL */}
    <Route path="/" element={<Propos />} />

    {/* URLs supplémentaires */}
    <Route path="/contact" element={<Contact />} />
    <Route path="/:slug" element={<WorkPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
  <Footer />  
</Router>
</LanguageProvider>


  );
}

export default App;
