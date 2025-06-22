import { useState, useEffect } from "react";
import { url } from "../../config";

function useCompetitorData(idCompetitor, refreshKey = 0) {
  const [competitor, setCompetitor] = useState(null); // usa `null` en vez de `[]` para un solo objeto

  useEffect(() => {
    if (!idCompetitor) {
      setCompetitor(null);
      return;
    }

    const getDatos = async () => {
      try {
        const response = await fetch(`${url}/api/clientes/${idCompetitor}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.error === "" && data.body) {
          const comp = data.body;
          setCompetitor({
            name: comp.name,
            lastname: comp.lastName,
            formationCenter: comp.formationCenter
          });
        } else {
          console.error("Error en la respuesta:", data.error);
          setCompetitor(null);
        }
      } catch (error) {
        console.error("Error al obtener el competidor:", error);
        setCompetitor(null);
      }
    };

    getDatos();
  }, [idCompetitor, refreshKey]); // <- observa que ahora depende también de refreshKey

  return competitor;
}

export default useCompetitorData;
