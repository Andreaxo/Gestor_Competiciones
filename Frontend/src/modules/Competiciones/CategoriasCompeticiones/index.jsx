import Header from '../../Header';
import './index.css';
import figure2 from '../../img/figure2.png';
import figure3 from '../../img/img-category.jpg';
import PublicShowCompetitions from '../../publicCompeAndSkills/publicShowCompetitions';

function SliderCompeticiones() {
  const seleccione = "> Selecciona una categoría";
  return (
    <>
      <div id="slidercompeticiones">
      </div>
      <div className="slidercompeticiones-container">
        
      </div>
      <img src={figure2} alt="decoration 3" className='decoration3 decoration' />
      <div>
        <div className="slidercompeticiones-skills">

          {<PublicShowCompetitions/>}


        </div>

      </div>
   
    </>
  );
}

export default SliderCompeticiones;
