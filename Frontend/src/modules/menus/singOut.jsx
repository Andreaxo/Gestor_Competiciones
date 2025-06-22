import React from "react";
import { useNavigate } from "react-router-dom";
import "./sigOut.css"; 

function ExitSystem() {
    const navigate = useNavigate();

    // Función para limpiar los datos del usuario del localStorage
    const clearUserDataFromStorage = () => {
        localStorage.removeItem('idUsuario');
        localStorage.removeItem('userRole');
    };

    // Función completa para cerrar sesión con todas las limpiezas
    const navigateToExit = () => {

        // Limpiar localStorage - tokens y datos de competencia
        localStorage.removeItem("token");
        localStorage.removeItem("selectedCompetitionName");

        // Limpiar datos del usuario del localStorage
        clearUserDataFromStorage();

        // Limpiar cualquier URL de imagen que pueda estar en memoria
        // Buscar todas las URLs de objeto que puedan existir
        const logoCompetencia = localStorage.getItem('logoCompetenciaUrl');
        if (logoCompetencia && logoCompetencia.startsWith('blob:')) {
            URL.revokeObjectURL(logoCompetencia);
            localStorage.removeItem('logoCompetenciaUrl');
        }

        // Limpiar cualquier otro dato relacionado con la sesión
        localStorage.removeItem('selectedCompetitionId');
        localStorage.removeItem('currentMenu');
        localStorage.removeItem('activeButton');

        // Opcional: Limpiar todo el localStorage si es necesario
        // localStorage.clear();

        // Redirigir a la página principal
        navigate("/");
    };

    // Función alternativa para salir completamente del sistema
    const exitSystemCompletely = () => {
        
        // Limpiar todo el localStorage
        localStorage.clear();
        
        // Limpiar sessionStorage también si se usa
        sessionStorage.clear();
       
        // Redirigir y recargar la página para asegurar limpieza completa
        navigate("/");
        window.location.reload();
    };

    // Función para confirmar antes de salir (opcional)
    const confirmExit = () => {
        const confirmed = window.confirm('¿Estás seguro de que quieres salir del sistema?');
        if (confirmed) {
            navigateToExit();
        }
    };

    return (
        <div className="exit__general__box-singout">
    
            <div>
                <a onClick={() => confirmExit()}>
                    Salida segura
                </a>
            </div>
            
        
        </div>
    );            
} 

export default ExitSystem;
