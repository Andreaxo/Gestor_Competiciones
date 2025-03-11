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
                <h1>Impulsa tu talento</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. In dolor neque magni ipsum quaerat! Tempora, ipsa sit, rerum, at sapiente inventore provident laborum quasi nostrum nemo voluptatum placeat ratione delectus?</p>
            </div>
        </div>
        </>
    )
}

export default AboutUs;