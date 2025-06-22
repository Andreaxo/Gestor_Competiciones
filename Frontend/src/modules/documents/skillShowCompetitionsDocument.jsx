import React, { useState } from "react";
import useDocumentsBySkillId from "../../funtions/documents/getDocumentsBySkillId";
import './ShowCompetitionsDocument.css';
import downloadFile from "../../funtions/documents/getDocumentByFileName";
import deleteDocumentByFileName from "../../funtions/documents/deleteDocumentsByFileName";
import UploadDocumentBySkill from "./skillUploadDocumentsbyCompetition";
import { IoMdDownload } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";

function ShowCompetitionsDocuments({ onClose }) {
    const idSkill = localStorage.getItem("selectedSkillId");
    const nameSkill = localStorage.getItem("selectedSkillName");
    
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isModalUpload, setIsModalUpload] = useState(false);
    
    // Pasamos el refreshTrigger al hook
    const documents = useDocumentsBySkillId(idSkill, refreshTrigger);

    // Función para refrescar la lista de documentos
    const refreshDocuments = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // Función mejorada para eliminar sin recargar la página
    const deleteAndRefresh = async (filename) => {
        try {
            await deleteDocumentByFileName(filename);
            alert("Documento eliminado exitosamente");
            refreshDocuments(); // Refrescar solo el componente
        } catch (error) {
            alert("Error al eliminar el documento");
            console.error("Error:", error);
        }
    };

    return (
        <div className="documents__window-skills">
            <div className="documents__container">
                <div className="documents__container-back">
                    <a onClick={onClose} className="details__window__flotant-titles-back"> {"<"} Volver atrás </a>
                </div>


                <div className="documents__container-titles">
                    <h2>Documentacion:  </h2> 
                    <h2> {nameSkill} </h2>
                </div>
                
                <div>
                    <div className="documents__container_box-header">
                        <div><p>Nombre</p></div>
                        <div><p>Descripcion</p></div>
                        <div><p>Fecha de subida</p></div>
                        <div><p>Opciones</p></div>
                    </div>
                    
                    {documents && documents.length > 0 ? (
                        documents.map((document) => (
                            <div className="documents__container__item" key={document.idDocuments}>
                                <div><p>{document.documentName}</p></div>
                                <div><p>{document.description}</p></div>
                                <div><p>{document.uploadDate}</p></div>
                                <div className="documents__container__item-icons">
                                    <button onClick={() => downloadFile(document.fileName)}>
                                        <IoMdDownload className="documents__container__item-icons-upload" />
                                    </button>
                                    <button onClick={() => deleteAndRefresh(document.fileName)}>
                                        <MdDeleteForever className="documents__container__item-icons-delete"/>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="documents__container__no-data">
                            <p>No hay documentos disponibles</p>
                        </div>
                    )}
                </div>
                
                <div> 
                    <button 
                        className="documents__container__item-add" 
                        onClick={() => setIsModalUpload(true)}
                    >
                        Añadir nuevo documento
                    </button>
                </div>
                
                {isModalUpload && 
                    <UploadDocumentBySkill
                        onClose={() => setIsModalUpload(false)}
                        onDocumentUploaded={refreshDocuments} // Pasar función de refresh
                    />
                }
            </div>
        </div>
    );
}

export default ShowCompetitionsDocuments;
