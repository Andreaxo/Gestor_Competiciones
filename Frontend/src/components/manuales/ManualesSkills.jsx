// components/manuales/pages/ManualesSkills.js
import React from 'react';
import crearHabilidad from './ManuealesImg/CREAR HABILIDAD.png';
import seleccionarHabilidad from './ManuealesImg/SELECCIONARHABILIDAD.png';
import habilidades from './ManuealesImg/HABILIDADES.png';
import seleccionCompetidores from './ManuealesImg/SELECCION DE COMPETIDORES.png';
import asignarCompe from './ManuealesImg/ASIGNARCOMPETIDOR.png';
import confirmarCompe from './ManuealesImg/CONFIRMARCOMPETIDOR.png';
import modificarHabilidad from './ManuealesImg/MODIFICAR HABILIDAD.png';
import modificarHabilidad2 from './ManuealesImg/INTERFAZ MODIFICAR HABILIDAD.png';
import eliminarHabilidad from './ManuealesImg/ELIMINARHABILIDAD.png';
import eliminarHabilidad2 from './ManuealesImg/ELIMINARHABILIDAD2.png';

const ManualesSkills = () => {
  return (
    <div className="manuales-page">
      <div className="manuales-page-header">
        <h1>Módulo de Habilidades</h1>
        <p>Gestión de habilidades específicas para competiciones</p>
      </div>

      <div className="manuales-module-section">
        <div className="manuales-function-card">
          <h2>🎯 Gestión de Habilidades</h2>
          <p >Organiza y administra las diferentes habilidades que participaran los competidores</p>
          <img src={habilidades} alt="" style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
          }} />
          <h3>Funcionalidades principales:</h3>
          <ul>
            <li>Crear nuevas habilidades</li>
            <img src={crearHabilidad} alt="" style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }} />
            <li>Selecionar habilidades</li>

            <img src={seleccionarHabilidad} alt="" style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }} />
            <li>Visualizar habilidades</li>

            <li>Gestionar competidores por habilidad</li>
            <img src={seleccionCompetidores} alt="" style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }} />
            <li>Asignar competidores a esta habilidad</li>
            <img src={asignarCompe} alt="" style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }} />
            <li>Confirmar al asignar competidores a esta habilidad</li>
            <img src={confirmarCompe} alt="" style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }} />
            <li>Modificar habilidades</li>
            <img src={modificarHabilidad} alt="" style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }} />
            <li >Editar la informacion de habilidades Y guardar</li>
            <img src={modificarHabilidad2} alt="" style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }} />

             <li>Tambien podrar eliminar la habilidad luego de confirmar en el pop up</li>
            <img src={eliminarHabilidad} alt="" style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }} />
            <li>Confirmar eliminar</li>
            <img src={eliminarHabilidad2} alt="" style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
            }} />



            
          </ul>
        </div>


      </div>
    </div>
  );
};

export default ManualesSkills;
