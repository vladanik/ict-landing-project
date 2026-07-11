import React from 'react';
import PropTypes from 'prop-types';
import { FaEnvelope, FaGithub, FaLinkedin, FaTelegramPlane } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import SEO from './SEO';

function Contact({ data }) {
  const { t } = useTranslation(['contact', 'seo']);
  const methods = [
    { key: 'github', labelKey: 'methods.github', icon: <FaGithub aria-hidden="true" /> },
    { key: 'linkedin', labelKey: 'methods.linkedin', icon: <FaLinkedin aria-hidden="true" /> },
    { key: 'telegram', labelKey: 'methods.telegram', icon: <FaTelegramPlane aria-hidden="true" /> },
    { key: 'email', labelKey: 'methods.email', icon: <FaEnvelope aria-hidden="true" /> },
  ];

  return (
    <main>
      <SEO
        title={t('seo:contact.title')}
        description={t('seo:contact.description')}
        canonicalPath="/contact"
      />
      <h1 className="page-header">{t('pageTitle')}</h1>
      <section id="contact" className="section">
        <p>{t('intro')}</p>
        <div className="contact-list">
          {methods.map((method) => {
            const item = data[method.key];

            return (
              <a
                className="contact-method"
                href={item.link}
                target={method.key === 'email' ? undefined : '_blank'}
                rel={method.key === 'email' ? undefined : 'noreferrer'}
                key={method.key}
              >
                <span className="contact-icon">{method.icon}</span>
                <span>
                  <strong>{t(method.labelKey)}</strong>
                  <span>{item.name}</span>
                </span>
              </a>
            );
          })}
        </div>
        <p className="contact-form-note">{t('formNote')}</p>
      </section>
    </main>
  );
}

Contact.propTypes = {
  data: PropTypes.shape({
    github: PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }).isRequired,
    linkedin: PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }).isRequired,
    telegram: PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }).isRequired,
    email: PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Contact;
