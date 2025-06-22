import { useState, useEffect } from "react";
import { url } from "../../config";

function useDocumentsByCompetitionId(idCompetition, refreshTrigger) {
  const [document, setDocument] = useState([]);

  useEffect(() => {
    const GetDocument = async () => {
      try {
        const response = await fetch(`${url}/document/getByCompetitionID/${idCompetition}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
 
        setDocument(
          data.map(document => ({
            idDocuments: document.idDocuments, // Cambié 'id' por 'idDocuments' para que coincida con tu componente
            fileName: document.fileName,
            documentName: document.documentName,
            description: document.description,
            uploadDate: document.uploadDate,
            competitionId: document.competitionId
          }))
        );
      } catch (error) {
        console.error('Error al obtener documentos:', error);
        setDocument([]); // Establecer array vacío en caso de error
      }
    };

    if (idCompetition) {
      GetDocument();
    }

  }, [idCompetition, refreshTrigger]); // Agregamos refreshTrigger aquí

  return document;
}

export default useDocumentsByCompetitionId;
