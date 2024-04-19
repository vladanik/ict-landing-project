import React, { Component, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Projects({ data }) {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
          const el = document.getElementById(location.hash.substring(1));
          if (el) {
            const yOffset = -20;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location.hash]);
    return (
        <main>
            <h1 className='page-header'>Projects</h1>
            {
                data.map(project =>
                <div id={project.projectId} className='secition single-project-section'>
                    <div className='project-description'>
                        <h4><a href={project.link} className='project-link'>{project.name}</a></h4>
                        <span>{project.description}</span>
                    </div>
                    <div className='project-links'>
                        <p><a href={project.link} className='project-link'>Open Project</a></p>
                        <p><a href={project.code} className='project-link'>Open Code</a></p>
                    </div>
                </div>)
            }
        </main>
    );
}
 
export default Projects;