import logoTR from '../../img/logoTR.png';
import './index.css';

function AboutUs(){
    return(
        <>
        <div id='aboutus__container'>
            <div id='aboutus__container1'>
                <img src={logoTR} alt="logo talento risaralda" />
            </div>
            <div id='aboutus__container2'>
                <h1>¡Bienvenido a Talento Risaralda!</h1>
                <p>¿Quieres representar a CDTI SENA en las competencias y mostrar todo tu talento? Talento Risaralda es la plataforma donde podrás registrarte fácilmente para participar en las diferentes categorías y competencias disponibles.
<br /> <br />
Solo tienes que completar tu información personal y seleccionar la competencia en la que deseas competir. Nosotros nos encargamos de gestionar todo lo demás para que tú solo te enfoques en dar lo mejor de ti.</p>
            </div>
        </div>
        </>
    )
}

export default AboutUs;