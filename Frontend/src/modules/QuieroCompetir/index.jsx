import React, { useState } from "react";
import "./index.css";
import { message } from "antd";
import figure1 from "../img/figure2.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { url } from "../../config";

function QuieroCompetir() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    lastname: "",
    phone: "",
    documentType: "",
    documentNumber: "",
    email: "",
    birthday: "",
    indexCourse: "",
    programName: "",
    formationCenter: "",
    competition: "",
    skill: "",
  });
  const [competitions, setCompetitions] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "competition") {
      // Encontrar el nombre de la competición seleccionada
      const selectedCompetition = competitions.find(c => c.idCompetitions === parseInt(value));
      setFormData({
        ...formData,
        [name]: selectedCompetition ? selectedCompetition.competitionName : value,
        skill: "" // Limpiar skill cuando cambia la competición
      });
    } else if (name === "skill") {
      // Encontrar el nombre de la habilidad seleccionada
      const selectedSkill = skillsList.find(s => s.idSkills === parseInt(value));
      setFormData({
        ...formData,
        [name]: selectedSkill ? selectedSkill.skillName : value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${url}/api/formulario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      message.success("Formulario enviado exitosamente");
    } catch (error) {
      console.error("Ha habido un error: ", error);
      message.error("Ha habido un error, intentalo de nuevo");
    }
  };

  // Carga todas las competiciones al montar
  useEffect(() => {
    fetch(`${url}/competitions`)
      .then((r) => r.json())
      .then((data) => {
        console.log("Respuesta de competiciones:", data);
        
        // Verificar si la respuesta tiene la estructura success/data
        if (data.success && data.data) {
          setCompetitions(data.data);
        } else if (Array.isArray(data)) {
          setCompetitions(data);
        } else {
          console.error("Estructura de respuesta inesperada para competiciones:", data);
          setCompetitions([]);
        }
      })
      .catch((error) => {
        console.error("Error al cargar competiciones:", error);
        setCompetitions([]);
      });
  }, []);

  // Cuando cambias la competencia, recarga sus habilidades
  useEffect(() => {
    if (!formData.competition) {
      setSkillsList([]);
      return;
    }
    
    // Necesitas encontrar el ID de la competición por su nombre para cargar las habilidades
    const selectedCompetition = competitions.find(c => c.competitionName === formData.competition);
    
    if (selectedCompetition) {
      console.log("Cargando habilidades para competición:", selectedCompetition.idCompetitions);
      
      fetch(`${url}/skills/${selectedCompetition.idCompetitions}`)
        .then((r) => r.json())
        .then((data) => {
          console.log("Respuesta de habilidades:", data);
          
          // Verificar si la respuesta tiene la estructura success/data
          if (data.success && data.data) {
            setSkillsList(data.data);
          } else if (Array.isArray(data)) {
            setSkillsList(data);
          } else {
            console.error("Estructura de respuesta inesperada para habilidades:", data);
            setSkillsList([]);
          }
        })
        .catch((error) => {
          console.error("Error al cargar habilidades:", error);
          setSkillsList([]);
        });
    }
  }, [formData.competition, competitions]);

  return (
    <div className="formulario__container">
      <img
        src={figure1}
        className="formulario__container--figure1"
        alt="imagen decorativa"
      />
      <img
        src={figure1}
        className="formulario__container--figure2"
        alt="imagen decorativa"
      />
      <div className="formulario__container--formulario">
        <a onClick={() => navigate("/")} id="login__backhome">
          &lt; Volver al Home
        </a>
        <h1>Envía tu solicitud</h1>
        <form onSubmit={handleSubmit}>
          <div className="formulario__division1 formulario__division">
            <div className="formulario__container--labelsubcontainer standard-input-container">
              <div className="formulario__division3 formulario__division">
                <div className="formulario__container--labelsubcontainer">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="formulario__container-userinput standard-input"
                  />
                </div>
                <div className="formulario__container--labelsubcontainer">
                  <label>Apellido *</label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="formulario__container-userinput standard-input"
                  />
                </div>
              </div>
            </div>
            <div className="formulario__division3 formulario__division">
              <div className="formulario__container--labelsubcontainer">
                <label>Tipo de documento *</label>
                <select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                  className="formulario__container-passwordinput"
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="TI">Tarjeta de Identidad</option>
                </select>
              </div>
              <div className="formulario__container--labelsubcontainer">
                <label>Número de documento *</label>
                <input
                  type="text"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  className="formulario__container-passwordinput"
                  required
                />
              </div>
            </div>
            <div className="formulario__division3 formulario__division">
              <div className="formulario__container--labelsubcontainer">
                <label>Fecha de nacimiento *</label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                  className="formulario__container-passwordinput"
                  required
                />
              </div>
              <div className="formulario__container--labelsubcontainer">
                <label>N° de Ficha *</label>
                <input
                  type="number"
                  name="indexCourse"
                  value={formData.indexCourse}
                  onChange={handleChange}
                  className="formulario__container-passwordinput"
                  required
                />
              </div>
            </div>
            <div className="formulario__container--labelsubcontainer standard-input-container">
              <label>Programa de formación *</label>
              <input
                type="text"
                name="programName"
                value={formData.programName}
                onChange={handleChange}
                className="formulario__container-userinput standard-input"
                required
              />
            </div>
            <div className="formulario__container--labelsubcontainer standard-input-container">
              <label>Centro de formación *</label>
              <input
                type="text"
                name="formationCenter"
                value={formData.formationCenter}
                onChange={handleChange}
                className="formulario__container-passwordinput"
                required
              />
            </div>
            <div className="formulario__division3 formulario__division">
              <div className="formulario__container--labelsubcontainer">
                <label>Competición *</label>
                <select
                  className="formulario__container-passwordinput"
                  name="competition"
                  value={competitions.find(c => c.competitionName === formData.competition)?.idCompetitions || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione</option>
                  {competitions.map((c) => (
                    <option key={c.idCompetitions} value={c.idCompetitions}>
                      {c.competitionName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="formulario__container--labelsubcontainer">
                <label>Habilidad *</label>
                <select
                  className="formulario__container-userinput standard-input"
                  name="skill"
                  value={skillsList.find(s => s.skillName === formData.skill)?.idSkills || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione</option>
                  {skillsList.map((s) => (
                    <option key={s.idSkills} value={s.idSkills}>
                      {s.skillName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="formulario_division2 formulario__division">
            <div className="formulario__container--labelsubcontainer">
              <label>Número de teléfono *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="formulario__container-userinput standard-input"
                required
              />
            </div>
            <div className="formulario__container--labelsubcontainer">
              <label>Correo electrónico *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="formulario__container-passwordinput"
                required
              />
            </div>
          </div>
          <button className="formulario__container-submit btn1" type="submit">
            Enviar solicitud
          </button>
          <h2 className="formulario__disclaimer">
            Cada aprendiz solo puede enviar una solicitud por competencia
          </h2>
        </form>
      </div>
      <div className="banner__perspective--text-3">
        <h1 id="banner__container--title-3">
          Impulsa
          <br />
          tu talento
        </h1>
      </div>
    </div>
  );
}

export default QuieroCompetir;