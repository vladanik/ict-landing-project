import React from 'react';

function Skills({ data }) {
    return (
        <div id='skills' className='secition'>
            <div className='soft-skills'>
                <h4>Soft skills</h4>
                <ul>
                    {
                        data.softSkills.map(skill =>
                        <li key={skill.trim()}>
                            {skill}
                        </li>)
                    }
                </ul>
            </div>
            <div className='hard-skills'>
                <h4>Hard skills</h4>
                <ul>
                    {
                        data.hardSkills.map(skill =>
                        <li key={skill.trim()}>
                            {skill}
                        </li>)
                    }
                </ul>
            </div>
        </div>
    );
}
 
export default Skills;