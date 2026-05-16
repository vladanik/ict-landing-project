import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getPublishedArticleBySlug } from '../api/blogApi';
import { formatDate, getArticleTags, getReadingTime, normalizeTags } from '../utils/blogUtils';
import ArticleContentRenderer from './ArticleContentRenderer';
import LoadingSpinner from './LoadingSpinner';
import SEO, { buildCanonicalUrl, DEFAULT_OG_IMAGE } from './SEO';

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
      <SEO
        title={article?.metaTitle || (article?.title ? `${article.title} | ICT Services Blog` : 'Blog Article | ICT Services Blog')}
        description={article?.metaDescription || article?.shortDescription || 'Technical article from ICT Services about Salesforce, frontend, backend and software delivery.'}
        canonicalPath={`/blog/${slug}`}
        ogType='article'
        ogImage={article?.imageUrl || DEFAULT_OG_IMAGE}
        jsonLd={article ? {
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
        } : null}
      />
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
              <span>{article.authorName || 'Wladyslaw Danik'}</span>
              {formatDate(article.publishedDate) && <span>Published {formatDate(article.publishedDate)}</span>}
              {formatDate(article.createdDate) && <span>Created {formatDate(article.createdDate)}</span>}
              <span>{getReadingTime(article)}</span>
              {formatDate(article.lastModifiedDate) && (
                <span>Updated {formatDate(article.lastModifiedDate)}</span>
              )}
            </div>
            <div className='blog-tags' aria-label={`${article.title} tags`}>
              {getArticleTags(article).map((tag) => (
                <Link to={`/blog?tag=${encodeURIComponent(tag)}`} key={tag}>
                  {tag}
                </Link>
              ))}
            </div>
            <h1>{article.title}</h1>
            {article.imageUrl && (
              <img
                className='blog-article-image'
                src={article.imageUrl}
                alt={`${article.title} article`}
                loading='eager'
              />
            )}
            <p className='blog-article-description'>{article.shortDescription}</p>
            <ArticleContentRenderer content={article.content} />
            <div className='article-internal-links'>
              <Link to='/services'>View development services</Link>
              <Link to='/contact#contactForm'>Discuss your project</Link>
            </div>
            <aside className='article-final-cta' aria-label='Project discussion call to action'>
              <p>Need help with a similar Salesforce, Full-Stack or API project? Let&apos;s discuss your project.</p>
              <Link className='btn btn-primary' to='/contact#contactForm'>Discuss Your Project</Link>
            </aside>
          </>
        )}
      </article>
    </main>
  );
}

export default BlogArticleDetails;
