import React from 'react';
import PropTypes from 'prop-types';
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
import SEO from './SEO';

const caseStudyDetails = {
    ictWebsite: {
        problem: 'The brand needed a focused software development website with clear service positioning and a simple contact path.',
        solution: 'Built a React landing experience with reusable content, legal pages, blog routing and an EmailJS contact workflow.',
        result: 'A maintainable public site that communicates Salesforce, React and Java development services clearly.',
    },
    dreamAnalyzerAI: {
        problem: 'Users needed a structured way to submit open-ended text and receive useful AI-generated interpretations.',
        solution: 'Delivered a full-stack application with a React interface, Java Spring Boot backend and OpenAI API integration.',
        result: 'A working AI web application with separated frontend and backend responsibilities and deployable cloud hosting.',
    },
    patternHasher: {
        problem: 'Java applications needed a small reusable hashing utility with predictable behavior.',
        solution: 'Created a lightweight Java library with a pattern-based transformation approach and focused implementation.',
        result: 'A reusable package that can be inspected, extended and integrated into Java-based projects.',
    },
    travelAgencyWebsite: {
        problem: 'A content-heavy travel concept needed a structured, responsive web presentation.',
        solution: 'Implemented a PHP and frontend experience with organized content sections and responsive styling.',
        result: 'A clear browser-based experience demonstrating practical content delivery and UI structure.',
    },
    snakeGame: {
        problem: 'A desktop game concept required event-driven input handling and reliable screen rendering.',
        solution: 'Built a Java Swing application with keyboard controls, game state updates and UI rendering.',
        result: 'A functional desktop application demonstrating Java UI programming and application state management.',
    },
};

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
            <SEO
                title='Case Studies | ICT Services'
                description='Selected software development case studies covering Salesforce, React, Java, integrations, maintainability and business applications.'
                canonicalPath='/case-studies'
            />
            <h1 className='page-header'>Case Studies</h1>
            <section className='section case-studies-intro' aria-labelledby='case-studies-heading'>
                <h2 id='case-studies-heading'>Selected Software Development Work</h2>
                <p>
                    These case studies summarize practical implementation work across React applications, Java backend
                    systems, integrations, maintainability and business-facing software. Client-sensitive work can be
                    discussed as anonymized examples.
                </p>
            </section>
            <section className='projects-grid site-container' aria-label='Case studies'>
                {data.projects.map(project => {
                    const details = caseStudyDetails[project.projectId] || {
                        problem: project.description,
                        solution: 'Delivered a focused software implementation using the listed technologies.',
                        result: 'Improved clarity, maintainability and delivery readiness for the application.',
                    };

                    return (
                        <article id={project.projectId} key={project.projectId} className='project-card'>
                        <div className='project-description'>
                            <h3>{project.name}</h3>
                            <dl className='case-study-details'>
                                <dt>Problem</dt>
                                <dd>{details.problem}</dd>
                                <dt>Solution</dt>
                                <dd>{details.solution}</dd>
                                <dt>Technologies</dt>
                                <dd>
                                    {project.techStack && (
                                        <ul className='tech-stack' aria-label={`${project.name} technologies`}>
                                            {project.techStack.map(tech => <li key={tech}>{tech}</li>)}
                                        </ul>
                                    )}
                                </dd>
                                <dt>Result</dt>
                                <dd>{details.result}</dd>
                            </dl>
                            <div className='project-actions'>
                                {project.internalPath && (
                                    <Link className='btn btn-sm btn-primary' to={project.internalPath}>Open Case Study</Link>
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
                    );
                })}
            </section>
            <div id='workedWith' className='section single-project-section'>
                <h2>Technologies and ecosystems ICT Services works with</h2>
                {data.workWithNote && <p>{data.workWithNote}</p>}
                <div className='worked-with-container'>
                    {data.workWith.map(cmp =>
                        <img src={images[cmp.img]} alt={`${cmp.name} technology ecosystem logo`} title={cmp.name} key={cmp.name} loading='lazy' />
                    )}
                </div>
            </div>
        </main>
    );
}

Projects.propTypes = {
  data: PropTypes.shape({
    projects: PropTypes.arrayOf(
      PropTypes.shape({
        projectId: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        techStack: PropTypes.arrayOf(PropTypes.string),
        internalPath: PropTypes.string,
        demoLink: PropTypes.string,
        githubLink: PropTypes.string,
      })
    ).isRequired,
    workWithNote: PropTypes.string,
    workWith: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        img: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default Projects;
