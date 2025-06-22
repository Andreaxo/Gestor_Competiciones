// deleteDocumentsByFileName.js
import { url } from "../../config";

async function deleteDocumentByFileName(fileName) {
    try {
        const response = await fetch(`${url}/document/delete/${fileName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error al eliminar el documento:', error);
        throw error;
    }
}

export default deleteDocumentByFileName;
