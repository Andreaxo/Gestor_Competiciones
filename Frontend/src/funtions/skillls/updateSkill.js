import { url } from "../../config";

async function updateSkill(idSkill, skillName, competitionName, numberOfCompetitors, description, idCompetition) {
    try {
        const response = await fetch(`${url}/skills/update/${idSkill}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                skillName: skillName,
                competitionName: competitionName,
                numberOfCompetitors: numberOfCompetitors,
                description: description,
                idCompetition: idCompetition,
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error al crear la habilidad:', error);
        throw error;
    }
};

export default updateSkill;
