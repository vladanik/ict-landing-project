import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getPublishedArticleBySlug } from '../api/blogApi';
import { getArticleTags, getReadingTimeMinutes, normalizeTags } from '../utils/blogUtils';
import { formatLocalizedDate } from '../utils/formatting';
import ArticleContentRenderer from './ArticleContentRenderer';
import LoadingSpinner from './LoadingSpinner';
import SEO, { buildCanonicalUrl, DEFAULT_OG_IMAGE } from './SEO';

function BlogArticleDetails() {
  const { t, i18n } = useTranslation('blog');
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCurrentRequest = true;

    const loadArticle = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await getPublishedArticleBySlug(slug);

        if (isCurrentRequest) {
          setArticle(data);
        }
      } catch (error) {
        if (isCurrentRequest) {
          console.error('Unable to load blog article:', error);
          setErrorMessage(error.message || t('article.loadError'));
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    };

    loadArticle();

    return () => {
      isCurrentRequest = false;
    };
  }, [slug, t]);

  const articleTitle =
    article?.metaTitle ||
    (article?.title
      ? t('article.titleSuffix', { title: article.title })
      : t('article.fallbackTitle'));
  const articleDescription =
    article?.metaDescription || article?.shortDescription || t('article.fallbackDescription');

  return (
    <main>
      <SEO
        title={articleTitle}
        description={articleDescription}
        canonicalPath={`/blog/${slug}`}
        ogType="article"
        ogImage={article?.imageUrl || DEFAULT_OG_IMAGE}
        jsonLd={
          article
            ? {
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: article.title,
                description: article.metaDescription || article.shortDescription,
                author: {
                  '@type': 'Person',
                  name: article.authorName || 'Wladyslaw Danik',
                },
                datePublished: article.publishedDate || article.createdDate,
                ...(article.lastModifiedDate ? { dateModified: article.lastModifiedDate } : {}),
                mainEntityOfPage: buildCanonicalUrl(`/blog/${slug}`),
                image: article.imageUrl || DEFAULT_OG_IMAGE,
                keywords: normalizeTags(article.tags),
                inLanguage: i18n.resolvedLanguage,
              }
            : null
        }
      />
      <article className="section blog-article">
        <Link className="blog-back-link" to="/blog">
          {t('article.backToBlog')}
        </Link>

        {isLoading && <LoadingSpinner />}

        {!isLoading && errorMessage && (
          <div className="error-message" role="alert">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && article && (
          <>
            <div className="blog-meta">
              <span>{article.authorName || t('meta.authorFallback')}</span>
              {formatLocalizedDate(article.publishedDate, i18n.resolvedLanguage) && (
                <span>
                  {t('meta.published', {
                    date: formatLocalizedDate(article.publishedDate, i18n.resolvedLanguage),
                  })}
                </span>
              )}
              {formatLocalizedDate(article.createdDate, i18n.resolvedLanguage) && (
                <span>
                  {t('meta.created', {
                    date: formatLocalizedDate(article.createdDate, i18n.resolvedLanguage),
                  })}
                </span>
              )}
              <span>{t('meta.readingTime', { count: getReadingTimeMinutes(article) })}</span>
              {formatLocalizedDate(article.lastModifiedDate, i18n.resolvedLanguage) && (
                <span>
                  {t('meta.updated', {
                    date: formatLocalizedDate(article.lastModifiedDate, i18n.resolvedLanguage),
                  })}
                </span>
              )}
            </div>
            <div className="blog-tags" aria-label={t('list.tagsAria', { title: article.title })}>
              {getArticleTags(article).map((tag) => (
                <Link to={`/blog?tag=${encodeURIComponent(tag)}`} key={tag}>
                  {tag}
                </Link>
              ))}
            </div>
            <h1>{article.title}</h1>
            {article.imageUrl && (
              <img
                className="blog-article-image"
                src={article.imageUrl}
                alt={t('list.imageAlt', { title: article.title })}
                loading="eager"
              />
            )}
            <p className="blog-article-description">{article.shortDescription}</p>
            <ArticleContentRenderer content={article.content} />
            <div className="article-internal-links">
              <Link to="/services">{t('article.viewServices')}</Link>
              <Link to="/contact#contactForm">{t('article.discussProject')}</Link>
            </div>
            <aside className="article-final-cta" aria-label={t('article.ctaAria')}>
              <p>{t('article.ctaText')}</p>
              <Link className="btn btn-primary" to="/contact#contactForm">
                {t('article.discussProject')}
              </Link>
            </aside>
          </>
        )}
      </article>
    </main>
  );
}

export default BlogArticleDetails;
