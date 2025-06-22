// components/manuales/ManualesHeader.js
import React, { useState } from 'react';
import { Menu, Sun, Moon, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManualesHeader = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('manuales-dark-mode');
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <header className="manuales-header">
      <div className="manuales-header-content">
        <div className="manuales-header-left">
          <button onClick={goBack} className="manuales-back-btn">
            <ArrowLeft size={20} />
          </button>
          <h1>Manual - Gestor de Competiciones SENA</h1>
        </div>
        <div className="manuales-header-right">
          <button onClick={toggleDarkMode} className="manuales-theme-toggle">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default ManualesHeader;
