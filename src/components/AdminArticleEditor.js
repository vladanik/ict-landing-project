import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';

import {
  createArticle,
  deleteArticle,
  getAdminArticleById,
  publishArticle,
  unpublishArticle,
  updateArticle,
} from '../api/blogApi';
import {
  ARTICLE_PREVIEW_STORAGE_KEY,
  generateSlug,
  normalizeContentForEditor,
  parseTagsInput,
  tagsToInputValue,
  validateArticle,
} from '../utils/blogUtils';
import { formatLocalizedDate } from '../utils/formatting';
import LoadingSpinner from './LoadingSpinner';

const emptyArticle = {
  title: '',
  slug: '',
  shortDescription: '',
  content: '',
  authorName: '',
  tags: '',
  readingTimeMinutes: '',
  metaTitle: '',
  metaDescription: '',
  imageUrl: '',
  featured: false,
  published: false,
};

const editorModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link'],
    ['clean'],
  ],
};

const editorFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'blockquote',
  'code-block',
  'link',
];

function AdminArticleEditor({ onLogout }) {
  const { t, i18n } = useTranslation('admin');
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [article, setArticle] = useState(null);
  const [formData, setFormData] = useState(emptyArticle);
  const [validationErrors, setValidationErrors] = useState({});
  const [message, setMessage] = useState(() => ({
    type: location.state?.message ? 'success' : '',
    text: location.state?.message || '',
  }));
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [isActionRunning, setIsActionRunning] = useState(false);

  const isBusy = isSaving || isActionRunning;

  const populateArticle = useCallback((data) => {
    setArticle(data);
    setFormData({
      title: data.title || '',
      slug: data.slug || '',
      shortDescription: data.shortDescription || '',
      content: normalizeContentForEditor(data.content || ''),
      authorName: data.authorName || '',
      tags: tagsToInputValue(data.tags),
      readingTimeMinutes: data.readingTimeMinutes || '',
      metaTitle: data.metaTitle || '',
      metaDescription: data.metaDescription || '',
      imageUrl: data.imageUrl || '',
      featured: Boolean(data.featured),
      published: Boolean(data.published),
    });
    setValidationErrors({});
  }, []);

  const loadArticle = useCallback(async () => {
    if (!isEditMode) {
      return;
    }

    setIsLoading(true);
    try {
      const data = await getAdminArticleById(id);
      populateArticle(data);
    } catch (error) {
      console.error('Unable to load blog article:', error);
      setMessage({ type: 'error', text: error.message || t('editor.messages.loadError') });
    } finally {
      setIsLoading(false);
    }
  }, [id, isEditMode, populateArticle, t]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadArticle();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadArticle]);

  const pageTitle = useMemo(
    () => (isEditMode ? t('editor.editTitle') : t('editor.newTitle')),
    [isEditMode, t]
  );

  const handleChange = (event) => {
    const { checked, name, type, value } = event.target;
    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setValidationErrors((previousErrors) => ({
      ...previousErrors,
      [name]: '',
    }));
  };

  const handleContentChange = (content) => {
    setFormData((previousFormData) => ({
      ...previousFormData,
      content,
    }));
    setValidationErrors((previousErrors) => ({
      ...previousErrors,
      content: '',
    }));
  };

  const buildPayload = () => ({
    title: formData.title.trim(),
    slug: formData.slug.trim(),
    shortDescription: formData.shortDescription.trim(),
    content: formData.content.trim(),
    authorName: formData.authorName.trim(),
    tags: parseTagsInput(formData.tags),
    readingTimeMinutes:
      formData.readingTimeMinutes === '' ? null : Number(formData.readingTimeMinutes),
    metaTitle: formData.metaTitle.trim() || null,
    metaDescription: formData.metaDescription.trim() || null,
    imageUrl: formData.imageUrl.trim() || null,
    featured: formData.featured,
    published: formData.published,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = buildPayload();
    const errors = validateArticle(payload, t('editor.validation', { returnObjects: true }));
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setMessage({ type: 'error', text: t('editor.messages.fixFields') });
      return;
    }

    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      if (isEditMode) {
        const updatedArticle = await updateArticle(id, payload);
        populateArticle({
          ...article,
          ...payload,
          ...(updatedArticle || {}),
          id: updatedArticle?.id || article?.id || id,
          content: updatedArticle?.content || payload.content,
        });
        setMessage({ type: 'success', text: t('editor.messages.saved') });
      } else {
        const createdArticle = await createArticle(payload);
        setMessage({ type: 'success', text: t('editor.messages.created') });

        if (createdArticle?.id) {
          navigate(`/adminpanel/articles/${createdArticle.id}`, {
            replace: true,
            state: { message: t('editor.messages.created') },
          });
        }
      }
    } catch (error) {
      console.error('Unable to save blog article:', error);
      setMessage({ type: 'error', text: error.message || t('editor.messages.saveError') });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!article) {
      return;
    }

    setIsActionRunning(true);
    setMessage({ type: '', text: '' });

    try {
      const updatedArticle = article.published
        ? await unpublishArticle(article.id)
        : await publishArticle(article.id);
      const nextPublished = updatedArticle?.published ?? !article.published;
      const nextArticle = {
        ...article,
        ...(updatedArticle || {}),
        published: nextPublished,
        content: updatedArticle?.content || formData.content,
      };

      populateArticle(nextArticle);
      setMessage({
        type: 'success',
        text: nextArticle.published
          ? t('editor.messages.published')
          : t('editor.messages.unpublished'),
      });
    } catch (error) {
      console.error('Unable to update publication status:', error);
      setMessage({ type: 'error', text: error.message || t('editor.messages.statusError') });
    } finally {
      setIsActionRunning(false);
    }
  };

  const handleDelete = async () => {
    if (!article || !window.confirm(t('editor.messages.deleteConfirm', { title: article.title }))) {
      return;
    }

    setIsActionRunning(true);
    setMessage({ type: '', text: '' });

    try {
      await deleteArticle(article.id);
      navigate('/adminpanel', { replace: true, state: { message: t('editor.messages.deleted') } });
    } catch (error) {
      console.error('Unable to delete blog article:', error);
      setMessage({ type: 'error', text: error.message || t('editor.messages.deleteError') });
      setIsActionRunning(false);
    }
  };

  const handleGenerateSlug = () => {
    setFormData((previousFormData) => ({
      ...previousFormData,
      slug: generateSlug(previousFormData.title),
    }));
    setValidationErrors((previousErrors) => ({ ...previousErrors, slug: '' }));
  };

  const handlePreview = () => {
    const returnPath = isEditMode ? `/adminpanel/articles/${id}` : '/adminpanel/articles/new';
    const previewArticle = {
      id: article?.id || id || null,
      title: formData.title,
      slug: formData.slug,
      shortDescription: formData.shortDescription,
      content: formData.content,
      authorName: formData.authorName,
      tags: parseTagsInput(formData.tags),
      readingTimeMinutes:
        formData.readingTimeMinutes === '' ? null : Number(formData.readingTimeMinutes),
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
      imageUrl: formData.imageUrl,
      featured: formData.featured,
      createdDate: article?.createdDate || null,
      lastModifiedDate: article?.lastModifiedDate || null,
      publishedDate: article?.publishedDate || null,
      published: formData.published,
    };

    try {
      sessionStorage.setItem(
        ARTICLE_PREVIEW_STORAGE_KEY,
        JSON.stringify({
          returnPath,
          article: previewArticle,
        })
      );
      navigate('/adminpanel/articles/preview');
    } catch (error) {
      console.error('Unable to prepare article preview:', error);
      setMessage({ type: 'error', text: t('editor.messages.previewError') });
    }
  };

  return (
    <main>
      <h1 className="page-header">{pageTitle}</h1>
      <section className="section admin-editor">
        <div className="admin-toolbar">
          <div>
            <h2>{pageTitle}</h2>
            <p>{isEditMode ? t('editor.editDescription') : t('editor.newDescription')}</p>
          </div>
          <button type="button" className="btn btn-outline-light" onClick={onLogout}>
            {t('common.logout')}
          </button>
        </div>

        <div className="admin-editor-nav">
          <Link className="btn btn-sm btn-outline-light" to="/adminpanel">
            {t('editor.backToPanel')}
          </Link>
          {isEditMode && article && (
            <span
              className={`admin-status ${article.published ? 'admin-status-published' : 'admin-status-draft'}`}
            >
              {article.published ? t('common.published') : t('common.draft')}
            </span>
          )}
        </div>

        {message.text && (
          <output className={message.type === 'success' ? 'success-message' : 'error-message'}>
            {message.text}
          </output>
        )}

        {isLoading && <LoadingSpinner />}

        {!isLoading && (!isEditMode || article) && (
          <form className="admin-editor-card" onSubmit={handleSubmit}>
            <div className="admin-form-field">
              <label htmlFor="article-title">{t('editor.fields.title')}</label>
              <input
                id="article-title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength="200"
              />
              {validationErrors.title && (
                <span className="form-error">{validationErrors.title}</span>
              )}
            </div>

            <div className="admin-form-field">
              <label htmlFor="article-slug">{t('editor.fields.slug')}</label>
              <div className="admin-inline-field">
                <input
                  id="article-slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  maxLength="250"
                />
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light"
                  onClick={handleGenerateSlug}
                  disabled={isBusy}
                >
                  {t('editor.actions.generateSlug')}
                </button>
              </div>
              {validationErrors.slug && <span className="form-error">{validationErrors.slug}</span>}
            </div>

            <div className="admin-form-field">
              <label htmlFor="article-short-description">
                {t('editor.fields.shortDescription')}
              </label>
              <textarea
                id="article-short-description"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                maxLength="500"
                rows="4"
              />
              {validationErrors.shortDescription && (
                <span className="form-error">{validationErrors.shortDescription}</span>
              )}
            </div>

            <div className="admin-form-field">
              <label htmlFor="article-tags">{t('editor.fields.tags')}</label>
              <input
                id="article-tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder={t('editor.placeholders.tags')}
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="article-reading-time">{t('editor.fields.readingTime')}</label>
              <input
                id="article-reading-time"
                name="readingTimeMinutes"
                type="number"
                min="1"
                step="1"
                value={formData.readingTimeMinutes}
                onChange={handleChange}
              />
              <span className="admin-field-help">{t('editor.help.readingTime')}</span>
              {validationErrors.readingTimeMinutes && (
                <span className="form-error">{validationErrors.readingTimeMinutes}</span>
              )}
            </div>

            <div className="admin-form-field">
              <label htmlFor="article-meta-title">{t('editor.fields.metaTitle')}</label>
              <input
                id="article-meta-title"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                maxLength="200"
              />
              <span className="admin-field-help">{t('editor.help.metaTitle')}</span>
              {validationErrors.metaTitle && (
                <span className="form-error">{validationErrors.metaTitle}</span>
              )}
            </div>

            <div className="admin-form-field">
              <label htmlFor="article-meta-description">{t('editor.fields.metaDescription')}</label>
              <textarea
                id="article-meta-description"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                maxLength="300"
                rows="3"
              />
              <span className="admin-field-help">{t('editor.help.metaDescription')}</span>
              {validationErrors.metaDescription && (
                <span className="form-error">{validationErrors.metaDescription}</span>
              )}
            </div>

            <div className="admin-form-field">
              <label htmlFor="article-image-url">{t('editor.fields.imageUrl')}</label>
              <input
                id="article-image-url"
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleChange}
              />
              <span className="admin-field-help">{t('editor.help.imageUrl')}</span>
            </div>

            <div className="admin-form-field">
              <label htmlFor="article-content">{t('editor.fields.content')}</label>
              <ReactQuill
                id="article-content"
                className="admin-rich-editor"
                theme="snow"
                value={formData.content}
                onChange={handleContentChange}
                modules={editorModules}
                formats={editorFormats}
                readOnly={isBusy}
              />
              {validationErrors.content && (
                <span className="form-error">{validationErrors.content}</span>
              )}
            </div>

            <div className="admin-form-field">
              <label htmlFor="article-author">{t('editor.fields.authorName')}</label>
              <input
                id="article-author"
                name="authorName"
                value={formData.authorName}
                onChange={handleChange}
                maxLength="100"
              />
              {validationErrors.authorName && (
                <span className="form-error">{validationErrors.authorName}</span>
              )}
            </div>

            <label className="admin-checkbox" htmlFor="article-published">
              <input
                id="article-published"
                name="published"
                type="checkbox"
                checked={formData.published}
                onChange={handleChange}
              />
              {t('common.published')}
            </label>

            <label className="admin-checkbox" htmlFor="article-featured">
              <input
                id="article-featured"
                name="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={handleChange}
              />
              {t('common.featured')}
            </label>

            <div className="admin-editor-actions">
              <button type="submit" className="btn btn-primary" disabled={isBusy}>
                {isSaving
                  ? t('editor.actions.saving')
                  : isEditMode
                    ? t('editor.actions.saveChanges')
                    : t('editor.actions.saveArticle')}
              </button>

              <button
                type="button"
                className="btn btn-outline-light"
                onClick={handlePreview}
                disabled={isBusy}
              >
                {t('editor.actions.preview')}
              </button>

              {isEditMode && article && (
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={handlePublishToggle}
                  disabled={isBusy}
                >
                  {isActionRunning
                    ? t('editor.actions.updating')
                    : article.published
                      ? t('editor.actions.unpublish')
                      : t('editor.actions.publish')}
                </button>
              )}

              {isEditMode && article && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={isBusy}
                >
                  {t('editor.actions.delete')}
                </button>
              )}
            </div>

            {isEditMode && article && (
              <div className="blog-meta admin-editor-meta">
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
                {formatLocalizedDate(article.publishedDate, i18n.resolvedLanguage) && (
                  <span>
                    {t('common.publishedDate', {
                      date: formatLocalizedDate(article.publishedDate, i18n.resolvedLanguage),
                    })}
                  </span>
                )}
              </div>
            )}
          </form>
        )}
      </section>
    </main>
  );
}

AdminArticleEditor.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default AdminArticleEditor;
