import React from 'react';

function AboutMe({ data }) {
    return (
        <div id='aboutMe' className='secition'>
            <p>{data}</p>
            <img src='https://avatars.githubusercontent.com/u/77941004?v=4' alt='MyPicture'></img>
        </div>
    );
}
 
export default AboutMe;