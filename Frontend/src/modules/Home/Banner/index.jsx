import Header from '../../Header';
import './index.css';
import figure1 from '../../img/figure1.png';
import figure2 from '../../img/figure2.png';
import lightgreen from '../../img/green-light.png';

function Banner() {
  
    return (
  <>
    <div id="banner__container-home">
        <Header />
        <div className='banner__perspective--text-home'>
            <h1 id="banner__container--title-home">Explota e impulsa <br/> todo tu potencial</h1>
        </div>
        <div></div>
        <img src={figure1} alt="decoration 1" className='decoration1-home decoration-home'/>
        <img src={figure2} alt="decoration 2" className='decoration2-home decoration-home'/>
        <img src={figure2} alt="decoration 3" className='decoration3-home decoration-home'/>
        <img src={lightgreen} alt="light decoration" className='decoration4-home decoration-home'/>
        <img src={lightgreen} alt="light decoration" className='decoration5-home decoration-home'/>
    </div>
  </>
  );
}

export default Banner;
