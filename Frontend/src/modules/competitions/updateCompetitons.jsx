import React, { useState, useEffect } from "react";
import useCompetitionssDataById from "../../funtions/competitions/getCompetitionById";
import updateCompetition from "../../funtions/competitions/updateCompetitions";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import DeleteCompetitions from "./deleteCompetitions";
import noImage from "../../../public/icons/noImg.png"
import './update.css';
import getImgFile from "../../funtions/img/getImgByFileName";
import { url } from "../../config";
import { message } from "antd";

const UpdateCompetitions = ({ onClose }) => {
  /* //////////Variables necesarias y formatos/////////// */
  const id = localStorage.getItem("selectedUpdateCompetitionId");
  const competitionsData = useCompetitionssDataById(id);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().slice(0, 10);
  };

  /*  /////////////////////////////////////// */

  /* //Formulario con los datos //////// */
  const [formData, setFormData] = useState({
    competitionName: '',
    competitionDate: '',
    place: '',
    descripcion: '',
    competitorsAge: '',
    image: ''
  });
  /* ////////////////////////////////////// */

// Actualiza el selectedCompetition cuando cambie competitionsData
useEffect(() => {
  if (competitionsData && competitionsData.length > 0) {
    setSelectedCompetition(competitionsData[0]);
  }
}, [competitionsData]);

// Obtiene la imagen cuando selectedCompetition cambie y tenga image
useEffect(() => {
  const fetchImg = async () => {
    if (selectedCompetition && selectedCompetition.image) {
      try {
        const imageFile = await getImgFile(selectedCompetition.image);
        setImage(imageFile);
      } catch (error) {
        console.error("Error obteniendo la imagen:", error);
      }
    } else {
      setImage(noImage); // Imagen por defecto si no hay imagen
    }
  };
  fetchImg();
}, [selectedCompetition]);


  useEffect(() => {
    const ejemplo = () => {
    }
    ejemplo();

    if (selectedCompetition) {
      setFormData({
        competitionName: selectedCompetition.name || "",
        competitionDate: formatDate(selectedCompetition.date) || "",
        place: selectedCompetition.place || "",
        descripcion: selectedCompetition.description || "",
        competitorsAge: selectedCompetition.age || "",
        image: selectedCompetition.image
      });
    }

  }, [selectedCompetition]);

  /*   //////////////////// */
  /* //////////////////////////////////////////////////////////////////////////// */

  /* Captura los nuevos cambios y los introduce en el formata */
  function handleInputChange(event) {
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
      [name]: value,
    });
  }
  /* //////////////////////////////////////////////////////// */

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

  /* //Enviar los datos con el boton al back/////////// */
const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("competitionName", formData.competitionName);
    formDataToSend.append("competitionDate", formData.competitionDate);
    formDataToSend.append("place", formData.place);
    formDataToSend.append("description", formData.descripcion);
    formDataToSend.append("competitorsAge", formData.competitorsAge);

    // Solo enviar imagen si es un archivo nuevo (tipo File)
    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    }

    const token = localStorage.getItem("token");
    const response = await fetch(`${url}/competitions/update/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataToSend,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    message.success("Competencia modificada exitosamente");
    window.location.reload();
  } catch (error) {
    message.error("Hubo un error al modificar la competencia");
    console.error("Error al modificar la competencia:", error);
  }
};

  /* ///////////////////////////////////////////////////////// */

  /* Manejador de la imagen    */
  const [image, setImage] = useState(noImage);

  const handleImageChange = (e) => {
  const file = e.target.files[0];

  // Si no se seleccionó archivo, no modificar formData.image
  if (!file) return;

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

  // Actualizar formData.image solo si hay un archivo válido
  setFormData((prevData) => ({
    ...prevData,
    image: file
  }));

  // Mostrar preview de la nueva imagen
  const reader = new FileReader();
  reader.onloadend = () => {
    setImage(reader.result);
  };
  reader.readAsDataURL(file);
};




  /* Imagen */
  /* /////////////////////////////////////////////// */

  return (
    <div>
      {isModalDeleteOpen && (
        <DeleteCompetitions onClose={() => setIsModalDeleteOpen(false)} />
      )}

      <div className="create__flotant__window">
        <h2>Modificar competencia</h2>
        
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
          <img className="img__style" src={image} alt="Imagen de la competencia" />
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
          <button onClick={handleSubmit}>
            <CiEdit className="competitions__box-edit-icon-popup" />
            Guardar
          </button>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={() => setIsModalDeleteOpen(true)}>
            <MdDeleteForever className="competitions__box-edit-delete-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCompetitions;
