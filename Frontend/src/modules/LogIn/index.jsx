// src/modules/LogIn/index.jsx

import "./index.css";
import worldSkillsInternacional from "../img/discovermore-slider-1.jpg";
import figure1 from "../img/figure2.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { url } from "../../config";

function LogIn() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${url}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await response.text();

      if (!response.ok) {
        setError("El usuario o la contraseña no son correctos");
        throw new Error(`Error en login: ${response.status}`);
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw err;
      }


      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/competencias");
      } else {
        console.warn("⚠️ El servidor respondió OK pero NO vino 'token' en data:", data);
      }
    } catch (error) {
      console.error("🚨 Error en fetch o en manejo de login:", error);
    }
  };

  const backHome = "< Volver al Home";
  return (
    <div className="container-login">
      <div className="login__container">
        <img
          src={figure1}
          className="login__container--figure1"
          alt="imagen decorativa"
        />
        <img
          src={figure1}
          className="login__container--figure2"
          alt="imagen decorativa"
        />
        <div className="login__container--login">
          <a onClick={() => navigate("/")} id="login__backhome">
            {backHome}
          </a>
          <h1 className="login__h1">Ingresar al Sistema</h1>
          <form className="login__form" onSubmit={handleSubmit}>
            <div className="login__container--labelsubcontainer standard-input-container">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="login__container-userinput standard-input"
              />
            </div>
            <div className="login__container--labelsubcontainer">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="login__container-passwordinput"
              />
            </div>
            {error && (
              <p
                style={{
                  color: "red",
                  marginTop: "0.5rem",
                  fontSize: "0.9rem",
                }}
              >
                {error}
              </p>
            )}
            <button
              className="login__container-submit btn1"
              type="submit"
            >
              Ingresar
            </button>
          </form>
        </div>
        <div className="login__container--img">
          <img
            src={worldSkillsInternacional}
            alt="Imagen referencial"
          />
        </div>
      </div>
    </div>
  );
}

export default LogIn;
