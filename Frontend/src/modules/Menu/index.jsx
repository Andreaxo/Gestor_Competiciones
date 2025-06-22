import "./index.css";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { FaPerson } from "react-icons/fa6";
import { FaTrophy } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { IoDocumentSharp } from "react-icons/io5";
import { BsCalendar2EventFill } from "react-icons/bs";
import { GrUserExpert } from "react-icons/gr";
import { IoIosArrowDown } from "react-icons/io";
// import logoCompetencia from "../img/logo-worldskills.png"; // Comentado porque ahora se carga dinámicamente
import ShowCompetitionsDocuments from "../documents/showCompetitionsDocument";
import { Eventos } from "../../components/eventos/Eventos";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DocumentosPopUp from "../DocumentosPopUp";
import { ListadoCompetidor } from "../../components/competidores/ListadoCompetidor";
import { ListadoAprendiz } from "../../components/aprendiz/ListadoAprendiz";
import { ListadoExpertos } from "../../components/expertos/ListadoExpertos";
import PerfilUsuario from "../../components/perfil_usuario/PerfilUsuario";
import ShowSkills from "../skills/showSkills";
import { ListadoInscritos } from "../../components/inscritos/ListadoInscritos";
import { LuMenu } from "react-icons/lu";
import { IoIosClose } from "react-icons/io";
import { FaCircleUser } from "react-icons/fa6";
import logoSena from "../../../public/icons/senaLogo.png";
import { FaRegUser } from "react-icons/fa";
import { FaBackward } from "react-icons/fa";
import getImgFile from "../../funtions/img/getImgByFileName"; // Importa tu función getImgFile

