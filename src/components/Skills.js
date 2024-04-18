import React, { Component } from 'react';

function Skills({ data }) {
    return (
        <div id='skills'  className='secition'>
            <h2>Skills</h2>
            <hr />
            <h4>Soft skills:</h4>
            <ul>
                {
                    data.softSkills.map(skill =>
                    <li>
                        {skill}
                    </li>)
                }
            </ul>
            <hr />
            <h4>Hard skills:</h4>
            <ul>
                {
                    data.hardSkills.map(skill =>
                    <li>
                        {skill}
                    </li>)
                }
            </ul>
        </div>
    );
}
 
export default Skills;