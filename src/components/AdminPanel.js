import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getAdminArticles } from '../api/blogApi';
import { formatDate, getArticleTags, getReadingTime } from '../utils/blogUtils';
import LoadingSpinner from './LoadingSpinner';

const ADMIN_PAGE_SIZE = 50;

const getPageArticles = (pageData) => {
  if (Array.isArray(pageData)) {
    return pageData;
  }

  return pageData?.content || [];
};

function AdminPanel({ onLogout }) {
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
      setMessage({ type: 'error', text: error.message || 'Unable to load articles. Please check backend connection.' });
    } finally {
      setIsListLoading(false);
    }
  }, [page]);

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
      <h1 className='page-header'>Admin Panel</h1>
      <section className='section admin-panel'>
        <div className='admin-toolbar'>
          <div>
            <h2>Blog management</h2>
            <p>Manage published articles and drafts for the public Blog.</p>
          </div>
          <button type='button' className='btn btn-outline-light' onClick={onLogout}>
            Logout
          </button>
        </div>

        <div className='admin-list-actions'>
          <Link className='btn btn-primary' to='/adminpanel/articles/new'>
            Write new article
          </Link>
          <button type='button' className='btn btn-outline-light' onClick={loadArticles} disabled={isListLoading}>
            Refresh
          </button>
        </div>

        {message.text && (
          <output className={message.type === 'success' ? 'success-message' : 'error-message'}>
            {message.text}
          </output>
        )}

        {isListLoading && <LoadingSpinner />}

        {!isListLoading && articles.length === 0 && <p>No articles found.</p>}

        {!isListLoading && articles.length > 0 && (
          <>
            <div className='admin-article-grid'>
              {articles.map((article) => (
                <article
                  className={`admin-article-card${article.published ? '' : ' admin-article-card-draft'}`}
                  key={article.id}
                >
                  <div className='admin-card-heading'>
                    <Link className='admin-article-title' to={`/adminpanel/articles/${article.id}`}>
                      {article.title}
                    </Link>
                    <span
                      className={`admin-status ${
                        article.published ? 'admin-status-published' : 'admin-status-draft'
                      }`}
                    >
                      {article.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className='admin-article-slug'>{article.slug}</p>
                  {article.shortDescription && (
                    <p className='blog-card-description'>{article.shortDescription}</p>
                  )}
                  <div className='blog-tags' aria-label={`${article.title} tags`}>
                    {getArticleTags(article).map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <div className='blog-meta'>
                    {article.authorName && <span>{article.authorName}</span>}
                    <span>{getReadingTime(article, true)}</span>
                    {formatDate(article.createdDate) && <span>Created {formatDate(article.createdDate)}</span>}
                    {formatDate(article.lastModifiedDate) && (
                      <span>Updated {formatDate(article.lastModifiedDate)}</span>
                    )}
                    {formatDate(article.publishedDate) && (
                      <span>Published {formatDate(article.publishedDate)}</span>
                    )}
                  </div>
                  <div className='admin-quality-badges' aria-label={`${article.title} content quality markers`}>
                    {article.featured && <span>Featured</span>}
                    {article.metaTitle && <span>SEO title set</span>}
                    {article.metaDescription && <span>SEO description set</span>}
                  </div>
                </article>
              ))}
            </div>

            <div className='blog-pagination' aria-label='Admin article pagination'>
              <button
                type='button'
                className='btn btn-sm btn-outline-light'
                disabled={isFirstPage || isListLoading}
                onClick={() => changePage(currentPage - 1)}
              >
                Previous
              </button>
              <span>
                Page {totalPages === 0 ? 0 : currentPage + 1} of {totalPages}
              </span>
              <button
                type='button'
                className='btn btn-sm btn-outline-light'
                disabled={isLastPage || isListLoading}
                onClick={() => changePage(currentPage + 1)}
              >
                Next
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
