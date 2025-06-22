import React, { useState } from "react";
import createSkill from "../../funtions/skillls/createSkills";
import './createSkills.css';
import { message } from "antd";

const CreateSkills = ({ onClose, onSkillCreated }) => {
    const name = localStorage.getItem("selectedCompetitionName");
    const id = localStorage.getItem("selectedCompetitionId");

    const [formData, setFormData] = useState({
        skillName: '',
        competitionName: name,
        numberOfCompetitors: '',
        description: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        try {
            await createSkill(
                id,
                formData.skillName,
                formData.competitionName,
                formData.numberOfCompetitors,
                formData.description
            );
            
            message.success("Habilidad creada exitosamente");
            
            // Primero actualizamos la lista
            if (onSkillCreated) {
                onSkillCreated();
            }
            
            // Luego cerramos el modal con un pequeño delay
            setTimeout(() => {
                onClose();
            }, 100);
            
        } catch (error) {
           message.error("Hubo un error al crear la Habilidad");
            console.error("Error al crear la Habilidad:", error);
        }
    };

    return (
        <div className="private-create__flotant__window-skills">
            <div className="private-create__flotant__window_tittles-skills">
                <h2>Crear habilidades</h2>
                <a onClick={onClose}> {"<"} Volver atrás </a>
            </div>

            <div className="private-create__flotant__window-skills-container">
                <div className="private-create__flotant__window-skills-container-name">
                    <div className="private-create__flotant__window-skills-container-inputs">
                        <input 
                            type="text" 
                            placeholder="Ej. Desarrollo integral" 
                            name="skillName" 
                            value={formData.skillName} 
                            onChange={handleInputChange} 
                        />
                        <label>Nombre de habilidad</label>
                    </div>
                    <div className="private-create__flotant__window-skills-container-inputs">
                        <input 
                            type="number" 
                            placeholder="Ej. 2" 
                            name="numberOfCompetitors" 
                            value={formData.numberOfCompetitors} 
                            onChange={handleInputChange} 
                            min={1} 
                            max={5}
                        />
                        <label>Número de competidores</label>
                    </div>
                </div>

                <div className="private-create__flotant__window-skills-description-box">
                    <textarea 
                        name="description" 
                        placeholder="Escribe una breve descripción acerca de la habilidad" 
                        className="private-create__flotant__window-skills-description" 
                        value={formData.description} 
                        onChange={handleInputChange} 
                    />
                    <label>Descripción de la competencia</label>
                </div>

                <div className="private-create__flotant__window-skills-botton">
                    <div></div>
                    <div className="private-create__flotant__window-skills-botton-buttons">
                        <button 
                            onClick={handleSubmit} 
                            className="private-create__flotant__window-skills-botton-buttons-create"
                        > 
                            Crear habilidad 
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateSkills;
