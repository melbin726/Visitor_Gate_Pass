import React, { useState } from 'react';

// Import your images
import image1 from '../assets/eye_Hide.svg';
import image2 from '../assets/eye_Show.svg';

function TextInputBox(props){  

  const [currentImage, setCurrentImage] = useState(image1);// Initialize state with the first image
  const [text, setText] = useState('Hide');

  // Function to toggle images
  const toggleImage = () => {
    setCurrentImage((prevImage) => (prevImage === image1 ? image2 : image1));
    setText((prevText) => (prevText === 'Show' ? 'Hide' : 'Show'));
  };




    return(
    <>
        <div className="textInput">
                <p className='textPara'>Username</p>
            <input type="text" name="" id="" className="inputsB"/>
        </div>
        <div className="textInput">
            <div className="textHide">
                <p className='textPara'>Password</p>
                <div onClick={toggleImage}>
                    <img src={currentImage} alt="Toggleable"/>
                    <p className='textState'>{text}</p>                
                </div>
            </div>
            <input type="text" name="" id="" className="inputsB"/>
        </div>
    </>
    );
}

export default TextInputBox;