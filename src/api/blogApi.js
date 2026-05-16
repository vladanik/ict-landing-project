const removeTrailingSlashes = (value) => {
  let endIndex = value.length;

  while (endIndex > 0 && value[endIndex - 1] === '/') {
    endIndex -= 1;
  }

  return value.slice(0, endIndex);
};

const API_BASE_URL = removeTrailingSlashes(process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080');

const parseErrorMessage = async (response) => {
  const fallbackMessage = `Request failed with status ${response.status}`;

  try {
    const errorBody = await response.json();
    return errorBody.message || errorBody.error || errorBody.detail || errorBody.title || fallbackMessage;
  } catch (_error) {
    return fallbackMessage;
  }
};

const request = async (path, options = {}) => {
  const requestOptions = {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, requestOptions);

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response));
    }

    if (response.status === 204) {
      return null;
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('The backend returned an invalid response.');
    }

    if (error instanceof TypeError) {
      throw new Error('Internal server error. We\'re sorry for the inconvenience. Please try again later.');
    }

    throw error;
  }
};

export const getPublishedArticles = (page = 0, size = 10, tag = '') => {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  if (tag) {
    searchParams.set('tag', tag);
  }

  return request(`/api/blog/articles?${searchParams.toString()}`);
};

export const getPublishedArticleBySlug = (slug) =>
  request(`/api/blog/articles/${encodeURIComponent(slug)}`);

export const getAdminArticles = (page = 0, size = 50) =>
  request(`/api/admin/blog/articles?page=${page}&size=${size}`);

export const getAdminArticleById = (id) => request(`/api/admin/blog/articles/${encodeURIComponent(id)}`);

export const createArticle = (payload) =>
  request('/api/admin/blog/articles', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateArticle = (id, payload) =>
  request(`/api/admin/blog/articles/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteArticle = (id) =>
  request(`/api/admin/blog/articles/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

export const publishArticle = (id) =>
  request(`/api/admin/blog/articles/${encodeURIComponent(id)}/publish`, {
    method: 'PATCH',
  });

export const unpublishArticle = (id) =>
  request(`/api/admin/blog/articles/${encodeURIComponent(id)}/unpublish`, {
    method: 'PATCH',
  });
