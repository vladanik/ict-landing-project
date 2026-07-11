import i18n from 'i18next';
import Cookies from 'js-cookie';
import { initReactI18next } from 'react-i18next';

import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_NAME,
  SUPPORTED_LANGUAGE_CODES,
  getLanguageConfig,
  normalizeLanguageCode,
  resolveBrowserLanguage,
} from './languages';

import enAdmin from './locales/en/admin.json';
import enAbout from './locales/en/about.json';
import enBlog from './locales/en/blog.json';
import enCommon from './locales/en/common.json';
import enContact from './locales/en/contact.json';
import enHome from './locales/en/home.json';
import enLegal from './locales/en/legal.json';
import enProjects from './locales/en/projects.json';
import enSeo from './locales/en/seo.json';
import enServices from './locales/en/services.json';
import plAdmin from './locales/pl/admin.json';
import plAbout from './locales/pl/about.json';
import plBlog from './locales/pl/blog.json';
import plCommon from './locales/pl/common.json';
import plContact from './locales/pl/contact.json';
import plHome from './locales/pl/home.json';
import plLegal from './locales/pl/legal.json';
import plProjects from './locales/pl/projects.json';
import plSeo from './locales/pl/seo.json';
import plServices from './locales/pl/services.json';
import ruAdmin from './locales/ru/admin.json';
import ruAbout from './locales/ru/about.json';
import ruBlog from './locales/ru/blog.json';
import ruCommon from './locales/ru/common.json';
import ruContact from './locales/ru/contact.json';
import ruHome from './locales/ru/home.json';
import ruLegal from './locales/ru/legal.json';
import ruProjects from './locales/ru/projects.json';
import ruSeo from './locales/ru/seo.json';
import ruServices from './locales/ru/services.json';
import ukAdmin from './locales/uk/admin.json';
import ukAbout from './locales/uk/about.json';
import ukBlog from './locales/uk/blog.json';
import ukCommon from './locales/uk/common.json';
import ukContact from './locales/uk/contact.json';
import ukHome from './locales/uk/home.json';
import ukLegal from './locales/uk/legal.json';
import ukProjects from './locales/uk/projects.json';
import ukSeo from './locales/uk/seo.json';
import ukServices from './locales/uk/services.json';

export const resources = {
  en: {
    admin: enAdmin,
    about: enAbout,
    blog: enBlog,
    common: enCommon,
    contact: enContact,
    home: enHome,
    legal: enLegal,
    projects: enProjects,
    seo: enSeo,
    services: enServices,
  },
  pl: {
    admin: plAdmin,
    about: plAbout,
    blog: plBlog,
    common: plCommon,
    contact: plContact,
    home: plHome,
    legal: plLegal,
    projects: plProjects,
    seo: plSeo,
    services: plServices,
  },
  ru: {
    admin: ruAdmin,
    about: ruAbout,
    blog: ruBlog,
    common: ruCommon,
    contact: ruContact,
    home: ruHome,
    legal: ruLegal,
    projects: ruProjects,
    seo: ruSeo,
    services: ruServices,
  },
  uk: {
    admin: ukAdmin,
    about: ukAbout,
    blog: ukBlog,
    common: ukCommon,
    contact: ukContact,
    home: ukHome,
    legal: ukLegal,
    projects: ukProjects,
    seo: ukSeo,
    services: ukServices,
  },
};

export const languageCookieOptions = {
  expires: 365,
  sameSite: 'Lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};

export const resolveInitialLanguage = ({
  cookieValue = Cookies.get(LANGUAGE_COOKIE_NAME),
  navigatorLanguages = typeof navigator === 'undefined'
    ? []
    : navigator.languages || navigator.language,
} = {}) => {
  const selectedLanguage = normalizeLanguageCode(cookieValue);

  if (selectedLanguage) {
    return selectedLanguage;
  }

  return resolveBrowserLanguage(navigatorLanguages);
};

export const persistLanguage = (language) => {
  const normalizedLanguage = normalizeLanguageCode(language) || DEFAULT_LANGUAGE;
  Cookies.set(LANGUAGE_COOKIE_NAME, normalizedLanguage, languageCookieOptions);
  return normalizedLanguage;
};

export const setDocumentLanguage = (language) => {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.lang = getLanguageConfig(language).htmlLang;
};

export const changeLanguage = async (language) => {
  const normalizedLanguage = persistLanguage(language);
  await i18n.changeLanguage(normalizedLanguage);
  setDocumentLanguage(normalizedLanguage);
  return normalizedLanguage;
};

const initialLanguage = resolveInitialLanguage();
setDocumentLanguage(initialLanguage);

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGE_CODES,
  ns: [
    'common',
    'home',
    'about',
    'services',
    'projects',
    'contact',
    'legal',
    'blog',
    'admin',
    'seo',
  ],
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
  returnEmptyString: false,
});

export default i18n;
