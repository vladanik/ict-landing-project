import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import '../Home.css';
import SEO, { getPublicSocialLinks, SITE_URL } from './SEO';

const whoWeWorkWith = [
  'home:who.items.0',
  'home:who.items.1',
  'home:who.items.2',
  'home:who.items.3',
];

const technologyGroups = [
  {
    id: 'salesforce',
  },
  {
    id: 'frontend',
  },
  {
    id: 'backend',
  },
  {
    id: 'delivery',
  },
];

function HomePage({ contact }) {
  const { t, i18n } = useTranslation(['home', 'seo']);
  const sameAs = getPublicSocialLinks(contact);
  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: t('seo:site.name'),
    founder: {
      '@type': 'Person',
      name: t('seo:site.owner'),
    },
    serviceType: t('seo:home.serviceTypes', { returnObjects: true }),
    url: SITE_URL,
    areaServed: t('seo:home.areasServed', { returnObjects: true }),
    inLanguage: i18n.resolvedLanguage,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };

  return (
    <main>
      <SEO
        title={t('seo:home.title')}
        description={t('seo:home.description')}
        canonicalPath="/"
        jsonLd={professionalServiceSchema}
      />
      <section className="home-container site-container" aria-labelledby="home-title">
        <h1 id="home-title">{t('hero.title')}</h1>
        <p className="home-subheadline">{t('hero.subheadline')}</p>
        <p className="home-value-prop">{t('hero.valueProp')}</p>
        <div className="home-actions">
          <Link className="btn btn-primary" to="/services">
            {t('hero.primaryCta')}
          </Link>
          <Link className="btn btn-outline-light" to="/contact">
            {t('hero.secondaryCta')}
          </Link>
        </div>
        <Link className="home-secondary-link" to="/about">
          {t('hero.aboutLink')}
        </Link>
      </section>

      <section className="section home-info-section" aria-labelledby="who-we-work-with">
        <h2 id="who-we-work-with">{t('who.title')}</h2>
        <div className="home-list-grid">
          {whoWeWorkWith.map((itemKey) => (
            <article className="home-info-card" key={itemKey}>
              <h3>{t(itemKey)}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="section home-info-section" aria-labelledby="technologies">
        <h2 id="technologies">{t('technologies.title')}</h2>
        <div className="technology-grid">
          {technologyGroups.map((group) => (
            <article className="home-info-card" key={group.id}>
              <h3>{t(`technologies.groups.${group.id}.name`)}</h3>
              <ul className="tech-stack">
                {t(`technologies.groups.${group.id}.items`, { returnObjects: true }).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

HomePage.propTypes = {
  contact: PropTypes.object,
};

HomePage.defaultProps = {
  contact: {},
};

export default HomePage;
