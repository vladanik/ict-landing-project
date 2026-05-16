const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const formatDate = (dateString) => {
  if (!dateString) {
    return '';
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const generateSlug = (title) =>
  (title || '')
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export const validateArticle = (article) => {
  const errors = {};
  const title = (article.title || '').trim();
  const slug = (article.slug || '').trim();
  const shortDescription = (article.shortDescription || '').trim();
  const content = (article.content || '').trim();
  const authorName = (article.authorName || '').trim();

  if (!title) {
    errors.title = 'Title is required.';
  } else if (title.length > 200) {
    errors.title = 'Title must be 200 characters or fewer.';
  }

  if (!slug) {
    errors.slug = 'Slug is required.';
  } else if (slug.length > 250) {
    errors.slug = 'Slug must be 250 characters or fewer.';
  } else if (!SLUG_PATTERN.test(slug)) {
    errors.slug = 'Slug must use lowercase letters, digits, and single hyphens between words.';
  }

  if (!shortDescription) {
    errors.shortDescription = 'Short description is required.';
  } else if (shortDescription.length > 500) {
    errors.shortDescription = 'Short description must be 500 characters or fewer.';
  }

  if (!content) {
    errors.content = 'Content is required.';
  }

  if (!authorName) {
    errors.authorName = 'Author name is required.';
  } else if (authorName.length > 100) {
    errors.authorName = 'Author name must be 100 characters or fewer.';
  }

  return errors;
};
