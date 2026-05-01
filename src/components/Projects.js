import React from 'react';
import { Link } from 'react-router-dom';

import logo_CRM    from '../assets/logo_CRM.png';
import logo_GLE    from '../assets/logo_GLE.png';
import logo_REACT  from '../assets/logo_REACT.png';
import logo_JAVA   from '../assets/logo_JAVA.png';
import logo_DOCKER from '../assets/logo_DOCKER.png';
import logo_SPRING from '../assets/logo_SPRING.png';
import logo_OPENAI from '../assets/logo_OPENAI.jpeg';
import logo_ORCL   from '../assets/logo_ORCL.png';
import logo_ADBE   from '../assets/logo_ADBE.png';
import logo_VERCEL from '../assets/logo_VERCEL.png';
import logo_RENDER from '../assets/logo_RENDER.jpeg';

function Projects({ data }) {
    const images = {
        logo_CRM,
        logo_GLE,
        logo_REACT,
        logo_JAVA,
        logo_DOCKER,
        logo_SPRING,
        logo_OPENAI,
        logo_ORCL,
        logo_ADBE, 
        logo_VERCEL,
        logo_RENDER,
    };  

    return (
        <main>
            <h1 className='page-header'>Projects</h1>
            <div className='projects-grid site-container'>
                {data.projects.map(project =>
                    <article id={project.projectId} key={project.projectId} className='project-card'>
                    <div className='project-description'>
                        <h2>{project.name}</h2>
                        <p>{project.description}</p>
                        {project.techStack && (
                            <ul className='tech-stack' aria-label={`${project.name} technology stack`}>
                                {project.techStack.map(tech => <li key={tech}>{tech}</li>)}
                            </ul>
                        )}
                        <div className='project-actions'>
                            {project.internalPath && (
                                <Link className='btn btn-sm btn-primary' to={project.internalPath}>Open Project</Link>
                            )}
                            {project.demoLink && (
                                <a className='btn btn-sm btn-outline-light' href={project.demoLink} target='_blank' rel='noreferrer'>Live Demo</a>
                            )}
                            {project.githubLink && (
                                <a className='btn btn-sm btn-outline-light' href={project.githubLink} target='_blank' rel='noreferrer'>GitHub</a>
                            )}
                        </div>
                    </div>
                    </article>
                )}
            </div>
            <div id='workedWith' className='section single-project-section'>
                <h2>Technologies and ecosystems we work with</h2>
                {data.workWithNote && <p>{data.workWithNote}</p>}
                <div className='worked-with-container'>
                    {data.workWith.map(cmp =>
                        <img src={images[cmp.img]} alt={`${cmp.name} ecosystem logo`} title={cmp.name} key={cmp.name} />
                    )}
                </div>
            </div>
        </main>
    );
}

export default Projects;
