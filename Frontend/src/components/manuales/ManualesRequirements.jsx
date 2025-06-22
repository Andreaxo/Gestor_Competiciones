// components/manuales/pages/ManualesRequirements.js
import React from 'react';

const ManualesRequirements = () => {
  return (
    <div className="manuales-page">
      <div className="manuales-page-header">
        <h1>Requisitos del Sistema</h1>
        <p>Especificaciones técnicas necesarias para el funcionamiento del gestor</p>
      </div>

      <div className="manuales-requirements-section">
        <div className="manuales-requirement-card">
          <h2>💻 Requisitos de Hardware</h2>
          <div className="manuales-requirement-list">
            <div className="manuales-requirement-item">
              <strong>Procesador:</strong> Intel Core i3 de primera generación / AMD FX 6000 series   o superior
            </div>
            <div className="manuales-requirement-item">
              <strong>Memoria RAM:</strong> 2 GB (4 GB recomendados)
            </div>
            <div className="manuales-requirement-item">
              <strong>Espacio en disco:</strong> 500 MB libres para caché y archivos temporales
            </div>
            <div className="manuales-requirement-item">
              <strong>Resolución de pantalla:</strong> HD o superior
            </div>
          </div>
        </div>

        <div className="manuales-requirement-card">
          <h2>⚙️ Requisitos de Software</h2>
          <div className="manuales-software-requirements">
            <div className="manuales-software-section">
              <h3>Sistema Operativo:</h3>
              <ul>
                <li>Windows 7 o superior</li>
                <li>macOS 10.13 o superior</li>
                <li>Linux (Ubuntu 20.04 +)</li>
              </ul>
            </div>
            <div className="manuales-software-section">
              <h3>Navegador Web:</h3>
              <ul>
                <li>Google Chrome (versión 100+)</li>
                <li>Mozilla Firefox (versión 90+)</li>
                <li>Microsoft Edge (versión 100+)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="manuales-requirement-card">
          <h2>👤 Requisitos de Usuario</h2>
          <div className="manuales-requirement-list">
            <div className="manuales-requirement-item">
              <strong>Cuenta válida:</strong> Disponer de una cuenta registrada en el sistema
            </div>
            <div className="manuales-requirement-item">
              <strong>Credenciales:</strong> Usuario, contraseña y email válidos
            </div>
          </div>
        </div>

        <div className="manuales-requirement-card">
          <h2>📱 Compatibilidad</h2>
          <div className="manuales-compatibility-grid">
            <div className="manuales-compatible-device">✅ Computadoras de escritorio</div>
            <div className="manuales-compatible-device">✅ Portátiles</div>
            <div className="manuales-compatible-device">✅ Tablets (modo escritorio preferido)</div>
            <div className="manuales-compatible-device">✅ Moviles</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualesRequirements;
