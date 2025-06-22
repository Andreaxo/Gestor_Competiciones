import { url } from "../../config";


async function updateCompetition(
  idCompetition,
  competitionName,
  competitionDate,
  place,
  description,
  competitorsAge,
  imageFile
) {
  try {
    // 1) Prepara FormData
    const formData = new FormData();
    formData.append("competitionName", competitionName);
    formData.append("competitionDate", competitionDate);
    formData.append("place", place);
    formData.append("description", description);
    formData.append("competitorsAge", competitorsAge);
    formData.append("image", imageFile);

    // 2) Token para autorización
    const token = localStorage.getItem("token");

    // 3) Petición con fetch
    const response = await fetch(
      `${url}/competitions/update/${idCompetition}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // No poner Content-Type: multipart/form-data aquí
        },
        body: formData,
      }
    );

    // 4) Manejo de estado HTTP
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 5) Parsear respuesta JSON
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al modificar la competición:", error);
    throw error;
  }
}

export default updateCompetition;
