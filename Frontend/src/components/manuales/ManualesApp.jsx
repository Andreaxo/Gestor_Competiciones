// components/manuales/ManualesApp.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ManualesSidebar from './ManualesSidebar';
import ManualesHeader from './ManualesHeader';
import ManualesHome from './ManualesHome';
import ManualesRequirements from './ManualesRequirements';
import ManualesAccess from './ManualesAccess';
import ManualesCompetitions from './ManualesCompetitions';
import ManualesSkills from './ManualesSkills';
import ManualesUsers from './ManualesUsers';
import ManualesDocuments from './ManualesDocuments';
import ManualesEvents from './ManualesEvents';
import './manuales.css';

function ManualesApp() {
  return (
    <div className="manuales-app">
      <ManualesHeader />
      <div className="manuales-main-content">
        <ManualesSidebar />
        <div className="manuales-content">
          <Routes>
            <Route path="/" element={<ManualesHome />} />
            <Route path="/requisitos" element={<ManualesRequirements />} />
            <Route path="/acceso" element={<ManualesAccess />} />
            <Route path="/competiciones" element={<ManualesCompetitions />} />
            <Route path="/habilidades" element={<ManualesSkills />} />
            <Route path="/usuarios" element={<ManualesUsers />} />
            <Route path="/documentos" element={<ManualesDocuments />} />
            <Route path="/eventos" element={<ManualesEvents />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default ManualesApp;
