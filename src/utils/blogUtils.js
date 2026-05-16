const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ARTICLE_PREVIEW_STORAGE_KEY = 'ictArticlePreviewDraft';

const suggestedCategories = [
  'Salesforce',
  'Development',
  'Architecture',
  'Integrations',
  'Technical Debt',
  'Business Applications',
  'Web Development',
  'Management',
];

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

const hasElementNode = (fragment) =>
  Array.from(fragment.childNodes).some((node) => node.nodeType === Node.ELEMENT_NODE);

export const isHtmlContent = (content) => {
  if (!content || typeof document === 'undefined') {
    return false;
  }

  const template = document.createElement('template');
  template.innerHTML = content;
  return hasElementNode(template.content);
};

const escapeHtml = (value) =>
  (value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const stripHtml = (content) => {
  if (!content || typeof document === 'undefined') {
    return content || '';
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  doc.querySelectorAll('script, style').forEach((element) => element.remove());
  return doc.body?.textContent || '';
};

const isWhitespace = (character) => character === ' ' || character === '\t';

const getHeadingData = (line) => {
  let level = 0;

  while (level < line.length && line[level] === '#') {
    level += 1;
  }

  if (level < 1 || level > 3 || !isWhitespace(line[level])) {
    return null;
  }

  const text = line.slice(level).trim();
  return text ? { level, text } : null;
};

const getUnorderedListText = (line) => {
  const marker = line[0];

  if ((marker !== '-' && marker !== '*') || !isWhitespace(line[1])) {
    return '';
  }

  return line.slice(1).trim();
};

const getOrderedListText = (line) => {
  let index = 0;

  while (index < line.length && line[index] >= '0' && line[index] <= '9') {
    index += 1;
  }

  if (index === 0 || line[index] !== '.' || !isWhitespace(line[index + 1])) {
    return '';
  }

  return line.slice(index + 1).trim();
};

const getBlockquoteText = (line) => {
  if (line[0] !== '>' || !isWhitespace(line[1])) {
    return '';
  }

  return line.slice(1).trim();
};

export const isRichTextEmpty = (content) => {
  const normalizedContent = (content || '').trim();

  if (!normalizedContent || normalizedContent === '<p><br></p>') {
    return true;
  }

  return !stripHtml(normalizedContent).trim();
};

export const maybeConvertMarkdownToHtml = (content) => {
  if (!content || isHtmlContent(content)) {
    return content || '';
  }

  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const htmlParts = [];
  let listType = '';
  let paragraphLines = [];

  const closeParagraph = () => {
    if (paragraphLines.length === 0) {
      return;
    }

    htmlParts.push(`<p>${paragraphLines.map(escapeHtml).join('<br>')}</p>`);
    paragraphLines = [];
  };

  const closeList = () => {
    if (!listType) {
      return;
    }

    htmlParts.push(`</${listType}>`);
    listType = '';
  };

  lines.forEach((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      closeParagraph();
      closeList();
      return;
    }

    const headingData = getHeadingData(trimmedLine);
    if (headingData) {
      closeParagraph();
      closeList();
      htmlParts.push(`<h${headingData.level}>${escapeHtml(headingData.text)}</h${headingData.level}>`);
      return;
    }

    const unorderedListText = getUnorderedListText(trimmedLine);
    if (unorderedListText) {
      closeParagraph();

      if (listType !== 'ul') {
        closeList();
        htmlParts.push('<ul>');
        listType = 'ul';
      }

      htmlParts.push(`<li>${escapeHtml(unorderedListText)}</li>`);
      return;
    }

    const orderedListText = getOrderedListText(trimmedLine);
    if (orderedListText) {
      closeParagraph();

      if (listType !== 'ol') {
        closeList();
        htmlParts.push('<ol>');
        listType = 'ol';
      }

      htmlParts.push(`<li>${escapeHtml(orderedListText)}</li>`);
      return;
    }

    const blockquoteText = getBlockquoteText(trimmedLine);
    if (blockquoteText) {
      closeParagraph();
      closeList();
      htmlParts.push(`<blockquote>${escapeHtml(blockquoteText)}</blockquote>`);
      return;
    }

    closeList();
    paragraphLines.push(trimmedLine);
  });

  closeParagraph();
  closeList();

  return htmlParts.join('');
};

export const normalizeContentForEditor = (content) => maybeConvertMarkdownToHtml(content);

export const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof tags === 'string') {
    return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  }

  return [];
};

export const tagsToInputValue = (tags) => normalizeTags(tags).join(', ');

export const parseTagsInput = (value) => normalizeTags(value);

export const getArticleTags = (article) => {
  const backendTags = normalizeTags(article?.tags);

  if (backendTags.length > 0) {
    return backendTags;
  }

  const searchableText = `${article?.title || ''} ${article?.shortDescription || ''}`.toLowerCase();
  const inferredTags = suggestedCategories.filter((category) => {
    const keyword = category.toLowerCase();
    return searchableText.includes(keyword) || (keyword === 'integrations' && searchableText.includes('api'));
  });

  return inferredTags.length > 0 ? inferredTags : ['Business Applications'];
};

export const getReadingTime = (article, includeSummary = false) => {
  const backendReadingTime = Number(article?.readingTimeMinutes);

  if (Number.isFinite(backendReadingTime) && backendReadingTime > 0) {
    return `${backendReadingTime} min read`;
  }

  const contentParts = [article?.content || ''];
  if (includeSummary) {
    contentParts.unshift(article?.shortDescription || '');
  }

  const text = stripHtml(contentParts.join(' '));
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(wordCount / 220))} min read`;
};

export const validateArticle = (article) => {
  const errors = {};
  const title = (article.title || '').trim();
  const slug = (article.slug || '').trim();
  const shortDescription = (article.shortDescription || '').trim();
  const content = article.content || '';
  const authorName = (article.authorName || '').trim();
  const metaTitle = (article.metaTitle || '').trim();
  const metaDescription = (article.metaDescription || '').trim();
  const readingTimeMinutes = article.readingTimeMinutes;

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

  if (isRichTextEmpty(content)) {
    errors.content = 'Content is required.';
  }

  if (!authorName) {
    errors.authorName = 'Author name is required.';
  } else if (authorName.length > 100) {
    errors.authorName = 'Author name must be 100 characters or fewer.';
  }

  if (metaTitle.length > 200) {
    errors.metaTitle = 'Meta title must be 200 characters or fewer.';
  }

  if (metaDescription.length > 300) {
    errors.metaDescription = 'Meta description must be 300 characters or fewer.';
  }

  if (
    readingTimeMinutes !== null
    && readingTimeMinutes !== undefined
    && readingTimeMinutes !== ''
    && (!Number.isFinite(Number(readingTimeMinutes)) || Number(readingTimeMinutes) <= 0)
  ) {
    errors.readingTimeMinutes = 'Reading time must be a positive number.';
  }

  return errors;
};
