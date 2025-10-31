// ./pages/MakePDF.jsx
import React, { useEffect, useState } from "react";
import "./Make.scss";

function MakePDF() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const username = prompt("Entrez votre nom d'utilisateur :");
    const password = prompt("Entrez votre mot de passe :");

    // identifiants (⚠️ en dur = pas sécurisé, juste pour test)
    if (username === "admin" && password === "1234") {
      setIsAuthenticated(true);
    } else {
      alert("Accès refusé !");
      window.location.href = "https://pierreletellier.com/"; // redirection si échec
    }
  }, []);

  if (!isAuthenticated) {
    return null; // rien à afficher tant que pas validé
  }

  return (
    <div className="MakePdf">
      <h1>Bienvenue dans MakePDF 🔒</h1>
      <p>Contenu protégé</p>
    </div>
  );
}

export default MakePDF;
