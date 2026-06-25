import DOMPurify from 'isomorphic-dompurify';

const DEFAULT_CONFIG = {
  USE_PROFILES: { html: true },
};

/**
 * Sanitize HTML strings before rendering to prevent XSS.
 */
export function sanitizeHtml(html, config = DEFAULT_CONFIG) {
  if (html == null || html === '') {
    return '';
  }

  return DOMPurify.sanitize(String(html), config);
}
