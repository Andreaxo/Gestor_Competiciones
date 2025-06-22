import React from "react";
import deleteSkills from "../../funtions/skillls/deleteSkills";
import './deleteSkills.css';
import { message } from "antd";

const DeleteSkills = ({ onClose, onDeleteSuccess }) => {
    const skillId = localStorage.getItem("selectedSkillId");

    const handleSubmit = async () => {
        try {
            await deleteSkills(skillId);
            
            // Mostrar alerta de éxito
            message.success("Habilidad eliminada exitosamente");
            
            // Llamar al callback para actualizar la lista en el componente padre
            if (onDeleteSuccess) {
                onDeleteSuccess();
            } else {
                // Si no se proporciona onDeleteSuccess, simplemente cerramos el modal
                onClose();
            }
        }
        catch (error) {
            message.error("Error al eliminar la habilidad");
            console.error("Error al eliminar la habilidad:", error);
        }
    };

    return (
        <div className="private-deleteSkills__flotant__window">
            <div className="private-deleteSkills__flotant__window__box">
                <h2>¿Está seguro de eliminar esta habilidad?</h2>

                <div className="create__flotant__window-buttons-botton">
                    <button onClick={handleSubmit}>Eliminar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteSkills;
