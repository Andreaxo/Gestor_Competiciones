import React, { useState } from "react";
import useDocumentsByCompetitionId from "../../funtions/documents/getDocumentsByCompetitionId";
import './ShowCompetitionsDocument.css';
import downloadFile from "../../funtions/documents/getDocumentByFileName";
import deleteDocumentByFileName from "../../funtions/documents/deleteDocumentsByFileName";
import UploadDocumentByCompetition from "./uploadDocumentsbyCompetition";
import { IoMdDownload } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";

function ShowCompetitionsDocuments() {
    const idCompetition = localStorage.getItem("selectedCompetitionId");
    const nameCompetition = localStorage.getItem("selectedCompetitionName");
    

    const documents = useDocumentsByCompetitionId(idCompetition); //hook competicion
    const [isModalUpload, setIsModalUpload] = useState(false); // Estado modulo modificar


    function deleteAndReload(filename) {
        deleteDocumentByFileName(filename);
        alert("Documento eliminado exitosamente");
        window.location.reload();

    }

    
    return (
        <div className="documents__window">
            <div className="documents__container">
                <div className="documents__container-back">
                </div>


                <div className="documents__container-titles"><h1>Documentacion: </h1> <h1>{nameCompetition}</h1></div>
                <div>
                <div className="documents__container_box-header">
                            <div><p>Nombre</p></div>
                            <div><p>Descripcion</p></div>
                            <div><p>Fecha de subida</p></div>
                            <div><p>Opciones</p></div>
                        </div>
                    {documents.map((document) => (
                        <div className="documents__container__item" key={document.idDocuments}>
                            <div><p>{document.documentName}</p></div>
                            <div><p>{document.description}</p></div>
                            <div><p>{document.uploadDate}</p></div>
                            <div className="documents__container__item-icons">
                            <button onClick={() => downloadFile(document.fileName)}><IoMdDownload className="documents__container__item-icons-upload" /></button>
                            <button onClick={() => deleteAndReload(document.fileName)}><MdDeleteForever className="documents__container__item-icons-delete"/></button>
                            </div>
                        </div>
                    ))}
                </div>
                <div> <button onClick={() => setIsModalUpload(true)}>Añadir nuevo documento</button></div>
                {/* condicion para el create solo si isModalOpen es true */}
                {isModalUpload && <UploadDocumentByCompetition onClose={() => setIsModalUpload(false)} />}
            </div>
        </div>
    );
}
export default ShowCompetitionsDocuments;


