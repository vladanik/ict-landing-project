import React from 'react';

function AboutMe({ data }) {
    return (
        <div id='aboutMe' className='secition'>
            <p>{data}</p>
            <img src='photo_5431819627601709746_y.jpg' alt='MyPicture'></img>
        </div>
    );
}
 
export default AboutMe;