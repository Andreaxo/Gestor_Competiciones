import { useState, useEffect } from "react";
import { url } from "../../config";

function useSkillByIdsData(idSkill, refreshKey = 0) {
  const [skill, setSkill] = useState(null);

  useEffect(() => {
    if (!idSkill) return;

    const GetDatos = async () => {
      try {
        const response = await fetch(`${url}/skills/byId/${idSkill}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // Asumiendo que data.data contiene el objeto skill
        setSkill(data.data || null);
      } catch (error) {
        console.error('Error al obtener habilidad:', error);
        setSkill(null);
      }
    };

    GetDatos();
  }, [idSkill, refreshKey]);

  return skill;
}
export default useSkillByIdsData;
