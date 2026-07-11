import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

function LoadingSpinner({ fullPage }) {
  const { t } = useTranslation('common');
  let containerClass = 'loading-container';
  if (fullPage) {
    containerClass += ' loading-container-full-page';
  }

  return (
    <div className={containerClass}>
      <div className="spinner-border" role="status" id="loadingSpinner">
        <span className="visually-hidden">{t('status.loading')}</span>
      </div>
    </div>
  );
}

LoadingSpinner.propTypes = {
  fullPage: PropTypes.bool,
};

LoadingSpinner.defaultProps = {
  fullPage: false,
};

export default LoadingSpinner;
