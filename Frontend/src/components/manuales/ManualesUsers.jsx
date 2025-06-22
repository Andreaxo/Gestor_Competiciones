// components/manuales/pages/ManualesUsers.js
import React from 'react';

const ManualesUsers = () => {
  return (
    <div className="manuales-page">
      <div className="manuales-page-header">
        <h1>Módulo de Usuarios</h1>
        <p>Administración completa de usuarios del sistema</p>
      </div>

      <div className="manuales-module-section">
        <div className="manuales-function-card">
          <h2>👥 Tipos de Usuario</h2>
          <div className="manuales-user-types">
            <div className="manuales-user-type">
              <h4>🎓 Inscritos</h4>
              <p>Usuarios registrados en el sistema con acceso básico</p>
            </div>
            <div className="manuales-user-type">
              <h4>🏃 Aspirantes</h4>
              <p>Usuarios que han aplicado para participar en competiciones</p>
            </div>
            <div className="manuales-user-type">
              <h4>🏆 Competidores</h4>
              <p>Participantes activos en las competiciones</p>
            </div>
            <div className="manuales-user-type">
              <h4>👨‍🏫 Expertos</h4>
              <p>Evaluadores y jueces con permisos especiales</p>
            </div>
          </div>
        </div>

        <div className="manuales-function-card">
          <h2>⚙️ Gestión de Usuarios</h2>
          <p>Herramientas para administrar los diferentes tipos de usuarios.</p>
          
          <h3>Funcionalidades disponibles:</h3>
          <ul>
            <li>Registrar nuevos usuarios</li>
            <li>Modificar información de usuarios</li>
            <li>Asignar roles y permisos</li>
            <li>Gestionar estados de usuario</li>
            <li>Generar reportes de usuarios</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManualesUsers;
