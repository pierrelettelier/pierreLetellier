import React, { useEffect, useState } from 'react';
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { client } from './Sanity';

import Propos from './pages/Propos';
import Contact from './pages/Contact';

import Design from './pages/Design'; // Import du composant Design
import Surface from './pages/Surface';
import Vdeoanimation360 from './pages/Vdeoanimation360'; // Import du composant Vdeoanimation360

// Fonction pour créer un slug d'URL friendly
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')                   // enlever accents
    .replace(/[\u0300-\u036f]/g, '')   // enlever accents
    .replace(/\s+/g, '-')               // remplacer espaces par tirets
    .replace(/[^\w-]+/g, '')            // enlever caractères spéciaux
    .replace(/--+/g, '-')               // nettoyer tirets multiples
    .replace(/^-+/, '')                 // enlever tirets au début
    .replace(/-+$/, '');                // enlever tirets à la fin
};

function Home() {
  return <h2>HOME</h2>;
}

function App() {
  const [navbarData, setNavbarData] = useState(null);

  useEffect(() => {
    client
      .fetch(`*[_type == "navigationBar"][0]`)
      .then((data) => setNavbarData(data))
      .catch(console.error);
  }, []);

  if (!navbarData) return <div>Chargement...</div>;

  const { logo, titleBlock, linksBlock, dualTitleBlock } = navbarData;

  return (
    <Router>
      <Navbar />

      <Routes>

        <Route path="/Home" element={<Propos />} />
        <Route path="/propos" element={<Propos />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/designprojects" element={<Design />} />
        <Route path="/surfaces" element={<Surface />} />

        <Route path="/videoanimation360" element={<Vdeoanimation360 />} />


      </Routes>
    </Router>
  );
}

export default App;
