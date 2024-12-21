import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logo_ACN from '../assets/logo_ACN.png';
import logo_ADBE from '../assets/logo_ADBE.png';
import logo_CRM from '../assets/logo_CRM.png';
import logo_META from '../assets/logo_META.png';
import logo_ORCL from '../assets/logo_ORCL.png';

function Projects({ data }) {
    const location = useLocation();
    const images = {
        logo_ACN, logo_ADBE, logo_CRM, logo_META, logo_ORCL
    }

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
            {data.projects.map(project =>
                <div id={project.projectId} key={project.projectId} className='section single-project-section'>
                    <div className='project-description'>
                        <h4><a href={project.link} className='project-link' target='_blank'
                               rel='noreferrer'>{project.name}</a></h4>
                        <span>{project.description}</span>
                    </div>
                </div>
            )}
            <div id='workedWith' className='section single-project-section'>
                <h4>Also we are working with</h4>
                <div className='worked-with-container'>
                    {data.workWith.map(cmp =>
                        <img src={images[cmp.img]} alt={cmp.name} title={cmp.name} key={cmp.name} width="10%" height="100%" />
                    )}
                </div>
            </div>
        </main>
    );
}

export default Projects;