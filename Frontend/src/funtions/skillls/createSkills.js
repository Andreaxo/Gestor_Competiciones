import { url } from "../../config";

async function createSkill(idCompetition, skillName, competitionName, numberOfCompetitors, description) {
  try {
    // Validación básica antes de enviar la petición
    if (!idCompetition || !skillName || !competitionName || !numberOfCompetitors || !description) {
      throw new Error("Todos los campos: idCompetition, skillName, competitionName, numberOfCompetitors y description son obligatorios.");
    }

    const response = await fetch(`${url}/skills/${idCompetition}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        skillName,
        competitionName,
        numberOfCompetitors,
        description
      })
    });

    if (!response.ok) {
      // Intenta obtener el mensaje de error del backend
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.mensaje || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Devuelve la respuesta completa (success, mensaje, data, etc.)

  } catch (error) {
    console.error('Error al crear la habilidad:', error);
    throw error; // Re-lanzar error para que quien llame maneje la excepción
  }
}

export default createSkill;
