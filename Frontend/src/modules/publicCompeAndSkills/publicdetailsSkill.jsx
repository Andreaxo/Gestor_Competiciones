import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import useSkillByIdsData from "../../funtions/skillls/detailSkillById";
import "./detailsSkills.css";
import { FaPerson } from "react-icons/fa6";

function PublicDetailSkill({ onClose }) {
  const skillId = localStorage.getItem("selectedSkillId");
  const skill = useSkillByIdsData(skillId); // Ya no es un array

  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  if (!skill) {
    return null; // O puedes mostrar un spinner: <div>Cargando...</div>
  }

  const modalContent = (
    <div className="publicDetails__window__flotant">
      <div className="details__window__flotant-box">
        <div className="publicDetails__window__flotant-titles">
          <h1>Detalles de la habilidad</h1>
          <a onClick={onClose} className="btn-close">
            {"<"} Volver
          </a>
        </div>

        <div>
          <div className="details__window__flotant-item" key={skill.idSkills}>
            <h2 className="details__window__flotant-item-title">{skill.name}</h2>
            <p className="details__window__flotant-item-text">{skill.description}</p>
            <div className="details__window__flotant-participants">
              <FaPerson /> {skill.numberOfCompetitors}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

export default PublicDetailSkill;

