import { useState, useCallback } from 'react';
import { ListadoInscritos } from './ListadoInscritos';
import { ListadoCompetidor } from '../competidores/ListadoCompetidor';
import { ListadoAprendiz } from '../aprendiz/ListadoAprendiz';

export const GestionInscritos = () => {
    const [currentView, setCurrentView] = useState('inscritos'); // 'inscritos', 'competidor', 'aprendiz'
    const [listaInscritos, setListaInscritos] = useState([]); // Estado para almacenar la lista de inscritos
    
    // Función para eliminar un inscrito de la lista cuando se envía a otra categoría
    const removeInscrito = useCallback((inscritoId) => {
        setListaInscritos(prevLista => prevLista.filter(inscrito => inscrito.id !== inscritoId));
    }, []);

    const handleComponentChange = (rol, inscritoId) => {
        // Eliminar el inscrito de la lista
        removeInscrito(inscritoId);
        
        // Cambiar a la vista correspondiente
        setCurrentView(rol === 'competidor' ? 'competidor' : 'aprendiz');
    };

    // Función para actualizar la lista de inscritos
    const updateListaInscritos = useCallback((nuevaLista) => {
        setListaInscritos(nuevaLista);
    }, []);

    // Renderizar el componente según el estado actual
    const renderCurrentView = () => {
        switch (currentView) {
            case 'competidor':
                return <ListadoCompetidor />;
            case 'aprendiz':
                return <ListadoAprendiz />;
            default:
                return (
                    <ListadoInscritos 
                        onComponentChange={handleComponentChange} 
                        listaInscritos={listaInscritos} 
                        updateListaInscritos={updateListaInscritos}
                    />
                );
        }
    };

    // Botones para navegar entre vistas
    const renderNavButtons = () => (
        <div className="navegacion-botones">
            <button 
                onClick={() => setCurrentView('inscritos')}
                className={currentView === 'inscritos' ? 'active' : ''}
            >
                Inscritos
            </button>
            <button 
                onClick={() => setCurrentView('competidor')}
                className={currentView === 'competidor' ? 'active' : ''}
            >
                Competidores
            </button>
            <button 
                onClick={() => setCurrentView('aprendiz')}
                className={currentView === 'aprendiz' ? 'active' : ''}
            >
                Aprendices
            </button>
        </div>
    );

    return (
        <div className="gestion-inscritos-container">
            {renderNavButtons()}
            {renderCurrentView()}
        </div>
    );
};