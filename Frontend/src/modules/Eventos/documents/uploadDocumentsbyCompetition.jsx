import React, { useState } from "react";
import UseUploadDocumentByCompetition from "../../funtions/documents/uploadDocumentsByCompetition";
import './uploadCompetitions.css'
const UploadDocumentByCompetition = ({ onClose }) => {

    const id = localStorage.getItem("selectedCompetitionId");
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        pdf: null
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (event) => {
        const { files } = event.target; // Capturamos el archivo seleccionado
        setFormData({
            ...formData,
            pdf: files[0] // Solo tomamos el primer archivo, ya que un campo de tipo "file" puede permitir múltiples archivos
        });
    };

    const handleSubmit = async () => {
        try {
            await UseUploadDocumentByCompetition(
                id,
                formData.nombre,
                formData.descripcion,
                formData.pdf
            );
            alert("Archivo subido exitosamente");
            window.location.reload();
        } catch (error) {
            alert("Hubo un error al subir el archivo");
            console.error("Error al subir el archivo:", error);
        }
    };

    return (
        <div>
            <div className="upload__container">

                <h2>Subir nuevo archivo</h2>
                <div className="upload__container_inputs-text">
                    <input
                        placeholder="Ingrese el nombre del archivo"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        type="text" />
                    <label htmlFor="">Nombre del archivo</label>

                    <input
                        placeholder="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        type="text" />

                </div>

                <div>
                <input type="file" onChange={handleFileChange} />
                    <button onClick={handleSubmit} >Crear</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>

    );
};

export default UploadDocumentByCompetition;
