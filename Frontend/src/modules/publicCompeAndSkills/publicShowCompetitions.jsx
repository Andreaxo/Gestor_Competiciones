import React, { useState, useEffect } from "react";
import useCompetitionssData from "../../funtions/competitions/getCompetitions";
import PublicCompetitionItem from "./publicCompetitionItem";
import "./showCompetitions.css";
import PublicCompetitionDetail from "./publicCompeDetail";


function PublicShowCompetitions() {
  const competitions = useCompetitionssData();
  const [isModalDetailOpen, setIsModalDetailOpen] = useState(false);

  const navigateToSkill = (id) => {
    localStorage.setItem("selectedCompetitionId", id);
    setIsModalDetailOpen(true);
  };



  return (

    <div className="publicCompetitions__box">


      <div className="publicCompetitions__box-general">

        {isModalDetailOpen && <PublicCompetitionDetail onClose={() => setIsModalDetailOpen(false)} />}


        <div className="publicCompetitions__box-list">
          {competitions.map((competition) => (
            <PublicCompetitionItem
              key={competition.id}
              competition={competition}
              className="publicCompetitions__box-item"
              onClick={() => navigateToSkill(competition.id)}
            />
          ))}


        </div>
      </div>
    </div>
  );
}

export default PublicShowCompetitions;
