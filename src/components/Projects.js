import React, { Component } from 'react';

function Projects({ data }) {
    return (
        <div id='projects' className='secition'>
            <h2>Projects</h2>
            <ul>
                {
                    data.map(project =>
                    <li>
                        <h4>{project.name}</h4>
                        <span>{project.description}</span>
                        <p>Project Link: <a href={project.link} className='project-link'>{project.name}</a></p>
                    </li>)
                }
            </ul>
        </div>
    );
}
 
export default Projects;