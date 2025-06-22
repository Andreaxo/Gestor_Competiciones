import Header from '../../Header';
import './index.css';
import figure1 from '../../img/figure1.png';
import lightgreen from '../../img/green-light.png';

function BannerCompeticiones() {
  
    return (
  <>
    <div id="competiciones__banner--container">
        <Header />
        <div className='banner__perspective--text-2'>
            <h1 id="banner__container--title">Competiciones</h1>
        </div>
        <img src={figure1} alt="decoration 1" className='decoration1 decoration'/>
    </div>
  </>
  );
}

export default BannerCompeticiones;
