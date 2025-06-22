import React, { useState, useEffect } from "react";
import getImgFile from "../../funtions/img/getImgByFileName";
import useCompetitionssDataById from "../../funtions/competitions/getCompetitionById";
import './publicDetails.css';
import PublicShowSkills from "./publicShowSkills";

function PublicCompetitionDetail({ onClose }) {
  const [imgStyle, setImgStyle] = useState({ backgroundColor: "white" });
  const id = localStorage.getItem("selectedCompetitionId")
  const competitions = useCompetitionssDataById(id);

  useEffect(() => {
    const fetchImg = async () => {
      if (competitions.length > 0 && competitions[0]?.image) {
        const imageFile = await getImgFile(competitions[0].image);
        setImgStyle({
          backgroundImage: imageFile ? `url(${imageFile})` : "none",
          backgroundColor: imageFile ? "transparent" : "gray",
          borderRadius: "1rem",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        });
      }
    };

    fetchImg();
  }, [competitions]);

  return (
    <div>


      <div className="publicCompetitionsDetails__box">


        {/* {competitions.map((competition) => (
          <div key={competition.id} className="publicCompetitionsDetails__box-content" onClick={() => navigateToSkillById(skill.id)}>
            <a href="" onClick={onClose}>{"<"} Volver atrasssss</a>
            <div className="publicCompetitionsDetails__box-image" style={imgStyle}> </div>
            <div>
              <h3>
                {competition.name}
              </h3>
              <p>{competition.description}</p>
              <p>{competition.age}</p>
            </div>


            <div className="skills__box-item-info" >

            </div>

          </div>
        ))} */}
        <PublicShowSkills  />
      </div>









    </div>
  );
}

export default PublicCompetitionDetail;