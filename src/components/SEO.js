import { useEffect } from 'react';
import PropTypes from 'prop-types';

export const SITE_URL = 'https://ict-udanik.vercel.app';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo512.png`;

const ensureMeta = (selector, createAttributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    Object.entries(createAttributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    document.head.appendChild(element);
  }

  return element;
};

const setMetaByName = (name, content) => {
  const element = ensureMeta(`meta[name="${name}"]`, { name });
  element.setAttribute('content', content);
};

const setMetaByProperty = (property, content) => {
  const element = ensureMeta(`meta[property="${property}"]`, { property });
  element.setAttribute('content', content);
};

const normalizeCanonicalPath = (path) => {
  if (!path || path === '/') {
    return '/';
  }

  return path.startsWith('/') ? path : `/${path}`;
};

export const buildCanonicalUrl = (path) => `${SITE_URL}${normalizeCanonicalPath(path) === '/' ? '' : normalizeCanonicalPath(path)}`;

export const getPublicSocialLinks = (contact = {}) =>
  ['linkedin', 'github']
    .map((key) => contact?.[key]?.link)
    .filter((link) => link && /^https?:\/\//.test(link));

function SEO({
  title,
  description,
  canonicalPath,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogType,
  ogImage,
  twitterCard,
  jsonLd,
}) {
  useEffect(() => {
    const resolvedCanonicalUrl = canonicalUrl || buildCanonicalUrl(canonicalPath || window.location.pathname);
    const resolvedOgTitle = ogTitle || title;
    const resolvedOgDescription = ogDescription || description;
    const resolvedOgImage = ogImage || DEFAULT_OG_IMAGE;

    document.title = title;
    setMetaByName('description', description);
    setMetaByProperty('og:title', resolvedOgTitle);
    setMetaByProperty('og:description', resolvedOgDescription);
    setMetaByProperty('og:type', ogType);
    setMetaByProperty('og:url', resolvedCanonicalUrl);
    setMetaByProperty('og:image', resolvedOgImage);
    setMetaByName('twitter:card', twitterCard);
    setMetaByName('twitter:title', resolvedOgTitle);
    setMetaByName('twitter:description', resolvedOgDescription);
    setMetaByName('twitter:image', resolvedOgImage);

    let canonicalElement = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', resolvedCanonicalUrl);

    document.head.querySelectorAll('script[data-ict-json-ld="true"]').forEach((element) => element.remove());

    const schemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
    schemas.forEach((schema) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-ict-json-ld', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, [
    title,
    description,
    canonicalPath,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogType,
    ogImage,
    twitterCard,
    jsonLd,
  ]);

  return null;
}

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  canonicalPath: PropTypes.string,
  canonicalUrl: PropTypes.string,
  ogTitle: PropTypes.string,
  ogDescription: PropTypes.string,
  ogType: PropTypes.string,
  ogImage: PropTypes.string,
  twitterCard: PropTypes.string,
  jsonLd: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
};

SEO.defaultProps = {
  canonicalPath: '',
  canonicalUrl: '',
  ogTitle: '',
  ogDescription: '',
  ogType: 'website',
  ogImage: DEFAULT_OG_IMAGE,
  twitterCard: 'summary_large_image',
  jsonLd: null,
};

export default SEO;
