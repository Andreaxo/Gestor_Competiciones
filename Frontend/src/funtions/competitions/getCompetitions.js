import { useState, useEffect } from "react";
import { url } from "../../config";

function useCompetitionsData() {
  const [competitions, setCompetitions] = useState([]);

  useEffect(() => {
    const getDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${url}/competitions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Añade el bearer token al header:
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        setCompetitions(
          data.map((competition) => ({
            id: competition.idCompetitions,
            name: competition.competitionName,
            date: competition.competitionDate,
            place: competition.place,
            numberOfCompetitors: competition.numberOfCompetitors,
            description: competition.description,
            age: competition.competitorsAge,
            image: competition.imagenName,
            requirements: competition.competitorRequirements,
          }))
        );
      } catch (error) {
        console.error("Error al obtener competiciones:", error);
      }
    };

    getDatos();
  }, []);

  return competitions;
}

export default useCompetitionsData;
