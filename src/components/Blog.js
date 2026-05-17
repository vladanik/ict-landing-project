import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { getPublishedArticles } from '../api/blogApi';
import { formatDate, getArticleTags, getReadingTime } from '../utils/blogUtils';
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
          setErrorMessage(error.message || 'Unable to load articles. Please check backend connection.');
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
  }, [activeTag, page]);

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
        title='Blog | Salesforce & Full-Stack Development Articles'
        description='Technical articles about Salesforce development, frontend applications, backend systems, integrations, maintainability and software delivery.'
        canonicalPath='/blog'
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'ICT Services Blog',
          description: 'Practical articles about Salesforce development, frontend applications, backend systems, integrations, maintainability and software delivery.',
          url: `${SITE_URL}/blog`,
          blogPost: articles.map((article) => ({
            '@type': 'BlogPosting',
            headline: article.title,
            description: article.shortDescription,
            url: buildCanonicalUrl(`/blog/${article.slug}`),
          })),
        }}
      />
      <h1 className='page-header'>Blog</h1>
      <section id='blog' className='section blog-list'>
        <p className='blog-intro'>
          Practical articles about Salesforce development, frontend applications, backend systems, integrations,
          maintainability and software delivery.
        </p>
        {activeTag && (
          <output className='active-tag-filter'>
            <span>Filtered by {activeTag}</span>
            <button type='button' className='btn btn-sm btn-outline-light' onClick={clearTagFilter}>
              Clear filter
            </button>
          </output>
        )}

        {isLoading && <LoadingSpinner />}

        {!isLoading && errorMessage && (
          <div className='error-message' role='alert'>
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && articles.length === 0 && (
          <p>No articles have been published yet.</p>
        )}

        {!isLoading && !errorMessage && articles.length > 0 && (
          <>
            <div className='blog-card-grid'>
              {articles.map((article) => {
                const displayDate = formatDate(article.publishedDate || article.createdDate);
                const createdDate = formatDate(article.createdDate);
                const modifiedDate = formatDate(article.lastModifiedDate);
                const shouldShowModifiedDate = modifiedDate && modifiedDate !== createdDate;

                return (
                  <article className='blog-card' key={article.id || article.slug}>
                    {article.imageUrl && (
                      <Link className='blog-card-image-link' to={`/blog/${article.slug}`} aria-label={`Read ${article.title}`}>
                        <img
                          className='blog-card-image'
                          src={article.imageUrl}
                          alt={`${article.title} article`}
                          loading='lazy'
                        />
                      </Link>
                    )}
                    <div className='blog-meta'>
                      <span>{article.authorName || 'Wladyslaw Danik'}</span>
                      {displayDate && <span>{displayDate}</span>}
                      <span>{getReadingTime(article)}</span>
                      {shouldShowModifiedDate && <span>Updated {modifiedDate}</span>}
                    </div>
                    <div className='blog-tags' aria-label={`${article.title} tags`}>
                      {getArticleTags(article).map((tag) => (
                        <button type='button' key={tag} onClick={() => filterByTag(tag)}>
                          {tag}
                        </button>
                      ))}
                    </div>
                    <h2 className='blog-card-title'>
                      <Link className='blog-card-title-link' to={`/blog/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>
                    <p className='blog-card-description'>{article.shortDescription}</p>
                    <div className='blog-actions'>
                      <Link className='btn btn-sm btn-primary' to={`/blog/${article.slug}`}>
                        Read more
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className='blog-pagination' aria-label='Blog pagination'>
              <button
                type='button'
                className='btn btn-sm btn-outline-light'
                disabled={isFirstPage}
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
                disabled={isLastPage}
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

export default Blog;
