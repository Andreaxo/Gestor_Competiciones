import React, { useState } from "react";
import useSkillsData from "../../funtions/skillls/getSkills";
import { FaPerson } from "react-icons/fa6";
import "./skills.css";
import PublicDetailSkill from "./publicdetailsSkill";

export default function PublicShowSkills({ onClose }) {
  const competitionId = localStorage.getItem("selectedCompetitionId");
  const [isModalDetailsOpen, setIsModalDetailsOpen] = useState(false);
  const skills = useSkillsData(competitionId);

  const openDetail = (skillId) => {
    localStorage.setItem("selectedSkillId", skillId);
    setIsModalDetailsOpen(true);
  };

  return (
    <div className="publicSkills__box-general">
      {isModalDetailsOpen && (
        <PublicDetailSkill onClose={() => setIsModalDetailsOpen(false)} />
      )}

      <header className="publicSkills__box-general-header">
        <h1>Habilidades de esta competencia</h1>
      </header>

<a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    localStorage.removeItem("selectedCompetitionId"); // Opcional
    window.location.reload(); // Recarga la página
  }}
  style={{
    display: "flex",
    marginBottom: "1rem",
    color: "black",
    textDecoration: "none",
    cursor: "pointer"
  }}
>
  {"<"} Volver atrás
</a>


      <ul className="skills__box-list">
        {skills.map((skill) => (
          <li
            key={skill.idSkills}
            className="publicSkills__box-item"
            onClick={() => openDetail(skill.id)}
          >
            <span className="publicSkills__box-item-title">{skill.name}</span>
            <span className="publicSkills__box-item-info">
              <FaPerson /> {skill.numberOfCompetitors}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
