import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import logo_CRM from '../assets/logo_CRM.png';
import logo_GLE from '../assets/logo_GLE.png';
import logo_REACT from '../assets/logo_REACT.png';
import logo_JAVA from '../assets/logo_JAVA.png';
import logo_DOCKER from '../assets/logo_DOCKER.png';
import logo_SPRING from '../assets/logo_SPRING.png';
import logo_OPENAI from '../assets/logo_OPENAI.jpeg';
import logo_ORCL from '../assets/logo_ORCL.png';
import logo_ADBE from '../assets/logo_ADBE.png';
import logo_VERCEL from '../assets/logo_VERCEL.png';
import logo_RENDER from '../assets/logo_RENDER.jpeg';
import SEO from './SEO';

function Projects({ data }) {
  const { t } = useTranslation(['projects', 'seo']);
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
        title={t('seo:projects.title')}
        description={t('seo:projects.description')}
        canonicalPath="/case-studies"
      />
      <h1 className="page-header">{t('pageTitle')}</h1>
      <section className="section case-studies-intro" aria-labelledby="case-studies-heading">
        <h2 id="case-studies-heading">{t('intro.title')}</h2>
        <p>{t('intro.description')}</p>
      </section>
      <section className="projects-grid site-container" aria-label={t('labels.caseStudiesAria')}>
        {data.projects.map((project) => {
          const name = t(`${project.translationKey}.name`);

          return (
            <article id={project.projectId} key={project.projectId} className="project-card">
              <div className="project-description">
                <h3>{name}</h3>
                <dl className="case-study-details">
                  <dt>{t('labels.problem')}</dt>
                  <dd>{t(`${project.translationKey}.problem`)}</dd>
                  <dt>{t('labels.solution')}</dt>
                  <dd>{t(`${project.translationKey}.solution`)}</dd>
                  <dt>{t('labels.technologies')}</dt>
                  <dd>
                    {project.techStack && (
                      <ul className="tech-stack" aria-label={t('labels.techStackAria', { name })}>
                        {project.techStack.map((tech) => (
                          <li key={tech}>{tech}</li>
                        ))}
                      </ul>
                    )}
                  </dd>
                  <dt>{t('labels.result')}</dt>
                  <dd>{t(`${project.translationKey}.result`)}</dd>
                </dl>
                <div className="project-actions">
                  {project.internalPath && (
                    <Link className="btn btn-sm btn-primary" to={project.internalPath}>
                      {t('actions.openCaseStudy')}
                    </Link>
                  )}
                  {project.demoLink && (
                    <a
                      className="btn btn-sm btn-outline-light"
                      href={project.demoLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('actions.liveDemo')}
                    </a>
                  )}
                  {project.githubLink && (
                    <a
                      className="btn btn-sm btn-outline-light"
                      href={project.githubLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </section>
      <div id="workedWith" className="section single-project-section">
        <h2>{t('workWith.title')}</h2>
        <p>{t('workWith.note')}</p>
        <div className="worked-with-container">
          {data.workWith.map((cmp) => (
            <img
              src={images[cmp.img]}
              alt={t('labels.technologyLogoAlt', { name: cmp.name })}
              title={cmp.name}
              key={cmp.name}
              loading="lazy"
            />
          ))}
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
        translationKey: PropTypes.string.isRequired,
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
