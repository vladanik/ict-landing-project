import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { getAdminArticles } from '../api/blogApi';
import { getArticleTags, getReadingTimeMinutes } from '../utils/blogUtils';
import { formatLocalizedDate } from '../utils/formatting';
import LoadingSpinner from './LoadingSpinner';

const ADMIN_PAGE_SIZE = 50;

const getPageArticles = (pageData) => {
  if (Array.isArray(pageData)) {
    return pageData;
  }

  return pageData?.content || [];
};

function AdminPanel({ onLogout }) {
  const { t, i18n } = useTranslation(['admin', 'blog', 'common']);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = useMemo(() => {
    const pageParam = Number.parseInt(searchParams.get('page') || '0', 10);
    return Number.isNaN(pageParam) || pageParam < 0 ? 0 : pageParam;
  }, [searchParams]);
  const [pageData, setPageData] = useState(null);
  const [message, setMessage] = useState(() => ({
    type: location.state?.message ? 'success' : '',
    text: location.state?.message || '',
  }));
  const [isListLoading, setIsListLoading] = useState(false);

  const articles = useMemo(() => getPageArticles(pageData), [pageData]);
  const currentPage = pageData?.number ?? page;
  const totalPages = pageData?.totalPages ?? (articles.length > 0 ? 1 : 0);
  const isFirstPage = pageData?.first ?? currentPage <= 0;
  const isLastPage = pageData?.last ?? (totalPages === 0 || currentPage >= totalPages - 1);

  const loadArticles = useCallback(async () => {
    setIsListLoading(true);

    try {
      const data = await getAdminArticles(page, ADMIN_PAGE_SIZE);
      setPageData(data);
    } catch (error) {
      console.error('Unable to load admin blog articles:', error);
      setMessage({ type: 'error', text: error.message || t('panel.loadError') });
    } finally {
      setIsListLoading(false);
    }
  }, [page, t]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadArticles();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadArticles]);

  const changePage = (nextPage) => {
    setSearchParams({ page: String(Math.max(nextPage, 0)) });
  };

  return (
    <main>
      <h1 className="page-header">{t('common.panelTitle')}</h1>
      <section className="section admin-panel">
        <div className="admin-toolbar">
          <div>
            <h2>{t('panel.heading')}</h2>
            <p>{t('panel.description')}</p>
          </div>
          <button type="button" className="btn btn-outline-light" onClick={onLogout}>
            {t('common.logout')}
          </button>
        </div>

        <div className="admin-list-actions">
          <Link className="btn btn-primary" to="/adminpanel/articles/new">
            {t('panel.writeNew')}
          </Link>
          <button
            type="button"
            className="btn btn-outline-light"
            onClick={loadArticles}
            disabled={isListLoading}
          >
            {t('panel.refresh')}
          </button>
        </div>

        {message.text && (
          <output className={message.type === 'success' ? 'success-message' : 'error-message'}>
            {message.text}
          </output>
        )}

        {isListLoading && <LoadingSpinner />}

        {!isListLoading && articles.length === 0 && <p>{t('panel.empty')}</p>}

        {!isListLoading && articles.length > 0 && (
          <>
            <div className="admin-article-grid">
              {articles.map((article) => (
                <article
                  className={`admin-article-card${article.published ? '' : ' admin-article-card-draft'}`}
                  key={article.id}
                >
                  <div className="admin-card-heading">
                    <Link className="admin-article-title" to={`/adminpanel/articles/${article.id}`}>
                      {article.title}
                    </Link>
                    <span
                      className={`admin-status ${
                        article.published ? 'admin-status-published' : 'admin-status-draft'
                      }`}
                    >
                      {article.published ? t('common.published') : t('common.draft')}
                    </span>
                  </div>
                  <p className="admin-article-slug">{article.slug}</p>
                  {article.shortDescription && (
                    <p className="blog-card-description">{article.shortDescription}</p>
                  )}
                  <div
                    className="blog-tags"
                    aria-label={t('common.tagsAria', { title: article.title })}
                  >
                    {getArticleTags(article).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <div className="blog-meta">
                    {article.authorName && <span>{article.authorName}</span>}
                    <span>
                      {t('blog:meta.readingTime', { count: getReadingTimeMinutes(article, true) })}
                    </span>
                    {formatLocalizedDate(article.createdDate, i18n.resolvedLanguage) && (
                      <span>
                        {t('common.created', {
                          date: formatLocalizedDate(article.createdDate, i18n.resolvedLanguage),
                        })}
                      </span>
                    )}
                    {formatLocalizedDate(article.lastModifiedDate, i18n.resolvedLanguage) && (
                      <span>
                        {t('common.updated', {
                          date: formatLocalizedDate(
                            article.lastModifiedDate,
                            i18n.resolvedLanguage
                          ),
                        })}
                      </span>
                    )}
                    {formatLocalizedDate(article.publishedDate, i18n.resolvedLanguage) && (
                      <span>
                        {t('common.publishedDate', {
                          date: formatLocalizedDate(article.publishedDate, i18n.resolvedLanguage),
                        })}
                      </span>
                    )}
                  </div>
                  <div
                    className="admin-quality-badges"
                    aria-label={t('panel.qualityAria', { title: article.title })}
                  >
                    {article.featured && <span>{t('common.featured')}</span>}
                    {article.metaTitle && <span>{t('panel.seoTitleSet')}</span>}
                    {article.metaDescription && <span>{t('panel.seoDescriptionSet')}</span>}
                  </div>
                </article>
              ))}
            </div>

            <div className="blog-pagination" aria-label={t('panel.paginationAria')}>
              <button
                type="button"
                className="btn btn-sm btn-outline-light"
                disabled={isFirstPage || isListLoading}
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
                disabled={isLastPage || isListLoading}
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

AdminPanel.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default AdminPanel;
