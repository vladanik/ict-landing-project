import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';
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
  formatDate,
  generateSlug,
  normalizeContentForEditor,
  parseTagsInput,
  tagsToInputValue,
  validateArticle,
} from '../utils/blogUtils';
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
      setMessage({ type: 'error', text: error.message || 'Unable to load article.' });
    } finally {
      setIsLoading(false);
    }
  }, [id, isEditMode, populateArticle]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadArticle();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadArticle]);

  const pageTitle = useMemo(() => (isEditMode ? 'Edit article' : 'Write new article'), [isEditMode]);

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
    readingTimeMinutes: formData.readingTimeMinutes === '' ? null : Number(formData.readingTimeMinutes),
    metaTitle: formData.metaTitle.trim() || null,
    metaDescription: formData.metaDescription.trim() || null,
    imageUrl: formData.imageUrl.trim() || null,
    featured: formData.featured,
    published: formData.published,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = buildPayload();
    const errors = validateArticle(payload);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      setMessage({ type: 'error', text: 'Please fix the highlighted fields before saving.' });
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
        setMessage({ type: 'success', text: 'Article saved successfully.' });
      } else {
        const createdArticle = await createArticle(payload);
        setMessage({ type: 'success', text: 'Article created successfully.' });

        if (createdArticle?.id) {
          navigate(`/adminpanel/articles/${createdArticle.id}`, {
            replace: true,
            state: { message: 'Article created successfully.' },
          });
        }
      }
    } catch (error) {
      console.error('Unable to save blog article:', error);
      setMessage({ type: 'error', text: error.message || 'Unable to save article.' });
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
        text: nextArticle.published ? 'Article published successfully.' : 'Article unpublished successfully.',
      });
    } catch (error) {
      console.error('Unable to update publication status:', error);
      setMessage({ type: 'error', text: error.message || 'Unable to update publication status.' });
    } finally {
      setIsActionRunning(false);
    }
  };

  const handleDelete = async () => {
    if (!article || !window.confirm(`Delete "${article.title}"? This cannot be undone.`)) {
      return;
    }

    setIsActionRunning(true);
    setMessage({ type: '', text: '' });

    try {
      await deleteArticle(article.id);
      navigate('/adminpanel', { replace: true, state: { message: 'Article deleted successfully.' } });
    } catch (error) {
      console.error('Unable to delete blog article:', error);
      setMessage({ type: 'error', text: error.message || 'Unable to delete article.' });
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
      readingTimeMinutes: formData.readingTimeMinutes === '' ? null : Number(formData.readingTimeMinutes),
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
      setMessage({ type: 'error', text: 'Unable to open preview in this browser session.' });
    }
  };

  return (
    <main>
      <h1 className='page-header'>{pageTitle}</h1>
      <section className='section admin-editor'>
        <div className='admin-toolbar'>
          <div>
            <h2>{pageTitle}</h2>
            <p>
              {isEditMode
                ? 'Update article copy, publication status, and article metadata.'
                : 'Create a draft or publish a new article for the public Blog.'}
            </p>
          </div>
          <button type='button' className='btn btn-outline-light' onClick={onLogout}>
            Logout
          </button>
        </div>

        <div className='admin-editor-nav'>
          <Link className='btn btn-sm btn-outline-light' to='/adminpanel'>
            Back to admin panel
          </Link>
          {isEditMode && article && (
            <span className={`admin-status ${article.published ? 'admin-status-published' : 'admin-status-draft'}`}>
              {article.published ? 'Published' : 'Draft'}
            </span>
          )}
        </div>

        {message.text && (
          <div className={message.type === 'success' ? 'success-message' : 'error-message'} role='status'>
            {message.text}
          </div>
        )}

        {isLoading && <LoadingSpinner />}

        {!isLoading && (!isEditMode || article) && (
          <form className='admin-editor-card' onSubmit={handleSubmit}>
                <div className='admin-form-field'>
                  <label htmlFor='article-title'>Title</label>
                  <input id='article-title' name='title' value={formData.title} onChange={handleChange} maxLength='200' />
                  {validationErrors.title && <span className='form-error'>{validationErrors.title}</span>}
                </div>

                <div className='admin-form-field'>
                  <label htmlFor='article-slug'>Slug</label>
                  <div className='admin-inline-field'>
                    <input id='article-slug' name='slug' value={formData.slug} onChange={handleChange} maxLength='250' />
                    <button type='button' className='btn btn-sm btn-outline-light' onClick={handleGenerateSlug} disabled={isBusy}>
                      Generate slug from title
                    </button>
                  </div>
                  {validationErrors.slug && <span className='form-error'>{validationErrors.slug}</span>}
                </div>

                <div className='admin-form-field'>
                  <label htmlFor='article-short-description'>Short description</label>
                  <textarea
                    id='article-short-description'
                    name='shortDescription'
                    value={formData.shortDescription}
                    onChange={handleChange}
                    maxLength='500'
                    rows='4'
                  />
                  {validationErrors.shortDescription && (
                    <span className='form-error'>{validationErrors.shortDescription}</span>
                  )}
                </div>

                <div className='admin-form-field'>
                  <label htmlFor='article-tags'>Tags</label>
                  <input
                    id='article-tags'
                    name='tags'
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder='Salesforce, React, Java'
                  />
                </div>

                <div className='admin-form-field'>
                  <label htmlFor='article-reading-time'>Reading time in minutes</label>
                  <input
                    id='article-reading-time'
                    name='readingTimeMinutes'
                    type='number'
                    min='1'
                    step='1'
                    value={formData.readingTimeMinutes}
                    onChange={handleChange}
                  />
                  <span className='admin-field-help'>Leave empty to calculate automatically from content.</span>
                  {validationErrors.readingTimeMinutes && (
                    <span className='form-error'>{validationErrors.readingTimeMinutes}</span>
                  )}
                </div>

                <div className='admin-form-field'>
                  <label htmlFor='article-meta-title'>Meta title</label>
                  <input
                    id='article-meta-title'
                    name='metaTitle'
                    value={formData.metaTitle}
                    onChange={handleChange}
                    maxLength='200'
                  />
                  <span className='admin-field-help'>Leave empty to use article title.</span>
                  {validationErrors.metaTitle && <span className='form-error'>{validationErrors.metaTitle}</span>}
                </div>

                <div className='admin-form-field'>
                  <label htmlFor='article-meta-description'>Meta description</label>
                  <textarea
                    id='article-meta-description'
                    name='metaDescription'
                    value={formData.metaDescription}
                    onChange={handleChange}
                    maxLength='300'
                    rows='3'
                  />
                  <span className='admin-field-help'>Leave empty to use short description.</span>
                  {validationErrors.metaDescription && (
                    <span className='form-error'>{validationErrors.metaDescription}</span>
                  )}
                </div>

                <div className='admin-form-field'>
                  <label htmlFor='article-image-url'>Image URL</label>
                  <input
                    id='article-image-url'
                    name='imageUrl'
                    type='url'
                    value={formData.imageUrl}
                    onChange={handleChange}
                  />
                  <span className='admin-field-help'>Used for social sharing and BlogPosting schema.</span>
                </div>

                <div className='admin-form-field'>
                  <label htmlFor='article-content'>Content</label>
                  <ReactQuill
                    id='article-content'
                    className='admin-rich-editor'
                    theme='snow'
                    value={formData.content}
                    onChange={handleContentChange}
                    modules={editorModules}
                    formats={editorFormats}
                    readOnly={isBusy}
                  />
                  {validationErrors.content && <span className='form-error'>{validationErrors.content}</span>}
                </div>

                <div className='admin-form-field'>
                  <label htmlFor='article-author'>Author name</label>
                  <input
                    id='article-author'
                    name='authorName'
                    value={formData.authorName}
                    onChange={handleChange}
                    maxLength='100'
                  />
                  {validationErrors.authorName && <span className='form-error'>{validationErrors.authorName}</span>}
                </div>

                <label className='admin-checkbox' htmlFor='article-published'>
                  <input
                    id='article-published'
                    name='published'
                    type='checkbox'
                    checked={formData.published}
                    onChange={handleChange}
                  />
                  Published
                </label>

                <label className='admin-checkbox' htmlFor='article-featured'>
                  <input
                    id='article-featured'
                    name='featured'
                    type='checkbox'
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  Featured
                </label>

                <div className='admin-editor-actions'>
                  <button type='submit' className='btn btn-primary' disabled={isBusy}>
                    {isSaving ? 'Saving...' : isEditMode ? 'Save changes' : 'Save article'}
                  </button>

                  <button type='button' className='btn btn-outline-light' onClick={handlePreview} disabled={isBusy}>
                    Preview Article
                  </button>

                  {isEditMode && article && (
                    <button
                      type='button'
                      className='btn btn-outline-light'
                      onClick={handlePublishToggle}
                      disabled={isBusy}
                    >
                      {isActionRunning ? 'Updating...' : article.published ? 'Unpublish' : 'Publish'}
                    </button>
                  )}

                  {isEditMode && article && (
                    <button type='button' className='btn btn-danger' onClick={handleDelete} disabled={isBusy}>
                      Delete article
                    </button>
                  )}
                </div>

                {isEditMode && article && (
                  <div className='blog-meta admin-editor-meta'>
                    {formatDate(article.createdDate) && <span>Created {formatDate(article.createdDate)}</span>}
                    {formatDate(article.lastModifiedDate) && <span>Updated {formatDate(article.lastModifiedDate)}</span>}
                    {formatDate(article.publishedDate) && <span>Published {formatDate(article.publishedDate)}</span>}
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
