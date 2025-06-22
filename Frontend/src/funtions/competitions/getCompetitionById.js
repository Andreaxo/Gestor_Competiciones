import { useState, useEffect } from "react";
import { url } from "../../config";

function useCompetitionsDataById(idCompetition) {
  const [competitions, setCompetitions] = useState([]);

  useEffect(() => {
    if (!idCompetition) return; // espera a tener un id válido

    const getDatos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${url}/competitions/${idCompetition}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
          }))
        );
      } catch (error) {
        console.error("Error al obtener competiciones por ID:", error);
      }
    };

    getDatos();
  }, [idCompetition]);

  return competitions;
}

export default useCompetitionsDataById;
