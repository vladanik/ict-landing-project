export const DEFAULT_LANGUAGE = 'en';
export const LANGUAGE_COOKIE_NAME = 'ictLanguage';

export const SUPPORTED_LANGUAGES = {
  en: {
    code: 'en',
    label: 'EN',
    flag: '🇬🇧',
    htmlLang: 'en',
    intlLocale: 'en-GB',
    ogLocale: 'en_GB',
    nativeName: 'English',
  },
  pl: {
    code: 'pl',
    label: 'PL',
    flag: '🇵🇱',
    htmlLang: 'pl',
    intlLocale: 'pl-PL',
    ogLocale: 'pl_PL',
    nativeName: 'Polski',
  },
  ru: {
    code: 'ru',
    label: 'RU',
    flag: '🇷🇺',
    htmlLang: 'ru',
    intlLocale: 'ru-RU',
    ogLocale: 'ru_RU',
    nativeName: 'Русский',
  },
  uk: {
    code: 'uk',
    label: 'UA',
    flag: '🇺🇦',
    htmlLang: 'uk',
    intlLocale: 'uk-UA',
    ogLocale: 'uk_UA',
    nativeName: 'Українська',
  },
};

export const SUPPORTED_LANGUAGE_CODES = Object.keys(SUPPORTED_LANGUAGES);

export const normalizeLanguageCode = (value) => {
  if (!value || typeof value !== 'string') {
    return '';
  }

  const normalized = value.trim().toLowerCase().replace('_', '-');
  const baseLanguage = normalized.split('-')[0];
  const languageCode = baseLanguage === 'ua' ? 'uk' : baseLanguage;

  return SUPPORTED_LANGUAGES[languageCode] ? languageCode : '';
};

export const resolveBrowserLanguage = (navigatorLanguages = []) => {
  const languages = Array.isArray(navigatorLanguages) ? navigatorLanguages : [navigatorLanguages];

  for (const language of languages) {
    const normalizedLanguage = normalizeLanguageCode(language);
    if (normalizedLanguage) {
      return normalizedLanguage;
    }
  }

  return DEFAULT_LANGUAGE;
};

export const getLanguageConfig = (language) =>
  SUPPORTED_LANGUAGES[normalizeLanguageCode(language)] || SUPPORTED_LANGUAGES[DEFAULT_LANGUAGE];

export const getAlternateOgLocales = (language) => {
  const currentLanguage = getLanguageConfig(language).code;

  return SUPPORTED_LANGUAGE_CODES.filter((languageCode) => languageCode !== currentLanguage).map(
    (languageCode) => SUPPORTED_LANGUAGES[languageCode].ogLocale
  );
};
