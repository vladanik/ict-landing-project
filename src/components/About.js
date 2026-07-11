import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import SEO, { getPublicSocialLinks, SITE_URL } from './SEO';
import logoIcon from '../assets/ICT_cmpl_cloud.png';
import multiLing from '../assets/multilingual.png';

function About({ data }) {
  const { t, i18n } = useTranslation(['about', 'seo']);
  const sameAs = getPublicSocialLinks(data.contact);
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: t('seo:site.owner'),
    jobTitle: t('seo:about.jobTitle'),
    knowsAbout: [
      'Salesforce',
      'Apex',
      'Lightning Web Components',
      'Visualforce',
      'React',
      'Java',
      'Spring Boot',
      'SQL',
      'REST APIs',
    ],
    worksFor: {
      '@type': 'Organization',
      name: t('seo:site.name'),
      url: SITE_URL,
    },
    brand: {
      '@type': 'Brand',
      name: t('seo:site.name'),
    },
    inLanguage: i18n.resolvedLanguage,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <main>
      <SEO
        title={t('seo:about.title')}
        description={t('seo:about.description')}
        canonicalPath="/about"
        jsonLd={personSchema}
      />
      <h1 className="page-header">{t('pageTitle')}</h1>

      <section id="about-ict-services" className="section">
        <h2>{t('sections.intro.title')}</h2>
        <div className="section-image">
          <img src={logoIcon} alt={t('sections.intro.imageAlt')} loading="lazy" />
        </div>
        {t('sections.intro.paragraphs', { returnObjects: true }).map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section id="why-work-with-ict-services" className="section">
        <h2>{t('sections.why.title')}</h2>
        <ul className="trust-list">
          {t('sections.why.items', { returnObjects: true }).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="about-approach" className="section">
        <h2>{t('sections.approach.title')}</h2>
        <p>{t('sections.approach.paragraph')}</p>
      </section>

      <section id="communication-languages" className="section">
        <h2>{t('sections.communication.title')}</h2>
        <div className="section-image">
          <img src={multiLing} alt={t('sections.communication.imageAlt')} loading="lazy" />
        </div>
        <p>{t('sections.communication.paragraph')}</p>
      </section>
    </main>
  );
}

About.propTypes = {
  data: PropTypes.shape({
    contact: PropTypes.object,
  }).isRequired,
};

export default About;
