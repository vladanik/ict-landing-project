import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function CookieBanner({ show, close }) {
  const { t } = useTranslation('common');

  return (
    <div className="cookie-banner-container">
      {show && (
        <div className="cookie-banner" aria-label={t('cookie.ariaLabel')}>
          <p>
            {t('cookie.message')} <Link to="/legal">{t('cookie.policyLink')}</Link>.
          </p>
          <button className="btn btn-success" onClick={close}>
            {t('cookie.accept')}
          </button>
        </div>
      )}
    </div>
  );
}

CookieBanner.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
};

export default CookieBanner;
