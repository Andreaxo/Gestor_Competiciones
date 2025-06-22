// components/manuales/pages/ManualesCompetitions.js
import React from 'react';
import visualizarCompe from './ManuealesImg/VISUALIZARCOMPETENCIA.png';
import crearCompe from './ManuealesImg/CREAR COMPETICION.png';
import modificarCompe from './ManuealesImg/MODIFICAR COMPETICION.png';
import crearInterCompe from './ManuealesImg/CREAR - INTERFAZ.png';
import guardarCompe from './ManuealesImg/GUARDAR COMPETICION.png';
import eliminaCompe from './ManuealesImg/ELIMINAR BOTON.png';


const ManualesCompetitions = () => {
  return (
    <div className="manuales-page">
      <div className="manuales-page-header">
        <h1>Módulo de Competiciones</h1>
        <p>Gestión completa de competiciones deportivas y académicas</p>
      </div>

      <div className="manuales-module-section">
        <div className="manuales-function-card">
          <h2>👀 Visualizar Competiciones</h2>
          <p>Accede a todas las competencias disponibles en el sistema. Podrás ver una lista completa de competiciones activas y seleccionar cualquiera para obtener más detalles.</p>
          <div className="manuales-steps">
            <div className="manuales-step">
              <span className="manuales-step-number">1</span>
              <span>Navega al módulo de competiciones</span>
            </div>
            <img src={visualizarCompe} alt="" style={{
                              width: '100%',
                              height: 'auto',
                              objectFit: 'contain',
                            }} />
            <div className="manuales-step">
              <span className="manuales-step-number">2</span>
              <span>Explora la lista de competiciones disponibles</span>
            </div>
            <div className="manuales-step">
              <span className="manuales-step-number">3</span>
              <span>Selecciona una competición para ver detalles</span>
            </div>
          </div>
        </div>

        <div className="manuales-function-card">
          <h2>➕ Crear Competición</h2>
          <p>Crea nuevas competiciones completando la información requerida.</p>
          <img src={crearCompe} alt="" style={{
                              width: '100%',
                              height: 'auto',
                              objectFit: 'contain',
                            }} />
          <div className="manuales-form-fields">
            <h3>Campos requeridos:</h3>
            <ul>
              <li><strong>Nombre:</strong> Título de la competición</li>
              <li><strong>Fecha:</strong> Fecha de realización</li>
              <li><strong>Lugar:</strong> Ubicación del evento</li>
              <li><strong>Imagen:</strong> Imagen representativa</li>
              <li><strong>Edad máxima:</strong> Límite de edad para participantes</li>
              <li><strong>Descripción:</strong> Detalles de la competición</li>
            </ul>
          </div>
          <div className="manuales-action-button">
             <img src={crearInterCompe} alt="" style={{
                              width: '100%',
                              height: 'auto',
                              objectFit: 'contain',
                            }} />
            <button className="manuales-btn-primary">Crear Nueva Competición</button>
          </div>
        </div>

        <div className="manuales-function-card">
          <h2>✏️ Modificar Competición</h2>
          
          <p>Edita los datos de competiciones existentes.</p>
          
          <div className="manuales-steps">
            <div className="manuales-step">
              <span className="manuales-step-number">1</span>
              <span>Haz clic sobre la competición deseada</span>
            </div>
            <div className="manuales-step">
              <span className="manuales-step-number">2</span>
              <span>Selecciona el icono de lápiz (modificar)</span>
              
              
            </div>
            <img src={modificarCompe} alt="" style={{
                              width: '100%',
                              height: 'auto',
                              objectFit: 'contain',
                            }} />
            <div className="manuales-step">
              <span className="manuales-step-number">3</span>
              <span>Edita los campos necesarios</span>
            </div>
            <div className="manuales-step">
              <span className="manuales-step-number">4</span>
              <span>Guarda los cambios</span>
              
            </div>
            <img src={guardarCompe} alt="" style={{
                              width: '100%',
                              height: 'auto',
                              objectFit: 'contain',
                            }} />
          </div>
        </div>

        <div className="manuales-function-card manuales-danger">
          <h2>🗑️ Eliminar Competición</h2>
          <p>Elimina competiciones que ya no sean necesarias.</p>
          <div className="manuales-warning">
            <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer. Asegúrate de que realmente deseas eliminar la competición.
          </div>
          <div className="manuales-steps">
            <div className="manuales-step">
              <span className="manuales-step-number">1</span>
              <span>Accede a modificar competición</span>
            </div>
            <div className="manuales-step">
              <span className="manuales-step-number">2</span>
              <span>Haz clic en el icono de eliminar (rojo)</span>
            </div>
            <img src={eliminaCompe} alt="" style={{
                              width: '100%',
                              height: 'auto',
                              objectFit: 'contain',
                            }} />
            <div className="manuales-step">
              <span className="manuales-step-number">3</span>
              <span>Confirma la eliminación</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualesCompetitions;