function Menu() {
  let classButton;
  const [menu, setMenu] = useState("");
  const [activeButton, setActiveButton] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenBurger, setIsOpenBurger] = useState(false);
  const [isOpenPopUp, setIsOpenPopUp] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Documentos");
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const imageName = localStorage.getItem("selectedUpdateCompetitionId");
  // Estados para la imagen dinámica
  const [logoCompetencia, setLogoCompetencia] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const navigate = useNavigate();
  const nameCompetition = localStorage.getItem("selectedCompetitionName");

  useEffect(() => {
    const fetchImg = async () => {
      try {
        const image = await getImgFile(imageName);
        setLogoCompetencia(image); // ✅ Correcto
      } catch (error) {
        console.error("Error cargando la imagen:", error);
        setImageError(true);
      }
    };
    if (imageName) fetchImg();
  }, [imageName]);

  // Función para obtener el token JWT del localStorage
  const getToken = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    return token;
  };

  // Función para decodificar el JWT y obtener información básica
  const decodeJWT = (token) => {

    try {
      if (!token) {
        return null;
      }

      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

      // Agregar padding si es necesario
      const paddedBase64 = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

      const jsonPayload = decodeURIComponent(
        atob(paddedBase64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const decoded = JSON.parse(jsonPayload);

      // Verificar si el token ha expirado
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        console.warn("⚠️ Token JWT ha expirado");
        return null;
      }

      return decoded;
    } catch (error) {
      console.error("💥 Error decodificando JWT:", error);
      return null;
    }
  };

  // Función para obtener el ID del usuario desde diferentes campos posibles del token
  const getUserIdFromToken = (decodedToken) => {

    if (!decodedToken) {
      return null;
    }



    // Buscar el ID en diferentes campos comunes
    const possibleIdFields = [
      "id",
      "userId",
      "user_id",
      "sub",
      "uid",
      "clienteId",
      "cliente_id",
    ];

    for (const field of possibleIdFields) {
      if (decodedToken[field]) {

        return decodedToken[field];
      }
    }

    return null;
  };

  // Función para obtener el rol del usuario desde diferentes campos posibles del token
  const getUserRoleFromToken = (decodedToken) => {

    if (!decodedToken) {
      return null;
    }

    // Buscar el rol en diferentes campos comunes
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
      if (decodedToken[field]) {

        return decodedToken[field];
      }
    }

    return null;
  };

  // Función para obtener el ID del usuario desde localStorage
  const getUserIdFromStorage = () => {
    return localStorage.getItem("idUsuario");
  };

  // Función para limpiar los datos del usuario del localStorage
  const clearUserDataFromStorage = () => {
    localStorage.removeItem("idUsuario");
    localStorage.removeItem("userRole");
  };

  // Función principal para extraer el ID y rol del token
  const extractUserDataFromToken = () => {

    const token = getToken();
    if (!token) return { userId: null, userRole: null };

    const decodedToken = decodeJWT(token);
    if (!decodedToken) return { userId: null, userRole: null };

    const extractedUserId = getUserIdFromToken(decodedToken);
    const extractedUserRole = getUserRoleFromToken(decodedToken);

    // Guardar el ID del usuario en localStorage
    if (extractedUserId) {
      localStorage.setItem("idUsuario", extractedUserId);

    }

    // Guardar el rol del usuario en localStorage
    if (extractedUserRole) {
      localStorage.setItem("userRole", extractedUserRole);

    }

    setUserId(extractedUserId);
    setUserRole(extractedUserRole);

    return { userId: extractedUserId, userRole: extractedUserRole };
  };

  // Función para cargar la imagen de la competencia
  const loadCompetitionLogo = async () => {
    try {
      setImageLoading(true);
      setImageError(false);

      // Define el nombre del archivo que quieres obtener
      const fileName = "logo-worldskills.png"; // Cambia este nombre según tu necesidad

      const imageUrl = await getImgFile(fileName);
      setLogoCompetencia(imageUrl);
    } catch (error) {
      console.error("Error cargando la imagen de la competencia:", error);
      setImageError(true);
    } finally {
      setImageLoading(false);
    }
  };

  // useEffect para extraer datos cuando el componente se monta
  useEffect(() => {

    // Primero intentar cargar desde localStorage
    const storedUserId = getUserIdFromStorage();
    const storedUserRole = localStorage.getItem("userRole");

    if (storedUserId && storedUserRole) {

      setUserId(storedUserId);
      setUserRole(storedUserRole);
    } else {
      // Si no hay datos en localStorage, extraer del token
      const { userId: extractedId, userRole: extractedRole } =
        extractUserDataFromToken();

      if (extractedId && extractedRole) {

      }
    }

    // Cargar la imagen de la competencia
    loadCompetitionLogo();

    // Cleanup function para liberar la URL del objeto cuando el componente se desmonte
    return () => {
      if (logoCompetencia) {
        URL.revokeObjectURL(logoCompetencia);
      }
    };
  }, []);

  const handleMenu = (e, button) => {
    setMenu(e);
    setActiveButton(button);

  };

  const toggleDropdown = () => setIsOpen(!isOpen);
  const popUp = () => setIsOpenPopUp(!isOpenPopUp);

  const handleSelectOption = (value) => {
    setSelectedOption(value);
    setIsOpen(false);
  };

  // Función mejorada para cerrar sesión con navegación
  function signOut() {
    navigate("/competencias");
  }

  // Función para determinar qué botones mostrar según el rol
  const shouldShowButton = (buttonName) => {
    if (!userRole) return true; // Si no hay rol, mostrar todo por defecto

    // Si el rol es "competidor", solo mostrar Habilidades y Cerrar Sesión
    if (userRole.toLowerCase() === "competidor") {
      return (
        buttonName === "Habilidades" ||
        buttonName === "CerrarSesion" ||
        buttonName === "PerfilUsuario"
      );
    }

    // Para cualquier otro rol, mostrar todos los botones
    return true;
  };

  // Función para mostrar información del usuario actual
  const showCurrentUser = () => {

    console.log(
      "Botones visibles:",
      userRole?.toLowerCase() === "competidor" ? "Solo Habilidades" : "Todos"
    );
  };

  return (
    <>
      <div id="menu__body--container">
        <div className="menu__nav-responsive">
          <button
            className={`burger_menu ${isOpenBurger ? `closed` : ""}`}
            onClick={() => setIsOpenBurger(true)}
          >
            <LuMenu />
          </button>
          <img src={logoSena} className="logoSena" alt="#" />
        </div>

        <div id="product__container">
          <div
            id="menu__container"
            className={`${isOpenBurger ? `visible` : ""}`}
          >
            <h1>{nameCompetition}</h1>
            <div className="menu__container--menu">
              <button
                className="burger_menu-close"
                onClick={() => setIsOpenBurger(false)}
              >
                <IoIosClose />
              </button>

              {/* Mostrar información del rol en el menú */}
              <span>
                <FaRegUser />
              </span>
              {userRole && (
                <div className="userRoleIcon" style={{}}>
                  {userRole.toUpperCase()}
                </div>
              )}

              <button
                className={`container--menu--button ${
                  activeButton === "PerfilUsuario" ? "menu--button--active" : ""
                }`}
                onClick={() => handleMenu(<PerfilUsuario />, "PerfilUsuario")}
              >
                <span>
                  <FaCircleUser />
                </span>{" "}
                <span>Perfil de usuario</span>
              </button>

              {/* Botón Inscritos - Solo si no es competidor */}
              {shouldShowButton("Inscritos") && (
                <button
                  className={`container--menu--button ${
                    activeButton === "Inscritos" ? "menu--button--active" : ""
                  }`}
                  onClick={() => handleMenu(<ListadoInscritos />, "Inscritos")}
                >
                  <span>
                    <MdOutlineDocumentScanner />
                  </span>
                  <span>Inscritos</span>
                </button>
              )}

              {/* Botón Aspirantes - Solo si no es competidor */}
              {shouldShowButton("Aspirantes") && (
                <button
                  className={`container--menu--button ${
                    activeButton === "Aspirantes" ? "menu--button--active" : ""
                  }`}
                  onClick={() => handleMenu(<ListadoAprendiz />, "Aspirantes")}
                >
                  <span>
                    <FaPerson />
                  </span>
                  <span>Aspirantes</span>
                </button>
              )}

              {/* Botón Competidores - Solo si no es competidor */}
              {shouldShowButton("Competidores") && (
                <button
                  className={`container--menu--button ${
                    activeButton === "Competidores"
                      ? "menu--button--active"
                      : ""
                  }`}
                  onClick={() =>
                    handleMenu(<ListadoCompetidor />, "Competidores")
                  }
                >
                  <span>
                    <FaTrophy />
                  </span>
                  <span>Competidores</span>
                </button>
              )}

              {/* Botón Habilidades - Siempre visible */}
              {shouldShowButton("Habilidades") && (
                <button
                  className={`container--menu--button ${
                    activeButton === "Habilidades" ? "menu--button--active" : ""
                  }`}
                  onClick={() => handleMenu(<ShowSkills />, "Habilidades")}
                >
                  <span>
                    <FaStar />
                  </span>
                  <span>Habilidades</span>
                </button>
              )}

              {/* Botón Documentos - Solo si no es competidor */}
              {shouldShowButton("Documentos") && (
                <button
                  className={`container--menu--button ${
                    activeButton === "Documentos" ? "menu--button--active" : ""
                  }`}
                  onClick={() =>
                    handleMenu(<ShowCompetitionsDocuments />, "Documentos")
                  }
                >
                  <span>
                    <FaStar />
                  </span>
                  <span>Documentos {nameCompetition}</span>
                </button>
              )}

              {/* Botón Eventos - Solo si no es competidor */}
              {shouldShowButton("Eventos") && (
                <button
                  className={`container--menu--button ${
                    activeButton === "Eventos" ? "menu--button--active" : ""
                  }`}
                  onClick={() => handleMenu(<Eventos />, "Eventos")}
                >
                  <span>
                    <BsCalendar2EventFill />
                  </span>
                  <span>Eventos</span>
                </button>
              )}

              {/* Botón Expertos - Solo si no es competidor */}
              {shouldShowButton("Expertos") && (
                <button
                  className={`container--menu--button ${
                    activeButton === "Expertos" ? "menu--button--active" : ""
                  }`}
                  onClick={() => handleMenu(<ListadoExpertos />, "Expertos")}
                >
                  <span>
                    <GrUserExpert />
                  </span>
                  <span>Expertos</span>
                </button>
              )}

              {/* Botón de cerrar sesión - Siempre visible */}
              {shouldShowButton("CerrarSesion") && (
                <button className="container--menu--button" onClick={signOut}>
                  <span>
                    <FaBackward />
                  </span>
                  <span>Volver a competencias</span>
                </button>
              )}
            </div>

            {/* Renderizado condicional de la imagen del logo de competencia */}
            {imageLoading ? (
              <div
                className="logo-loading"
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#666",
                }}
              >
                Cargando logo...
              </div>
            ) : imageError ? (
              <div
                className="logo-error"
                style={{
                  textAlign: "center",
                  padding: "20px",
                  color: "#ff6b6b",
                }}
              >
                Error cargando logo
              </div>
            ) : logoCompetencia ? (
              <img
                src={logoCompetencia}
                className="logoCompetencia"
                alt="logo de la competencia"
              />
            ) : null}
          </div>

          <div
            id="menu__product--container"
            className={isOpenBurger ? `visibleMenu` : ""}
          >
            {menu}
          </div>
        </div>
      </div>
    </>
  );
}

export default Menu;
