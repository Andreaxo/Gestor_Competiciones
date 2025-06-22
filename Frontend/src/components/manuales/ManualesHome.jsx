// components/manuales/pages/ManualesHome.js
import React from 'react';

const ManualesHome = () => {
  return (
    <div className="manuales-page">
      <div className="manuales-page-header">
        <h1>Manual del Gestor de Competiciones</h1>
        <p className="manuales-subtitle">Sistema de gestión para estrategias de competiciones</p>
      </div>

      <div className="manuales-content-section">
        <div className="manuales-info-card">
          <h2>Información del Sistema</h2>
          <div className="manuales-info-grid">
            <div className="manuales-info-item">
              <strong>Versión de software:</strong> 1 . 1
            </div>
            <div className="manuales-info-item">
              <strong>Desarrolladores del sistema</strong>
              <ul>
                <p>María Andrea Alzate Guevara</p>
                <p>José Alejandro Altuve Muñoz</p>
                <p>Andrés Felipe Restrepo Hurtado</p>
                <h4>Ficha: 2826772</h4>
              </ul>
            </div>
            <div className="manuales-info-item">
              <strong>Fecha de actualizacion:</strong> 30/06/2025
            </div>
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default ManualesHome;
