import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import logo from '../assets/ICT_cmpl_black.png';

function Footer({ contact }) {
  const { t } = useTranslation('common');
  const socialLinks = [
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'github', label: 'GitHub' },
  ].filter((item) => contact?.[item.key]?.link);

  return (
    <footer id="footer">
      <div className="site-container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo" aria-label={t('brand.homeAria')}>
            <img src={logo} alt={t('brand.logoAlt')} loading="lazy" />
          </Link>
          <p>{t('footer.description')}</p>
        </div>
        <nav className="footer-links" aria-label={t('navigation.footer')}>
          <Link to="/">{t('navigation.home')}</Link>
          <Link to="/services">{t('navigation.services')}</Link>
          <Link to="/about">{t('navigation.about')}</Link>
          <Link to="/case-studies">{t('navigation.caseStudies')}</Link>
          <Link to="/blog">{t('navigation.blog')}</Link>
          <Link to="/contact">{t('navigation.contact')}</Link>
          <Link to="/legal">{t('navigation.legal')}</Link>
        </nav>
        {socialLinks.length > 0 && (
          <nav className="footer-social-links" aria-label={t('navigation.social')}>
            {socialLinks.map((item) => (
              <a href={contact[item.key].link} target="_blank" rel="noreferrer" key={item.key}>
                {item.label}
              </a>
            ))}
          </nav>
        )}
        <p className="footer-copyright">{t('footer.copyright')}</p>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  contact: PropTypes.object,
};

Footer.defaultProps = {
  contact: {},
};

export default Footer;
