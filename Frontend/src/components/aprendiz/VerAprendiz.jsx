import { useState, useEffect } from "react";
import { message } from "antd";
import '../../styles/Aprendiz/StyleVerAprendiz.css';
import { GoChevronLeft } from "react-icons/go";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import { ModificarAprendiz } from "./ModificarAprendiz";
import { url } from "../../config";

const TIPOS_DOCUMENTO = [
  { value: "Cédula de ciudadanía", label: "Cédula de ciudadanía" },
  { value: "Tarjeta de identidad", label: "Tarjeta de identidad" },
  { value: "Cédula de extranjería", label: "Cédula de extranjería" }
];

const formatearFechaParaInput = (fechaString) => {
  if (!fechaString) return '';
  if (fechaString.includes('T')) {
    const fecha = new Date(fechaString);
    return fecha.toISOString().split('T')[0];
  }
  if (fechaString.match(/^\d{4}-\d{2}-\d{2}$/)) return fechaString;
  const fecha = new Date(fechaString);
  if (isNaN(fecha.getTime())) return '';
  return fecha.toISOString().split('T')[0];
};

export const VerAprendiz = ({ onClose, expertData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSelect, setIsLoadingSelect] = useState(false);
  const [showModificarPopup, setShowModificarPopup] = useState(false);

  const [formData, setFormData] = useState({
    id: expertData?.id || '',
    name: expertData?.name || "",
    lastName: expertData?.lastName || "",
    competitionName: expertData.competitionName,
    formationCenter: expertData.formationCenter,
    rol: expertData.rol,
    birthdate: formatearFechaParaInput(expertData?.birthdate) || "",
    documentType: expertData.documentType,
    documentNumber: expertData.documentNumber,
    email: expertData.documentNumber,
    phone: expertData.phone,
    programName: expertData.programName,
    indexCourse: expertData.indexCourse,
    strategyCompetition: expertData.strategyCompetition,
  });

  useEffect(() => {
    if (expertData) {
      setFormData(prev => ({
        ...prev,
        ...expertData,
        birthdate: formatearFechaParaInput(expertData.birthdate)
      }));
    }
  }, [expertData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Función para mostrar el popup de ModificarExperto
  const handleModificarAprendiz = () => {
    setShowModificarPopup(true);
  };

  // Función para seleccionar como competidor
  const handleSeleccionarCompetidor = async () => {
    if (!formData.id) {
      message.error('ID no encontrado');
      return;
    }

    setIsLoadingSelect(true);
    try {
      // Preparar datos limpios para enviar
      const dataToSend = {
        name: formData.name,
        lastName: formData.lastName,
        birthdate: formData.birthdate,
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        email: formData.email,
        phone: formData.phone,
        formationCenter: formData.formationCenter,
        programName: formData.programName,
        strategyCompetition: formData.strategyCompetition,
        competitionName: formData.competitionName,
        indexCourse: formData.indexCourse,
        rol: 'competidor' // Cambiar el rol a competidor
      };

      // Log para depuración

      const response = await fetch(`${url}/api/clientes/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      // Log de la respuesta para depuración
      
      if (!response.ok) {
        const errorText = await response.text();
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        throw new Error(errorData.message || `Error del servidor: ${response.status}`);
      }

      const responseData = await response.json();
      
      if (responseData) {
        message.success("Competidor seleccionado exitosamente");
        // Actualizar el formData local con el nuevo rol
        setFormData(prev => ({ ...prev, rol: 'competidor' }));
        if (onClose) onClose(responseData, true); // Pasar los datos actualizados al componente padre
      }
    } catch (error) {
      console.error('Error completo al seleccionar competidor:', error);
      message.error(error.message || 'Error al seleccionar competidor');
    } finally {
      setIsLoadingSelect(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id) {
      message.error('ID no encontrado');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${url}/api/clientes/${formData.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al modificar el experto');
      }

      const responseData = await response.json();
      if (responseData) {
        message.success("Experto modificado exitosamente");
        if (onClose) onClose();
      }
    } catch (error) {
      console.error('Error al modificar:', error);
      message.error(error.message || 'Error al modificar el experto');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = ({ type = "text", name = "", placeholder = "", hidden = false }) => (
    <div className="login__container--labelsubcontainer">
      <label htmlFor={name}>{placeholder}</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={`login_container-${type === 'password' ? 'password' : 'user'}input`}
        style={{ display: hidden ? 'none' : 'block' }}
        readOnly={true}
      />
    </div>
  );

  return (
    <div className="crear-experto">
      {showModificarPopup ? (
        <div className="popup-overlay">
          <ModificarAprendiz 
            onClose={(updatedData) => onClose(updatedData, true)} 
            expertData={formData} 
          />
        </div>
      ) : (
        <>
          <button type="button" onClick={onClose} className="submit-button-aprendiz">
            <GoChevronLeft />Volver atrás
          </button>
        
          <h1 className="titulo_crear">
            <b>Aspirante: </b> {formData.name} {formData.lastName}
          </h1>
        
          <form onSubmit={handleSubmit} className="formulario_experto">
            <input type="hidden" name="id" value={formData.id} />
            
            {renderInput({ name: "name", placeholder: "Nombre" })}
            {renderInput({ name: "lastName", placeholder: "Apellido" })}
            {renderInput({ type: "date", name: "birthdate", placeholder: "Fecha de nacimiento" })}
            
            {renderInput({ label: "Tipo de documento", name: "documentType", options: TIPOS_DOCUMENTO })}
            {renderInput({ name: "documentNumber", placeholder: "Número de documento" })}
            {renderInput({ name: "email", placeholder: "Correo electrónico", type: "email" })}
            {renderInput({ name: "phone", placeholder: "Número de teléfono" })}
            
            {renderInput({ placeholder: "Centro de formación", name: "formationCenter"})}
            {renderInput({ placeholder: "Programa de formación",  name: "programName"})}
            
            {renderInput({ name: "strategyCompetition", placeholder: "Competencia" })}
            {renderInput({ name: "competitionName", placeholder: "Habilidad" })}
          </form>

          <div className="buttons-aprendiz-container">
            <button 
              type="button" 
              onClick={handleSeleccionarCompetidor} 
              className="select-button-aprendiz"
              disabled={isLoadingSelect}
            >
              {isLoadingSelect ? "Seleccionando..." : "Seleccionar a competidor"}
            </button>
            
            <button 
              type="button" 
              onClick={handleModificarAprendiz} 
              className="edit-button-aprendiz"
              disabled={isLoading}
            >
              <PiPencilSimpleLineFill/>
              {isLoading ? "Modificando..." : "Modificar"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};