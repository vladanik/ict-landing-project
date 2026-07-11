import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { changeLanguage } from '../i18n';
import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANGUAGE_CODES,
  getLanguageConfig,
} from '../i18n/languages';

function LanguageSwitcher({ onLanguageSelected }) {
  const { i18n, t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef(null);
  const currentLanguage = getLanguageConfig(i18n.resolvedLanguage || i18n.language);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleDocumentClick = (event) => {
      if (!switcherRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleSelect = async (language) => {
    await changeLanguage(language);
    setIsOpen(false);
    onLanguageSelected();
  };

  return (
    <div className="language-switcher" ref={switcherRef}>
      <button
        type="button"
        className="language-switcher-trigger"
        aria-label={t('languages.selectorLabel')}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {/* <span aria-hidden="true">{currentLanguage.flag}</span> */}
        <span aria-hidden="true">🌐</span>
        <span>{currentLanguage.label}</span>
      </button>

      {isOpen && (
        <div className="language-switcher-menu" role="menu" aria-label={t('languages.menuLabel')}>
          {SUPPORTED_LANGUAGE_CODES.map((languageCode) => {
            const language = SUPPORTED_LANGUAGES[languageCode];
            const isActive = language.code === currentLanguage.code;

            return (
              <button
                type="button"
                className={`language-switcher-option${isActive ? ' is-active' : ''}`}
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => handleSelect(language.code)}
                key={language.code}
              >
                {/* <span aria-hidden="true">{language.flag}</span> */}
                <span className="language-switcher-label">{language.label}</span>
                <span className="language-switcher-name">{language.nativeName}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

LanguageSwitcher.propTypes = {
  onLanguageSelected: PropTypes.func,
};

LanguageSwitcher.defaultProps = {
  onLanguageSelected: () => {},
};

export default LanguageSwitcher;
