// src/modules/Recovery/index.jsx

import "./index.css";
import worldSkillsInternacional from "../img/discovermore-slider-1.jpg";
import figure1 from "../img/figure2.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { url } from "../../config";

function Recovery() {
  const navigate = useNavigate();

  // Estado inicial con email, nueva contraseña y confirmación
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Para manejar cambios en cualquier input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Envío del formulario de recuperación
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validamos que ambas contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      console.warn("Las contraseñas no coinciden");
      return;
    }

    try {
      // Llamamos al endpoint de recuperación (ajusta la ruta si en el backend usas otra)
      const response = await fetch(`${url}/api/login/recovery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          newPassword: formData.password,
        }),
      });

      // Si no es 2xx, consideramos error
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      // Aquí puedes redirigir o mostrar mensaje de éxito
      // Por ejemplo, redirigir al login:
      navigate("/Login");
    } catch (error) {
      console.error("Error al recuperar contraseña:", error);
    }
  };

  const backHome = "< Volver al Home";

  return (
    <div className="container-recovery">
      <div className="recovery__container">
        <img
          src={figure1}
          className="recovery__container--figure1"
          alt="imagen de figura decorativa"
        />
        <img
          src={figure1}
          className="recovery__container--figure2"
          alt="imagen de figura decorativa"
        />
        <div className="recovery__container--recovery">
          <a onClick={() => navigate("/")} id="recovery__backhome">
            {backHome}
          </a>
          <h1 className="recovery__h1">Recuperar Contraseña</h1>
          <form className="recovery__form" onSubmit={handleSubmit}>
            {/* Campo email */}
            <div className="recovery__container--labelsubcontainer standard-input-container">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="recovery__container-userinput standard-input"
                required
              />
            </div>

            {/* Campo nueva contraseña */}
            <div className="recovery__container--labelsubcontainer">
              <label htmlFor="password">Nueva contraseña</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="recovery__container-passwordinput"
                required
              />
            </div>

            {/* Campo confirmar contraseña */}
            <div className="recovery__container--labelsubcontainer">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="recovery__container-passwordinput"
                required
              />
            </div>
            {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="error-message">Las contraseñas no coinciden</p>
            )}
            <button
              className="recovery__container-submit btn1"
              type="submit"
            >
              Restablecer contraseña
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Recovery;
