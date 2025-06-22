import React, { useState } from "react";
import UseUploadDocumentBySkill from "../../funtions/documents/uploadDocumentsBySkillId";
import './uploadCompetitions.css'
import { FiUpload } from "react-icons/fi";

const UploadDocumentBySkill = ({ onClose, onDocumentUploaded }) => {
    const id = localStorage.getItem("selectedSkillId");
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        pdf: null
    });
    const [isUploading, setIsUploading] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (event) => {
        const { files } = event.target;
        setFormData({
            ...formData,
            pdf: files[0]
        });
    };

    const handleSubmit = async () => {
        // Validaciones básicas
        if (!formData.nombre.trim()) {
            alert("Por favor ingresa el nombre del archivo");
            return;
        }
        
        if (!formData.descripcion.trim()) {
            alert("Por favor ingresa una descripción");
            return;
        }
        
        if (!formData.pdf) {
            alert("Por favor selecciona un archivo");
            return;
        }

        setIsUploading(true);
        
        try {
            await UseUploadDocumentBySkill(
                id,
                formData.nombre,
                formData.descripcion,
                formData.pdf
            );
            
            alert("Archivo subido exitosamente");
            
            // Llamar al callback para actualizar la lista de documentos
            if (onDocumentUploaded) {
                onDocumentUploaded();
            }
            
            // Cerrar el modal después de un pequeño delay
            setTimeout(() => {
                onClose();
            }, 100);
            
        } catch (error) {
            alert("Hubo un error al subir el archivo");
            console.error("Error al subir el archivo:", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="upload__modal-overlay">
            <div className="upload__container">
                <h2>Subir nuevo archivo</h2>
                
                <div className="upload__container_inputs-text">
                    <div className="upload__input-group">
                        <input
                            placeholder="Ingrese el nombre del archivo"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            type="text"
                            disabled={isUploading}
                        />
                        <label>Nombre del archivo</label>
                    </div>

                    <div className="upload__input-group">
                        <input
                            placeholder="Descripción del archivo"
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            type="text"
                            disabled={isUploading}
                        />
                        <label>Descripción</label>
                    </div>
                </div>

                <div className="upload__file-section">
                    <input 
                        type="file" 
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.txt"
                        disabled={isUploading}
                    />
                    {formData.pdf && (
                        <p className="upload__file-selected">
                            Archivo seleccionado: {formData.pdf.name}
                        </p>
                    )}
                </div>

                <div className="upload__buttons">
                    <button 
                        onClick={handleSubmit} 
                        disabled={isUploading}
                        className="upload__btn-create"
                    >
                        {isUploading ? "Subiendo..." : "Subir archivo"}
                    </button>
                    <button 
                        onClick={onClose}
                        disabled={isUploading}
                        className="upload__btn-cancel"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadDocumentBySkill;
