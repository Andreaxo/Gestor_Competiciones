import React, { useState, useEffect } from "react";
import getImgFile from "../../funtions/img/getImgByFileName";
import "./showCompetitions.css";
import PublicCompetitionDetail from "./publicCompeDetail";

function PublicCompetitionItem({ competition, onClick }) {
const [imgUrl, setImgUrl] = useState(null);

 const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);

useEffect(() => {
  const fetchImg = async () => {
    const imageFile = await getImgFile(competition.image);
    setImgUrl(imageFile);
  };

  fetchImg();
}, [competition.image]);

  const navigateToSkill = (id) => {
    localStorage.setItem("selectedCompetitionId", id);
    setIsModalDetailOpen(true);
  };

  return (

    <div className="publicCompetitions__box-item" onClick={() => navigateToSkill(competition.id)}>
      <div className="publicCompetitions__box-img">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={competition.name}
            className="publicCompetitions__img"
            onClick={onClick}
          />
        ) : (
          <div
            style={{
              backgroundColor: "#e9e9e9",
              height: "200px",
              borderRadius: "1rem",
            }}
            onClick={onClick}
          />
        )}
      </div>

      <p className="publicCompetitions__box-name" onClick={() => navigateToSkill(competition.id)} >{competition.name}</p>

      <div className="publicCompetitions__box-description">
        <p onClick={() => navigateToSkill(competition.id)}>{competition.description}</p>
      </div>

      <p className="publicCompetitions__box-button" href=""  >Descubre mas</p>

{isModalDetailOpen && <PublicCompetitionDetail onClose={() => setIsModalDetailOpen(false)} />}
    </div>



  );
}

export default PublicCompetitionItem;
