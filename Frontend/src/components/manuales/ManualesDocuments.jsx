// components/manuales/pages/ManualesDocuments.js
import React from 'react';

const ManualesDocuments = () => {
  return (
    <div className="manuales-page">
      <div className="manuales-page-header">
        <h1>Gestión de Documentos</h1>
        <p>Sistema de administración de documentos y archivos</p>
      </div>

      <div className="manuales-module-section">
        <div className="manuales-function-card">
          <h2>📁 Tipos de Documentos</h2>
          <div className="manuales-document-types">
            <div className="manuales-doc-type">
              <h4>📋 Reglamentos</h4>
              <p>Documentos oficiales con las reglas de las competiciones</p>
            </div>
            <div className="manuales-doc-type">
              <h4>📊 Formularios</h4>
              <p>Plantillas para inscripciones y evaluaciones</p>
            </div>
            <div className="manuales-doc-type">
              <h4>📈 Reportes</h4>
              <p>Informes generados automáticamente por el sistema</p>
            </div>
            <div className="manuales-doc-type">
              <h4>🖼️ Multimedia</h4>
              <p>Imágenes, videos y otros archivos multimedia</p>
            </div>
          </div>
        </div>

        <div className="manuales-function-card">
          <h2>🔧 Funcionalidades</h2>
          <div className="manuales-steps">
            <div className="manuales-step">
              <span className="manuales-step-number">1</span>
              <span>Subir documentos al sistema</span>
            </div>
            <div className="manuales-step">
              <span className="manuales-step-number">2</span>
              <span>Organizar por categorías</span>
            </div>
            <div className="manuales-step">
              <span className="manuales-step-number">3</span>
              <span>Controlar acceso y permisos</span>
            </div>
            <div className="manuales-step">
              <span className="manuales-step-number">4</span>
              <span>Generar enlaces de descarga</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualesDocuments;
