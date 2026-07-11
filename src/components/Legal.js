import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from './LoadingSpinner';
import { LEGAL_DIVIDER } from '../utils/Constant';
import LegalAccordionItem from './LegalAccordionItem';
import SEO from './SEO';

function Legal() {
  const { t, i18n } = useTranslation(['legal', 'seo']);
  const [legalData, setLegalData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const language = i18n.resolvedLanguage || 'en';

    const loadLegal = async () => {
      setLegalData(null);
      setErrorMessage('');

      try {
        const response = await fetch(`/legal/${language}.txt`, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Legal file missing for ${language}`);
        }
        const text = await response.text();
        setLegalData(text.split(LEGAL_DIVIDER).filter(Boolean));
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        console.error('Error fetching legal data:', error);
        setErrorMessage(t('loadError'));

        try {
          const fallbackResponse = await fetch('/legal/en.txt', { signal: controller.signal });
          const fallbackText = await fallbackResponse.text();
          setLegalData(fallbackText.split(LEGAL_DIVIDER).filter(Boolean));
        } catch (fallbackError) {
          if (!controller.signal.aborted) {
            console.error('Error fetching fallback legal data:', fallbackError);
            setLegalData([]);
          }
        }
      }
    };

    loadLegal();

    return () => controller.abort();
  }, [i18n.resolvedLanguage, t]);

  if (!legalData) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <main>
      <SEO
        title={t('seo:legal.title')}
        description={t('seo:legal.description')}
        canonicalPath="/legal"
      />
      <h1 className="page-header">{t('pageTitle')}</h1>
      <div id="legal" className="section">
        {errorMessage && (
          <div className="error-message" role="alert">
            {errorMessage}
          </div>
        )}
        {legalData.length === 0 && <p>{t('empty')}</p>}
        {legalData.map((section, index) => (
          <LegalAccordionItem section={section} index={index} key={index} />
        ))}
      </div>
    </main>
  );
}

export default Legal;
