import React, { useState } from "react";
import createCompetition from "../../funtions/competitions/createCompetitions";
import './create.css';
import noImage from "../../../public/icons/noImg.png"
import { message } from "antd";

const CreateCompetitions = ({ onClose }) => {

    const [formData, setFormData] = useState({
        competitionName: '',
        competitionDate: '',
        place: '',
        descripcion: '',
        competitorsAge: '',
        image: null
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        
        // Limpiar errores cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Función para validar los datos del formulario
    const validateForm = () => {
        const newErrors = {};
        const today = new Date().toISOString().split("T")[0];

        // Validar nombre de competencia
        if (!formData.competitionName.trim()) {
            newErrors.competitionName = "El nombre de la competencia es obligatorio";
        }

        // Validar fecha
        if (!formData.competitionDate) {
            newErrors.competitionDate = "La fecha de la competencia es obligatoria";
        } else if (formData.competitionDate < today) {
            newErrors.competitionDate = "La fecha no puede ser anterior al día actual";
        }

        // Validar lugar
        if (!formData.place.trim()) {
            newErrors.place = "El lugar de la competencia es obligatorio";
        }

        // Validar edad
        if (!formData.competitorsAge) {
            newErrors.competitorsAge = "La edad máxima es obligatoria";
        } else {
            const age = parseInt(formData.competitorsAge);
            if (age < 14) {
                newErrors.competitorsAge = "La edad mínima debe ser 14 años";
            } else if (age > 100) {
                newErrors.competitorsAge = "La edad máxima no puede ser mayor a 100 años";
            }
        }

        // Validar descripción
        if (!formData.descripcion.trim()) {
            newErrors.descripcion = "La descripción es obligatoria";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        // Validar formulario antes de enviar
        if (!validateForm()) {
            return;
        }

        try {
            await createCompetition(
                formData.competitionName,
                formData.competitionDate,
                formData.place,
                formData.descripcion,
                formData.competitorsAge,
                formData.image
            );
            message.success("Competencia creada exitosamente");
            window.location.reload();
        } catch (error) {
            message.error("Hubo un error al crear la competencia");
            console.error("Error al crear la competencia:", error);
        }
    };

    /* Manejador de la imagen */
    const [image, setImage] = useState(noImage);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                message.warning("Por favor selecciona un archivo de imagen válido (JPEG, PNG, GIF)");
                return;
            }

            // Validar tamaño del archivo (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                message.warning("El archivo es demasiado grande. Máximo 5MB");
                return;
            }

            setFormData({
                ...formData,
                image: file
            });
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="create__flotant__window">
            <h2>Crear nueva competición</h2>

            <div>
                <input 
                    type="text" 
                    required 
                    name="competitionName" 
                    value={formData.competitionName} 
                    onChange={handleInputChange}
                    className={errors.competitionName ? 'error' : ''}
                />
                <label>Nombre de la competencia</label>
                {errors.competitionName && <span className="error-message">{errors.competitionName}</span>}
            </div>

            <div>
                <input 
                    type="date" 
                    required 
                    name="competitionDate" 
                    value={formData.competitionDate} 
                    onChange={handleInputChange} 
                    min={new Date().toISOString().split("T")[0]}
                    className={errors.competitionDate ? 'error' : ''}
                />
                <label>Fecha de la competencia</label>
                {errors.competitionDate && <span className="error-message">{errors.competitionDate}</span>}
            </div>

            <div>
                <input 
                    type="text" 
                    required 
                    name="place" 
                    value={formData.place} 
                    onChange={handleInputChange}
                    className={errors.place ? 'error' : ''}
                />
                <label>Lugar de la competencia</label>
                {errors.place && <span className="error-message">{errors.place}</span>}
            </div>

            <div className="create__flotant__window-image-box update__window__image">
                <img className="img__style" src={image} alt="Imagen no encontrada"  />
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} />

            <div>
                <input 
                    type="number" 
                    required 
                    name="competitorsAge" 
                    value={formData.competitorsAge} 
                    onChange={handleInputChange} 
                    min={14} 
                    max={100}
                    className={errors.competitorsAge ? 'error' : ''}
                />
                <label>Edad máxima de la competencia</label>
                {errors.competitorsAge && <span className="error-message">{errors.competitorsAge}</span>}
            </div>

            <div>
                <textarea 
                    className={`create__flotant__window-description ${errors.descripcion ? 'error' : ''}`}
                    type="text" 
                    required 
                    name="descripcion" 
                    value={formData.descripcion} 
                    onChange={handleInputChange} 
                />
                <label>Descripción de la competencia</label>
                {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
            </div>

            <div className="create__flotant__window-buttons-botton">
                <button onClick={handleSubmit}>Crear</button>
                <button onClick={onClose}>Cancelar</button>
            </div>
        </div>
    );
};

export default CreateCompetitions;
