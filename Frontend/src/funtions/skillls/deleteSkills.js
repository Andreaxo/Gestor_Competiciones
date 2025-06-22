import { url } from "../../config";

async function deleteSkills(idSkill) {
    try {
        const response = await fetch(`${url}/skills/delete/${idSkill}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error al eliminar la habilidad:', error);
        throw error;
    }
};

export default deleteSkills;
