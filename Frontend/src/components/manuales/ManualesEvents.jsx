// components/manuales/pages/ManualesEvents.js
import React from 'react';

const ManualesEvents = () => {
  return (
    <div className="manuales-page">
      <div className="manuales-page-header">
        <h1>Sistema de Eventos</h1>
        <p>Programación y gestión de eventos relacionados con competiciones</p>
      </div>

      <div className="manuales-module-section">
        <div className="manuales-function-card">
          <h2>📅 Gestión de Eventos</h2>
          <p>Herramientas para programar y administrar eventos del sistema.</p>
          
          <h3>Tipos de eventos:</h3>
          <ul>
            <li>Ceremonias de apertura y clausura</li>
            <li>Sesiones de evaluación</li>
            <li>Talleres y capacitaciones</li>
            <li>Reuniones de coordinación</li>
          </ul>
        </div>

        <div className="manuales-function-card">
          <h2>🕐 Programación</h2>
          <div className="manuales-steps">
            <div className="manuales-step">
              <span className="manuales-step-number">1</span>
              <span>Crear nuevo evento</span>
            </div>
            <div className="manuales-step">
              <span className="manuales-step-number">2</span>
              <span>Definir fecha, hora y ubicación</span>
            </div>
            <div className="manuales-step">
              <span className="manuales-step-number">3</span>
              <span>Asignar participantes</span>
            </div>
            <div className="manuales-step">
              <span className="manuales-step-number">4</span>
              <span>Enviar notificaciones</span>
            </div>
          </div>
        </div>

        <div className="manuales-function-card">
          <h2>🔔 Notificaciones</h2>
          <p>Sistema automatizado de recordatorios y alertas para eventos programados.</p>
          
          <div className="manuales-notification-types">
            <div className="manuales-notification">
              <strong>📧 Email:</strong> Notificaciones por correo electrónico
            </div>
            <div className="manuales-notification">
              <strong>🔔 Sistema:</strong> Alertas dentro de la plataforma
            </div>
            <div className="manuales-notification">
              <strong>📱 Push:</strong> Notificaciones push en dispositivos móviles
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualesEvents;
