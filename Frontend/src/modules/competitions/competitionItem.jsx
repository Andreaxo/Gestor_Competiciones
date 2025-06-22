import React, { useState, useEffect } from "react";
import { CiEdit } from "react-icons/ci";
import getImgFile from "../../funtions/img/getImgByFileName";

function CompetitionItem({ competition, onClick, onEdit }) {
  const [imgStyle, setImgStyle] = useState({ backgroundColor: "white" });
  const [isCompetitor, setIsCompetitor] = useState(false);

  // Cargar imagen del archivo
  useEffect(() => {
    const fetchImg = async () => {
      const imageFile = await getImgFile(competition.image);
      if (imageFile) {
        setImgStyle({
          backgroundImage: `url(${imageFile})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        });
      }
    };
    fetchImg();
  }, [competition.image]);

  // Verificar si el usuario es competidor
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setIsCompetitor(role?.toLowerCase() === "competidor");
  }, []);

  return (
    <div className="competitions__box-item" style={imgStyle} onClick={onClick}>
      <div>
        <p className="competitions__box-name">{competition.name}</p>
      </div>

      {/* Mostrar el botón solo si NO es competidor */}
      {!isCompetitor && (
        <button onClick={onEdit} className="competitions__box-edit">
          <CiEdit className="competitions__box-edit-icon" />
          <p className="competitions__box-edit-title">Modificar</p>
        </button>
      )}
    </div>
  );
}

export default CompetitionItem;
