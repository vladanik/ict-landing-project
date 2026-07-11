import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getPublishedArticles } from '../api/blogApi';
import { getArticleTags, getReadingTimeMinutes } from '../utils/blogUtils';
import { formatLocalizedDate } from '../utils/formatting';
import LoadingSpinner from './LoadingSpinner';
import SEO, { buildCanonicalUrl, SITE_URL } from './SEO';

const PAGE_SIZE = 10;

const getPageArticles = (pageData) => {
  if (Array.isArray(pageData)) {
    return pageData;
  }

  return pageData?.content || [];
};

function Blog() {
  const { t, i18n } = useTranslation(['blog', 'seo', 'common']);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = useMemo(() => {
    const pageParam = Number.parseInt(searchParams.get('page') || '0', 10);
    return Number.isNaN(pageParam) || pageParam < 0 ? 0 : pageParam;
  }, [searchParams]);
  const activeTag = useMemo(() => (searchParams.get('tag') || '').trim(), [searchParams]);

  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCurrentRequest = true;

    const loadArticles = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await getPublishedArticles(page, PAGE_SIZE, activeTag);

        if (isCurrentRequest) {
          setPageData(data);
        }
      } catch (error) {
        if (isCurrentRequest) {
          console.error('Unable to load blog articles:', error);
          setErrorMessage(error.message || t('list.loadError'));
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    };

    loadArticles();

    return () => {
      isCurrentRequest = false;
    };
  }, [activeTag, page, t]);

  const articles = getPageArticles(pageData);
  const currentPage = pageData?.number ?? page;
  const totalPages = pageData?.totalPages ?? (articles.length > 0 ? 1 : 0);
  const isFirstPage = pageData?.first ?? currentPage <= 0;
  const isLastPage = pageData?.last ?? (totalPages === 0 || currentPage >= totalPages - 1);

  const changePage = (nextPage) => {
    const nextSearchParams = { page: String(Math.max(nextPage, 0)) };

    if (activeTag) {
      nextSearchParams.tag = activeTag;
    }

    setSearchParams(nextSearchParams);
  };

  const filterByTag = (tag) => {
    setSearchParams({ tag, page: '0' });
  };

  const clearTagFilter = () => {
    setSearchParams({ page: '0' });
  };

  return (
    <main>
      <SEO
        title={t('seo:blog.title')}
        description={t('seo:blog.description')}
        canonicalPath="/blog"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: t('seo:blog.jsonLdName'),
          description: t('seo:blog.jsonLdDescription'),
          url: `${SITE_URL}/blog`,
          inLanguage: i18n.resolvedLanguage,
          blogPost: articles.map((article) => ({
            '@type': 'BlogPosting',
            headline: article.title,
            description: article.shortDescription,
            url: buildCanonicalUrl(`/blog/${article.slug}`),
          })),
        }}
      />
      <h1 className="page-header">{t('list.title')}</h1>
      <section id="blog" className="section blog-list">
        <p className="blog-intro">{t('list.intro')}</p>
        {activeTag && (
          <output className="active-tag-filter">
            <span>{t('list.filteredBy', { tag: activeTag })}</span>
            <button type="button" className="btn btn-sm btn-outline-light" onClick={clearTagFilter}>
              {t('list.clearFilter')}
            </button>
          </output>
        )}

        {isLoading && <LoadingSpinner />}

        {!isLoading && errorMessage && (
          <div className="error-message" role="alert">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && articles.length === 0 && <p>{t('list.empty')}</p>}

        {!isLoading && !errorMessage && articles.length > 0 && (
          <>
            <div className="blog-card-grid">
              {articles.map((article) => {
                const displayDate = formatLocalizedDate(
                  article.publishedDate || article.createdDate,
                  i18n.resolvedLanguage
                );
                const createdDate = formatLocalizedDate(article.createdDate, i18n.resolvedLanguage);
                const modifiedDate = formatLocalizedDate(
                  article.lastModifiedDate,
                  i18n.resolvedLanguage
                );
                const shouldShowModifiedDate = modifiedDate && modifiedDate !== createdDate;

                return (
                  <article className="blog-card" key={article.id || article.slug}>
                    {article.imageUrl && (
                      <Link
                        className="blog-card-image-link"
                        to={`/blog/${article.slug}`}
                        aria-label={t('list.readArticleAria', { title: article.title })}
                      >
                        <img
                          className="blog-card-image"
                          src={article.imageUrl}
                          alt={t('list.imageAlt', { title: article.title })}
                          loading="lazy"
                        />
                      </Link>
                    )}
                    <div className="blog-meta">
                      <span>{article.authorName || t('meta.authorFallback')}</span>
                      {displayDate && <span>{displayDate}</span>}
                      <span>
                        {t('meta.readingTime', { count: getReadingTimeMinutes(article) })}
                      </span>
                      {shouldShowModifiedDate && (
                        <span>{t('meta.updated', { date: modifiedDate })}</span>
                      )}
                    </div>
                    <div
                      className="blog-tags"
                      aria-label={t('list.tagsAria', { title: article.title })}
                    >
                      {getArticleTags(article).map((tag) => (
                        <button type="button" key={tag} onClick={() => filterByTag(tag)}>
                          {tag}
                        </button>
                      ))}
                    </div>
                    <h2 className="blog-card-title">
                      <Link className="blog-card-title-link" to={`/blog/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>
                    <p className="blog-card-description">{article.shortDescription}</p>
                    <div className="blog-actions">
                      <Link className="btn btn-sm btn-primary" to={`/blog/${article.slug}`}>
                        {t('list.readMore')}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="blog-pagination" aria-label={t('list.paginationAria')}>
              <button
                type="button"
                className="btn btn-sm btn-outline-light"
                disabled={isFirstPage}
                onClick={() => changePage(currentPage - 1)}
              >
                {t('common:pagination.previous')}
              </button>
              <span>
                {t('common:pagination.pageOf', {
                  page: totalPages === 0 ? 0 : currentPage + 1,
                  total: totalPages,
                })}
              </span>
              <button
                type="button"
                className="btn btn-sm btn-outline-light"
                disabled={isLastPage}
                onClick={() => changePage(currentPage + 1)}
              >
                {t('common:pagination.next')}
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Blog;
