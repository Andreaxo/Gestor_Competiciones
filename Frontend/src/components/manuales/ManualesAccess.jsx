// components/manuales/pages/ManualesAccess.js
import React from 'react';
import login from './ManuealesImg/LOGIN.png';
import landing from './ManuealesImg/LANDING.png';
import cierre from './ManuealesImg/CERRAR SESION.png';

const ManualesAccess = () => {
  return (
    <div className="manuales-page">
      <div className="manuales-page-header">
        <h1>Acceso al Sistema</h1>
        <p>Guía paso a paso para ingresar al gestor de competiciones</p>
      </div>

      <div className="manuales-access-section">
        <div className="manuales-function-card">
          <h2>🔐 Proceso de Autenticación</h2>
          <p>Para acceder al sistema, debes contar con credenciales válidas proporcionadas por el administrador.</p>

          <div className="manuales-steps">
            <div className="manuales-step">
              <span className="manuales-step-number">1</span>
              <div className="manuales-step-content">
                <strong>Accede a la página de inicio</strong>
                <p>Abre tu navegador web y dirígete a la URL del sistema</p>
                <img src={landing} alt="" style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                }} />


              </div>
            </div>
            <div className="manuales-step">
              <span className="manuales-step-number">2</span>
              <div className="manuales-step-content">
                <strong>Localiza el formulario de login</strong>
                <p>Busca los campos de usuario y contraseña en la página principal</p>
              </div>
            </div>
            <div className="manuales-step">
              <span className="manuales-step-number">3</span>
              <div className="manuales-step-content">
                <strong>Ingresa tus credenciales</strong>
                <p>Completa los campos con tu nombre de usuario y contraseña</p>
              <img src={login} alt="" style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                }} />
              </div>
            </div>
            <div className="manuales-step">
              <span className="manuales-step-number">4</span>
              <div className="manuales-step-content">
                <strong>Haz clic en "Iniciar Sesión"</strong>
                <p>Presiona el botón para autenticarte en el sistema</p>
              </div>
            </div>
          </div>
        </div>

        <div className="manuales-function-card">
          <h2>📋 Datos Requeridos</h2>
          <div className="manuales-form-fields">
            <div className="manuales-field-item">
              <strong>Usuario:</strong> Tu nombre de usuario asignado
            </div>
            <div className="manuales-field-item">
              <strong>Contraseña:</strong> Tu contraseña personal
            </div>
            <div className="manuales-field-item">
              <strong>Email:</strong> Dirección de correo electrónico registrada
            </div>
          </div>
        </div>

        <div className="manuales-function-card manuales-warning-card">
          <h2>⚠️ Consideraciones de Seguridad</h2>
          <ul className="manuales-security-list">
            <li>Mantén tus credenciales seguras y no las compartas</li>
            <li>Utiliza contraseñas fuertes con combinación de letras, números y símbolos</li>
            <li>Cierra sesión al terminar de usar el sistema</li>
            <img src={cierre} alt="" style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                }} />
            <li>No accedas desde computadoras públicas o compartidas</li>
          </ul>
        </div>

        <div className="manuales-function-card">
          <h2>🔧 Solución de Problemas</h2>
          <div className="manuales-troubleshooting">
            <div className="manuales-problem">
              <h4>¿Olvidaste tu contraseña?</h4>
              <p>Contacta al administrador del sistema para restablecer tu contraseña.</p>
            </div>
            <div className="manuales-problem">
              <h4>¿Error de credenciales?</h4>
              <p>Verifica que estés ingresando correctamente tu usuario y contraseña.</p>
            </div>
            <div className="manuales-problem">
              <h4>¿Problemas de conexión?</h4>
              <p>Verifica tu conexión a internet y que el servidor esté disponible.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualesAccess;
