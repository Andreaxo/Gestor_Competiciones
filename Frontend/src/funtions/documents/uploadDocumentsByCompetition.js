import { url } from "../../config";

async function UseUploadDocumentByCompetition(idCompetition, nombre, descripcion, file) {
    try {
        // Crear un FormData para enviar los datos como formulario
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('description', descripcion);
        formData.append('pdf', file);
        formData.append('idCompetition', idCompetition);

        const response = await fetch(
            `${url}/document/uploadCompetitionPdf/${idCompetition}`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error al subir el documento:', error);
        throw error;
    }
}

export default UseUploadDocumentByCompetition;
