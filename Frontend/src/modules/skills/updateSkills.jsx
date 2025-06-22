import React, { useState, useEffect } from "react";
import useSkillByIdsData from "../../funtions/skillls/detailSkillById";
import './createSkills.css';
import updateSkill from "../../funtions/skillls/updateSkill";
import DeleteSkills from "./deleteSkills";
import { MdDeleteForever } from "react-icons/md";
import { message } from "antd";

const UpdateSkills = ({ onClose, onSkillUpdated }) => {
    const name = localStorage.getItem("selectedCompetitionName");
    const id = localStorage.getItem("selectedCompetitionId");
    const skillId = localStorage.getItem("selectedSkillId");
    const skills = useSkillByIdsData(skillId);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);


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

    useEffect(() => {
        if (skills) {
    setFormData({
        skillName: skills.skillName || '',
        numberOfCompetitors: skills.numberOfCompetitors || '',
        description: skills.description || ''
    });
}
    }, [skills, name]);

    const handleSubmit = async () => {
        try {
            await updateSkill(
                skillId,
                formData.skillName,
                name,
                formData.numberOfCompetitors,
                formData.description,
                id
            );

            message.success("Habilidad modificada exitosamente");
            
            // Llamar al callback para actualizar la lista en el componente padre
            if (onSkillUpdated) {
                onSkillUpdated();
            }
            
            // Cerrar el modal en lugar de recargar la página
            onClose();
        } catch (error) {
           message.error("Hubo un error al modificar la Habilidad");
            console.error("Error al modificar la Habilidad:", error);
        }
    };

    // Función para manejar la eliminación exitosa
    const handleDeleteSuccess = () => {
        // Notificar al componente padre que debe actualizar la lista
        if (onSkillUpdated) {
            onSkillUpdated();
        }
        // Cerrar ambos modales
        setIsModalDeleteOpen(false);
        onClose();
    };

    return (
        <div className="private-create__flotant__window-skills">
            {isModalDeleteOpen && (
                <DeleteSkills 
                    onClose={() => setIsModalDeleteOpen(false)} 
                    onDeleteSuccess={handleDeleteSuccess}
                />
            )}

            <div className="private-create__flotant__window_tittles-skills">
                <h2>Modificar habilidad</h2>
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
                        type="text" 
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
                            className="private-create__flotant__window-skills-botton-buttons-delete" 
                            onClick={() => setIsModalDeleteOpen(true)}
                        >
                            <MdDeleteForever className="private-competitions__box-edit-delete-icon" />
                        </button>
                        <button onClick={handleSubmit}>
                            Modificar habilidad
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateSkills;
