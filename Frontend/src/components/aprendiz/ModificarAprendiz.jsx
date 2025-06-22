import axios from "axios";
import { useState, useEffect } from "react";
import { message } from "antd";
import '../../styles/Aprendiz/StyleModificarAprendiz.css';
import { GoChevronLeft } from "react-icons/go";
import { PiPencilSimpleLineFill } from "react-icons/pi";
import { url } from "../../config";

const TIPOS_DOCUMENTO = [
    { value: "Cédula de ciudadanía", label: "Cédula de ciudadanía" },
    { value: "Tarjeta de identidad", label: "Tarjeta de identidad" },
    { value: "Cédula de extranjería", label: "Cédula de extranjería" }
];
  
const CENTROS_FORMACION = [
    { value: "Centro Atención Sector Agropecuario", label: "Centro Atención Sector Agropecuario" },
    { value: "Centro de Diseño e Innovación Tecnológica Industrial", label: "Centro de Diseño e Innovación Tecnológica Industrial" },
    { value: "Centro de comercio y servicios", label: "Centro de comercio y servicios" }
];
  
const PROGRAMAS_FORMACION = [
    { value: "Análisis y desarrollo de software", label: "Análisis y desarrollo de software" },
    { value: "Multimedia", label: "Multimedia" },
    { value: "Infraestructura", label: "Infraestructura" }
];

// Función auxiliar para formatear la fecha
const formatearFechaParaInput = (fechaString) => {
  if (!fechaString) return '';
  
  // Maneja cadenas de fecha ISO
  if (fechaString.includes('T')) {
      const fecha = new Date(fechaString);
      return fecha.toISOString().split('T')[0];
  }
  
  // Si ya está en formato YYYY-MM-DD, devuélvela tal cual
  if (fechaString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return fechaString;
  }
  
  // Para cualquier otro formato, intenta convertir a YYYY-MM-DD
  const fecha = new Date(fechaString);
  if (isNaN(fecha.getTime())) return ''; // Devuelve cadena vacía si la fecha es inválida
  
  return fecha.toISOString().split('T')[0];
};

