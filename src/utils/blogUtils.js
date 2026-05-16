const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

export const ARTICLE_PREVIEW_STORAGE_KEY = 'ictArticlePreviewDraft';

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

export const isHtmlContent = (content) => HTML_TAG_PATTERN.test(content || '');

const escapeHtml = (value) =>
  (value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const stripHtml = (content) =>
  (content || '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'");

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

    const headingMatch = trimmedLine.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      closeParagraph();
      closeList();
      htmlParts.push(`<h${headingMatch[1].length}>${escapeHtml(headingMatch[2])}</h${headingMatch[1].length}>`);
      return;
    }

    const unorderedListMatch = trimmedLine.match(/^[-*]\s+(.+)$/);
    if (unorderedListMatch) {
      closeParagraph();

      if (listType !== 'ul') {
        closeList();
        htmlParts.push('<ul>');
        listType = 'ul';
      }

      htmlParts.push(`<li>${escapeHtml(unorderedListMatch[1])}</li>`);
      return;
    }

    const orderedListMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);
    if (orderedListMatch) {
      closeParagraph();

      if (listType !== 'ol') {
        closeList();
        htmlParts.push('<ol>');
        listType = 'ol';
      }

      htmlParts.push(`<li>${escapeHtml(orderedListMatch[1])}</li>`);
      return;
    }

    const blockquoteMatch = trimmedLine.match(/^>\s+(.+)$/);
    if (blockquoteMatch) {
      closeParagraph();
      closeList();
      htmlParts.push(`<blockquote>${escapeHtml(blockquoteMatch[1])}</blockquote>`);
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

export const validateArticle = (article) => {
  const errors = {};
  const title = (article.title || '').trim();
  const slug = (article.slug || '').trim();
  const shortDescription = (article.shortDescription || '').trim();
  const content = article.content || '';
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

  if (isRichTextEmpty(content)) {
    errors.content = 'Content is required.';
  }

  if (!authorName) {
    errors.authorName = 'Author name is required.';
  } else if (authorName.length > 100) {
    errors.authorName = 'Author name must be 100 characters or fewer.';
  }

  return errors;
};
