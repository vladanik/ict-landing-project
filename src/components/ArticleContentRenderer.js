import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

import { isHtmlContent, isRichTextEmpty } from '../utils/blogUtils';

function ArticleContentRenderer({ content }) {
  if (isRichTextEmpty(content)) {
    return <div className='blog-rich-content blog-rich-content-empty'>No content provided yet.</div>;
  }

  if (isHtmlContent(content)) {
    // TODO: For production, sanitize stored HTML on backend or before rendering.
    return <div className='blog-rich-content' dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return (
    <div className='blog-rich-content'>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

ArticleContentRenderer.propTypes = {
  content: PropTypes.string,
};

ArticleContentRenderer.defaultProps = {
  content: '',
};

export default ArticleContentRenderer;