export const ModificarAprendiz = ({ onClose, expertData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  
  // Asegurarse de que el ID se capture correctamente
  const [formData, setFormData] = useState({
    id: expertData?.id || '',
    name: expertData?.name || "",
    lastName: expertData?.lastName || "",
    competitionName: expertData?.competitionName || "",
    formationCenter: expertData?.formationCenter || "Centro de Diseño e Innovación Tecnológica Industrial",
    rol: expertData?.rol || "",
    birthdate: formatearFechaParaInput(expertData?.birthdate) || "",
    documentType: expertData?.documentType || "Cédula de ciudadanía",
    documentNumber: expertData?.documentNumber || "",
    email: expertData?.email || "",
    phone: expertData?.phone || "",
    programName: expertData?.programName || "Análisis y desarrollo de software",
    indexCourse: expertData?.indexCourse || "",
    strategyCompetition: expertData?.strategyCompetition || "",
  });

  const dataToSend = {
    id: formData.id,
    rol: formData.rol,
    name: formData.name,
    lastName: formData.lastName,
    documentType: formData.documentType,
    documentNumber: formData.documentNumber,
    documentDateOfissue: formData.documentDateOfissue,
    email: formData.email,
    birthdate: formData.birthdate,
    phone: formData.phone,
    programName: formData.programName,
    indexCourse: formData.indexCourse,
    formationCenter: formData.formationCenter,
    competitionName: formData.competitionName,
    strategyCompetition: formData.strategyCompetition
  };

  // Actualizar useEffect para manejar mejor el ID
  useEffect(() => {
    if (expertData) {
        setFormData(prev => ({
            ...prev,
            ...expertData,
            birthdate: formatearFechaParaInput(expertData.birthdate)
        }));
    }
  }, [expertData]);

  const [errors, setErrors] = useState({
    name: "",
    lastName: "",
    rol: "",
    birthdate: "",
    documentNumber: "",
    email: "",
    phone: "",
    competitionName: "",
    strategyCompetition: "",
    programName: "",
  });

  // Función de validación adaptada del primer código
  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          errorMessage = "El nombre es obligatorio";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = "El nombre solo debe contener letras";
        }
        break;
      case "lastName":
        if (!value.trim()) {
          errorMessage = "El apellido es obligatorio";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = "El apellido solo debe contener letras";
        }
        break;
      case "rol":
        if (!value.trim()) {
          errorMessage = "El rol es obligatorio";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = "El rol solo debe contener letras";
        }
        break;
      case "birthdate":
        if (!value) {
          errorMessage = "La fecha de nacimiento es obligatoria";
        } else {
          const today = new Date();
          const birthDate = new Date(value);
          if (birthDate >= today) {
            errorMessage = "La fecha debe ser en el pasado";
          }
          // Verificar edad mínima (18 años)
          const age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            if (age - 1 < 18) {
              errorMessage = "Debe tener al menos 18 años";
            }
          } else if (age < 18) {
            errorMessage = "Debe tener al menos 18 años";
          }
        }
        break;
      case "documentNumber":
        if (!value.trim()) {
          errorMessage = "El número de documento es obligatorio";
        } else if (!/^\d+$/.test(value)) {
          errorMessage = "El documento debe contener solo números";
        } else if (value.length < 8 || value.length > 12) {
          errorMessage = "El documento debe tener entre 8 y 12 dígitos";
        }
        break;
      case "email":
        if (!value.trim()) {
          errorMessage = "El correo electrónico es obligatorio";
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errorMessage = "Correo electrónico inválido";
          }
        }
        break;
      case "phone":
        if (!value.trim()) {
          errorMessage = "El número de teléfono es obligatorio";
        } else if (!/^\d+$/.test(value)) {
          errorMessage = "El teléfono debe contener solo números";
        } else if (value.length < 7 || value.length > 10) {
          errorMessage = "El teléfono debe tener entre 7 y 10 dígitos";
        }
        break;
      case "competitionName":
        if (!value.trim()) {
          errorMessage = "La habilidad es obligatoria";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = "La habilidad solo debe contener letras";
        }
        break;
      case "strategyCompetition":
        if (!value.trim()) {
          errorMessage = "La competencia es obligatoria";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = "La competencia solo debe contener letras";
        }
        break;
      case "programName":
        if (!value.trim()) {
          errorMessage = "El programa es obligatorio";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          errorMessage = "El programa solo debe contener letras";
        }
        break;
      default:
        break;
    }

    return errorMessage;
  };

  // HandleChange adaptado del primer código con validación en tiempo real
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    setHasChanges(true);

    // Validación en tiempo real
    const errorMessage = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  // Función de validación completa adaptada del primer código
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validar todos los campos
    Object.keys(formData).forEach(field => {
      if (field !== 'id' && field !== 'documentType' && field !== 'formationCenter' && 
          field !== 'programName' && field !== 'indexCourse') {
        const errorMessage = validateField(field, formData[field]);
        if (errorMessage) {
          newErrors[field] = errorMessage;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar el formulario antes de enviar
    if (!validateForm()) {
      message.error("Corrija los errores del formulario");
      return;
    }

    if (!formData.id) {
      message.error('ID no encontrado');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const response = await fetch(`${url}/api/clientes/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al modificar el experto');
      }

      const responseData = await response.json();
      if (responseData) {
        setSuccessMessage("Aspirante modificado exitosamente");
        onClose(true, formData); // Indica que hubo cambios
      }
    } catch (error) {
      console.error('Error al modificar:', error);
      setError(error.message || 'Hubo un error al modificar el aspirante');
    } finally {
      setIsLoading(false);
    }
  };

  // RenderSelect adaptado con el estilo del primer código
  const renderSelect = ({ label, name, options }) => (
    <div className="input-group" style={{ position: 'relative' }}>
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="form-select"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && <div className="error-message">{errors[name]}</div>}
    </div>
  );

  // RenderInput adaptado con el estilo del primer código (label flotante)
  const renderInput = ({ type = "text", name, placeholder }) => (
    <div className="input-container" style={{ position: 'relative' }}>
      <input
        type={type}
        name={name}
        placeholder=" "
        value={formData[name]}
        onChange={handleChange}
        className={`form-input ${errors[name] ? 'input-error' : ''}`}
        readOnly={false}
      />
      <span>{placeholder}</span>
      {errors[name] && <div className="error-message">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="create-expert-container">
      <button 
        type="button" 
        onClick={() => onClose(false, null)} 
        className="submit-button-expert"
      >
        <GoChevronLeft />Volver atrás
      </button>

      <div className="titulo_create">
        <h1>Modificar Aspirante: {formData.name} {formData.lastName}</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="formulario_experto">
        {error && <div className="error-general">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <input 
          type="hidden" 
          name="id" 
          value={formData.id} 
        />

        {renderInput({ name: "name", placeholder: "Nombre" })}
        {renderInput({ name: "lastName", placeholder: "Apellido" })}
        {renderInput({ name: "rol", placeholder: "Rol" })}
        {renderInput({ 
          type: "date", 
          name: "birthdate", 
          placeholder: "Fecha de nacimiento" 
        })}
        
        {renderSelect({
          label: "Tipo de documento",
          name: "documentType",
          options: TIPOS_DOCUMENTO
        })}
        
        {renderInput({ 
          name: "documentNumber", 
          placeholder: "Número de documento" 
        })}
        {renderInput({ 
          name: "email", 
          placeholder: "Correo electrónico",
          type: "email"
        })}
        {renderInput({ 
          name: "phone", 
          placeholder: "Número de teléfono" 
        })}
        
        {renderSelect({
          label: "Centro de formación",
          name: "formationCenter",
          options: CENTROS_FORMACION
        })}
        
        {renderSelect({
          label: "Programa de formación",
          name: "programName",
          options: PROGRAMAS_FORMACION
        })}
        
        {renderInput({ 
          name: "strategyCompetition", 
          placeholder: "Competencia" 
        })}
        {renderInput({ 
          name: "competitionName", 
          placeholder: "Habilidad" 
        })}

        <div className="button-container">
          <button 
            type="submit" 
            className="submit-button-guardar"
            disabled={isLoading}
          >
            <PiPencilSimpleLineFill /> 
            {isLoading ? "Modificando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};