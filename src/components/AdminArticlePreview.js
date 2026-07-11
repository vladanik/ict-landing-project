import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  ARTICLE_PREVIEW_STORAGE_KEY,
  getArticleTags,
  getReadingTimeMinutes,
} from '../utils/blogUtils';
import { formatLocalizedDate } from '../utils/formatting';
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
  const { t, i18n } = useTranslation(['admin', 'blog']);
  const previewData = useMemo(() => readPreviewData(), []);
  const article = previewData?.article;
  const returnPath = previewData?.returnPath || '/adminpanel';

  return (
    <main>
      <article className="section blog-article admin-preview">
        <div className="admin-preview-toolbar">
          <span className="admin-preview-badge">{t('preview.mode')}</span>
          <div className="admin-preview-actions">
            <Link className="btn btn-sm btn-primary" to={returnPath}>
              {t('preview.backToEditor')}
            </Link>
            <Link className="btn btn-sm btn-outline-light" to="/adminpanel">
              {t('preview.backToPanel')}
            </Link>
          </div>
        </div>

        {!article && (
          <div className="error-message" role="alert">
            {t('preview.missing')}
          </div>
        )}

        {article && (
          <>
            <div className="blog-meta">
              {article.authorName && <span>{article.authorName}</span>}
              {formatLocalizedDate(article.publishedDate, i18n.resolvedLanguage) && (
                <span>
                  {t('common.publishedDate', {
                    date: formatLocalizedDate(article.publishedDate, i18n.resolvedLanguage),
                  })}
                </span>
              )}
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
                    date: formatLocalizedDate(article.lastModifiedDate, i18n.resolvedLanguage),
                  })}
                </span>
              )}
              <span>{article.published ? t('common.published') : t('common.draft')}</span>
              {article.featured && <span>{t('common.featured')}</span>}
              <span>
                {t('blog:meta.readingTime', { count: getReadingTimeMinutes(article, true) })}
              </span>
            </div>
            <div
              className="blog-tags"
              aria-label={t('common.tagsAria', {
                title: article.title || t('preview.articleFallback'),
              })}
            >
              {getArticleTags(article).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            {article.imageUrl && (
              <img
                className="blog-article-image"
                src={article.imageUrl}
                alt={t('preview.imageAlt', {
                  title: article.title || t('preview.articleFallback'),
                })}
                loading="lazy"
              />
            )}
            <h2>{article.title?.trim() || t('preview.untitled')}</h2>
            {article.shortDescription?.trim() && (
              <p className="blog-article-description">{article.shortDescription}</p>
            )}
            {(article.metaTitle?.trim() || article.metaDescription?.trim()) && (
              <aside className="admin-seo-preview" aria-label={t('preview.seoPreviewAria')}>
                <h3>{t('preview.seoPreview')}</h3>
                <p>
                  <strong>{t('preview.metaTitle')}</strong>{' '}
                  {article.metaTitle?.trim() || t('preview.usingArticleTitle')}
                </p>
                <p>
                  <strong>{t('preview.metaDescription')}</strong>{' '}
                  {article.metaDescription?.trim() || t('preview.usingShortDescription')}
                </p>
              </aside>
            )}
            <ArticleContentRenderer content={article.content} />
          </>
        )}
      </article>
    </main>
  );
}

export default AdminArticlePreview;
