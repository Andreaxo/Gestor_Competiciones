import React, { useState, useEffect } from "react";
import useCompetitionssData from "../../funtions/competitions/getCompetitions";
import CreateCompetitions from "./createCompetitions";
import UpdateCompetitions from "./updateCompetitons";
import { useNavigate } from "react-router-dom";
import iconGes from "../../icons/logoTR.png";
import iconSena from "../../icons/senaLogo.png";
import CompetitionItem from "./competitionItem";
import "./showCompetitions.css";

// 🔐 Función para obtener el token del localStorage
const getToken = () => localStorage.getItem("token");

// 🔓 Función para decodificar el JWT
const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const jsonPayload = decodeURIComponent(
      atob(paddedBase64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decodificando token:", error);
    return null;
  }
};

// 🎭 Función para extraer el rol del usuario del token
const getUserRoleFromToken = (decodedToken) => {
  const possibleRoleFields = [
    "role",
    "rol",
    "roles",
    "user_role",
    "userRole",
    "tipo",
    "type",
  ];
  for (const field of possibleRoleFields) {
    if (decodedToken && decodedToken[field]) return decodedToken[field];
  }
  return null;
};

function ShowCompetitions(onClose) {
  const competitions = useCompetitionssData();
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // Extraer rol del token al montar
  useEffect(() => {
    const token = getToken();
    const decoded = decodeJWT(token);
    const role = getUserRoleFromToken(decoded);
    setUserRole(role);
  }, []);

  // Navegar al menú de habilidades
  const navigateToSkill = (id, name, image) => {
    localStorage.setItem("selectedCompetitionName", name);
    localStorage.setItem("selectedCompetitionId", id);
    localStorage.setItem("selectedUpdateCompetitionId", image);
    navigate("/menu");
  };

  // Abrir modal para actualizar (solo si no es competidor)
  const navigateToUpdate = (event, id) => {
    event.stopPropagation();
    if (userRole?.toLowerCase() !== "competidor") {
      localStorage.setItem("selectedUpdateCompetitionId", id);
      setIsModalUpdateOpen(true);
    }
  };

  return (
    <div className="competitions__box">
      <div className="competitions__box-general">
        {/* Iconos superiores */}
        <div className="competitions__box-icons">
          <div className="competitions__box-icons-list">
            <img src={iconGes} alt="Logo TR" />
          </div>
          <div className="competitions__box-icons-list">
            <img src={iconSena} alt="Logo Sena" />
          </div>
        </div>

        {/* Título */}
        <div className="competitions__box-title">
          <h1>Competiciones</h1>
        </div>

        {/* Modales */}
        {isModalUpdateOpen && (
          <UpdateCompetitions onClose={() => setIsModalUpdateOpen(false)} />
        )}
        {isModalCreateOpen && (
          <CreateCompetitions onClose={() => setIsModalCreateOpen(false)} />
        )}

        {/* Lista de competiciones */}
        <div className="competitions__box-list">
          {competitions.map((competition) => (
            <CompetitionItem
              key={competition.id}
              competition={competition}
              onClick={() =>
                navigateToSkill(
                  competition.id,
                  competition.name,
                  competition.image
                )
              }
              onEdit={(event) => navigateToUpdate(event, competition.id)}
            />
          ))}

          {/* Botón para crear - solo si no es competidor */}
          {userRole?.toLowerCase() !== "competidor" && (
            <button
              className="competitions__box-button"
              onClick={() => setIsModalCreateOpen(true)}
            >
              Crear nueva competición
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ShowCompetitions;
