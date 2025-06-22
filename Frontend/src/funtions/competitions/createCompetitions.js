import { url } from "../../config";


async function createCompetition(
  competitionName,
  competitionDate,
  place,
  description,
  competitorsAge,
  imageFile
) {
  try {
    // 1) Prepara el FormData
    const formData = new FormData();
    formData.append("competitionName", competitionName);
    formData.append("competitionDate", competitionDate);
    formData.append("place", place);
    formData.append("description", description);
    formData.append("competitorsAge", competitorsAge);
    formData.append("image", imageFile);

    // 2) Lee el token para el header Authorization
    const token = localStorage.getItem("token");

    // 3) Envía la petición con fetch
    const response = await fetch(
      `${url}/competitions/create`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // IMPORTANTE: No pongas Content-Type aquí, 
          // fetch lo añadirá automáticamente con boundary
        },
        body: formData,
      }
    );

    // 4) Manejo de errores HTTP
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 5) Parsear y devolver JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear la competición:", error);
    throw error;
  }
}

export default createCompetition;
