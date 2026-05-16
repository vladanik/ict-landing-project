import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getPublishedArticleBySlug } from '../api/blogApi';
import { formatDate } from '../utils/blogUtils';
import LoadingSpinner from './LoadingSpinner';

function BlogArticleDetails() {
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
          setErrorMessage(error.message || 'Unable to load this article. Please check backend connection.');
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
  }, [slug]);

  return (
    <main>
      <article className='section blog-article'>
        <Link className='blog-back-link' to='/blog'>
          Back to Blog
        </Link>

        {isLoading && <LoadingSpinner />}

        {!isLoading && errorMessage && (
          <div className='error-message' role='alert'>
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && article && (
          <>
            <div className='blog-meta'>
              <span>{article.authorName}</span>
              {formatDate(article.publishedDate) && <span>Published {formatDate(article.publishedDate)}</span>}
              {formatDate(article.createdDate) && <span>Created {formatDate(article.createdDate)}</span>}
              {formatDate(article.lastModifiedDate) && (
                <span>Updated {formatDate(article.lastModifiedDate)}</span>
              )}
            </div>
            <h2>{article.title}</h2>
            <p className='blog-article-description'>{article.shortDescription}</p>
            <div className='markdown-content'>{article.content}</div>
          </>
        )}
      </article>
    </main>
  );
}

export default BlogArticleDetails;
