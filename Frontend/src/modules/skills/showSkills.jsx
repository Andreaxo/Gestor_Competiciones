import React, { useState } from "react";
import useSkillsData from "../../funtions/skillls/getSkills";
import { useNavigate } from "react-router-dom";
import CreateSkills from "./createSkills";
import UpdateSkills from "./updateSkills";
import { CiEdit } from "react-icons/ci";
import { FaPerson } from "react-icons/fa6";
import './skillsStyle.css'
import DetailSkill from "./detailsSkill";

function ShowSkills() {
    const id = localStorage.getItem("selectedCompetitionId");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
    const [isModalDetailsOpen, setIsModalDetailsOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const userRole = localStorage.getItem("userRole"); // Obtén el rol


    // Ahora pasamos el refreshTrigger al hook
    const skills = useSkillsData(id, refreshTrigger);

    // Función para actualizar la lista de habilidades
    const refreshSkills = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const navigateToSkillById = (skillId) => {
        localStorage.setItem("selectedSkillId", skillId);
        setIsModalDetailsOpen(true);
    };

    const openEdit = (event, skillId) => {
        event.stopPropagation();
        localStorage.setItem("selectedSkillId", skillId);
        setIsModalUpdateOpen(true);
    };

    return (
        <div className="private-skills__box-general">
            <div className="private-skills__box-general-header-normal">
                <div className="private-skills__box-general-titles-normal">
                    <h1>Habilidades</h1>
                    <h2>Escoge una habilidad</h2>
                </div>
                <div className="private-skills__box-general_container-button">
                    <button className="private-skills__box-button" onClick={() => setIsModalOpen(true)}>
                        Crear habilidad
                    </button>
                </div>
            </div>

            {isModalOpen &&
                <CreateSkills
                    onClose={() => setIsModalOpen(false)}
                    onSkillCreated={refreshSkills}
                />
            }

            {isModalUpdateOpen &&
                <UpdateSkills
                    onClose={() => setIsModalUpdateOpen(false)}
                    onSkillUpdated={refreshSkills}
                />
            }

            {isModalDetailsOpen &&
                <DetailSkill
                    onClose={() => setIsModalDetailsOpen(false)}
                />
            }

            <div className="private-skills__box-list">
                {skills && skills.length > 0 ? (
                    skills.map((skill) => (
                        <div key={skill.id} className="private-skills__box-item" onClick={() => navigateToSkillById(skill.id)}>
                            <div></div>
                            <div><h3>{skill.name}</h3></div>
                            <div className="private-skills__box-item-info">
                                <div className="private-skills__box-item-info-box">
                                    <FaPerson />{skill.numberOfCompetitors}
                                </div>
                                {userRole?.toLowerCase() !== "competidor" && (
                                    <button className="private-skills__box-item-icon">
                                        <CiEdit className="private-competitions__box-edit-icon" />
                                        <p
                                            onClick={(event) => openEdit(event, skill.id)}
                                            className="private-competitions__box-edit-title"
                                        >
                                            Modificar
                                        </p>
                                    </button>
                                )}


                            </div>
                        </div>
                    ))
                ) : (
                    <div className="private-skills__box-no-data">
                        <p>No hay habilidades disponibles</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ShowSkills;
