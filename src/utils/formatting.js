import { getLanguageConfig } from '../i18n/languages';

export const formatLocalizedDate = (dateString, language) => {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(getLanguageConfig(language).intlLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};
