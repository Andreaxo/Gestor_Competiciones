import React, { useState } from "react";
import useSkillByIdsData from "../../funtions/skillls/detailSkillById";
import useCompetitorData from "../../funtions/skillls/showCompetitorSkill";
import { ListadoCompetidoresSkills } from "./ListadoCompetidores";
import ShowCompetitionsDocuments from "../documents/skillShowCompetitionsDocument";
import './detailsSkillsStyle.css';
import { FaPerson } from "react-icons/fa6";
import { DeleteOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { url } from "../../config";

function DetailSkill({ onClose }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDocumentOpen, setIsModalDocumentOpen] = useState(false);


  const skillId = localStorage.getItem("selectedSkillId");
  const userRole = localStorage.getItem("userRole")?.toLowerCase();

  const skill = useSkillByIdsData(skillId, refreshKey);
  const competidor1 = useCompetitorData(skill?.comp1 || null, refreshKey) || {};
  const competidor2 = useCompetitorData(skill?.comp2 || null, refreshKey) || {};


  
  const refreshCompetitors = () => {
    setRefreshKey(prev => prev + 1);
  };

  const openSelectCompe = (position, idSkill) => {
    localStorage.setItem('position', position);
    localStorage.setItem('selectedSkillId', idSkill);
    setIsModalOpen(true);
  };

  const openDocument = (skillName) => {
    localStorage.setItem("selectedSkillName", skillName);
    setIsModalDocumentOpen(true);
  };

  const handleAsign = async (position, idSkill,idCompetidor) => {
  

    const endpoint = `${url}/skills/patch${position}/${idSkill}`;
    const messageText = idCompetidor
      ? `Competidor ${position} asignado correctamente`
      : `Competidor ${position} eliminado correctamente`;

    try {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idCompetidor }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      message.success(messageText);
      refreshCompetitors();
      setIsModalOpen(false);
      setAssignData({ position: null, idSkill: null });
    } catch (error) {
      message.error('Error al actualizar el competidor');
    }
  };

const handleDeleteCompetitor = async (position, idSkill) => {
  localStorage.setItem('position', position);
  localStorage.setItem('selectedSkillId', idSkill);
  

  await handleAsign(position, idSkill,null);  // Pasa null para eliminar el competidor

};


  if (!skill) return <div>Cargando...</div>;

  return (
    <div className="private-details__window__flotant">
      <div className="private-details__window__flotant-box">
        <div className="private-details__window__flotant-titles">
          <h1>Detalles de la habilidad</h1>
          <a onClick={onClose}> {"<"} Volver atrás </a>
        </div>

        <div className="private-details__window__flotant-item">
          <div className="private-details__window__flotant-item-documents">
            <h2>{skill.name}</h2>
            {userRole !== 'competidor' && (
              <button
                className="private-details__window__flotant-participants-competitor-button"
                onClick={() => openDocument(skill.name)}
              >
                Ver documentación
              </button>
            )}
          </div>

          <p>{skill.description}</p>

          <div className="private-details__window__flotant-item-competitors">
            <div>
              <div className="private-details__window__flotant-participants">
                <FaPerson /> {skill.numberOfCompetitors}
              </div>
              <h3>Competidores de esta habilidad</h3>
            </div>

            <div className="private-details__window__flotant-participants-competitor">
              <h4>Nombre competidor</h4>
              <h4>Centro de formación</h4>
              {userRole !== 'competidor' && <h4>Acciones</h4>}
            </div>

            {/* Primer competidor */}
            <div className="private-details__window__flotant-participants-competitor">
              <p>{competidor1.name || "No asignado"} {competidor1.lastname || ""}</p>
              <p>{competidor1.formationCenter || "No asignado"}</p>
              {userRole !== 'competidor' && (
                <div className="private-actions-container">
                  <button
                    className="private-details__window__flotant-participants-competitor-button"
                    onClick={() => openSelectCompe(1, skill.idSkills)}
                  >
                    {competidor1.name ? "Cambiar competidor" : "Asignar competidor"}
                  </button>
                  {competidor1.name && (
                    <DeleteOutlined
                      style={{ color: "red", marginLeft: 8, cursor: "pointer" }}
                      onClick={() => handleDeleteCompetitor(1, skill.idSkills)}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Segundo competidor */}
            {skill.numberOfCompetitors > 1 && (
              <div className="private-details__window__flotant-participants-competitor">
                <p>{competidor2.name || "No asignado"} {competidor2.lastname || ""}</p>
                <p>{competidor2.formationCenter || "No asignado"}</p>
                {userRole !== 'competidor' && (
                  <div className="private-actions-container">
                    <button
                      className="private-details__window__flotant-participants-competitor-button"
                      onClick={() => openSelectCompe(2, skill.idSkills)}
                    >
                      {competidor2.name ? "Cambiar competidor" : "Asignar competidor"}
                    </button>
                    {competidor2.name && (
                      <DeleteOutlined
                        style={{ color: "red", marginLeft: 8, cursor: "pointer" }}
                        onClick={() => handleDeleteCompetitor(2, skill.idSkills)}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {isModalOpen && (
            <ListadoCompetidoresSkills
              onClose={() => setIsModalOpen(false)}
              onAssignSuccess={() => {
                refreshCompetitors();
                setIsModalOpen(false);
              }}
            />
          )}

          {isModalDocumentOpen && (
            <ShowCompetitionsDocuments
              onClose={() => setIsModalDocumentOpen(false)}
              onAssignSuccess={() => setIsModalDocumentOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default DetailSkill;
