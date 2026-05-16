import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { ARTICLE_PREVIEW_STORAGE_KEY, formatDate } from '../utils/blogUtils';
import ArticleContentRenderer from './ArticleContentRenderer';

const readPreviewData = () => {
  try {
    const storedPreview = sessionStorage.getItem(ARTICLE_PREVIEW_STORAGE_KEY);
    return storedPreview ? JSON.parse(storedPreview) : null;
  } catch (error) {
    console.error('Unable to read article preview data:', error);
    return null;
  }
};

function AdminArticlePreview() {
  const previewData = useMemo(() => readPreviewData(), []);
  const article = previewData?.article;
  const returnPath = previewData?.returnPath || '/adminpanel';

  return (
    <main>
      <article className='section blog-article admin-preview'>
        <div className='admin-preview-toolbar'>
          <span className='admin-preview-badge'>Preview mode</span>
          <div className='admin-preview-actions'>
            <Link className='btn btn-sm btn-primary' to={returnPath}>
              Back to editor
            </Link>
            <Link className='btn btn-sm btn-outline-light' to='/adminpanel'>
              Back to admin panel
            </Link>
          </div>
        </div>

        {!article && (
          <div className='error-message' role='alert'>
            No preview data available.
          </div>
        )}

        {article && (
          <>
            <div className='blog-meta'>
              {article.authorName && <span>{article.authorName}</span>}
              {formatDate(article.publishedDate) && <span>Published {formatDate(article.publishedDate)}</span>}
              {formatDate(article.createdDate) && <span>Created {formatDate(article.createdDate)}</span>}
              {formatDate(article.lastModifiedDate) && (
                <span>Updated {formatDate(article.lastModifiedDate)}</span>
              )}
              <span>{article.published ? 'Published' : 'Draft'}</span>
            </div>
            <h2>{article.title?.trim() || 'Untitled article'}</h2>
            {article.shortDescription?.trim() && (
              <p className='blog-article-description'>{article.shortDescription}</p>
            )}
            <ArticleContentRenderer content={article.content} />
          </>
        )}
      </article>
    </main>
  );
}

export default AdminArticlePreview;
