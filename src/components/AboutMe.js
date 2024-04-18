import React, { Component } from 'react';

function AboutMe({ data }) {
    return (
        <div id='aboutMe' className='secition'>
            <h2>About Me</h2>
            <p>{data}</p>
        </div>
    );
}
 
export default AboutMe;