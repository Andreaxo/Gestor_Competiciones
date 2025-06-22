import { useState, useEffect } from "react";
import { url } from "../../config";

function useSkillsData(idCompetition, refreshTrigger) {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const GetDatos = async () => {
      try {
        const response = await fetch(`${url}/skills/${idCompetition}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

setSkills(
  Array.isArray(data.data)
    ? data.data.map((skill) => ({
        id: skill.idSkills,
        name: skill.skillName,
        competitionName: skill.competitionName,
        idCompetition: skill.idCompetition,
        numberOfCompetitors: skill.numberOfCompetitors,
        description: skill.description,
        idcomp1: skill.comp1,
        idcomp2: skill.comp2
      }))
    : []
);

      } catch (error) {
        console.error('Error al obtener habilidades del id de competición:', idCompetition, error);
      }
    };

    if (idCompetition) {
      GetDatos();
    }
  }, [idCompetition, refreshTrigger]); // Agregamos refreshTrigger aquí

  return skills;
}

export default useSkillsData;
