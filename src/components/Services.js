import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { formatText } from '../utils/Utils';
import SEO from './SEO';

function Services({ data }) {
  const { t } = useTranslation(['services', 'seo']);

  return (
    <main>
      <SEO
        title={t('seo:services.title')}
        description={t('seo:services.description')}
        canonicalPath="/services"
      />
      <h1 className="page-header">{t('pageTitle')}</h1>
      <div id="services" className="section">
        <div className="note-card">
          <p>{t('intro')}</p>
        </div>

        <div className="services-grid">
          {data.map((service) => (
            <article id={service.id} className="service-card" key={service.id}>
              <h3>{t(`${service.translationKey}.title`)}</h3>
              <p>{t(`${service.translationKey}.description`)}</p>
              <Link className="btn btn-primary" to="/contact#contactForm">
                {t('discussService')}
              </Link>
            </article>
          ))}
        </div>

        <div className="note-card">
          <p>{formatText(t('notes.demo'))}</p>
        </div>
        <div className="note-card">
          <p>{formatText(t('notes.pricing'))}</p>
        </div>
      </div>
    </main>
  );
}

Services.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      translationKey: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Services;
