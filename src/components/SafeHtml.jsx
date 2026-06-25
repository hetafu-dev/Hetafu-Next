'use client';

import { sanitizeHtml } from '@/utils/sanitizeHtml';

/**
 * Renders sanitized HTML safely. Use instead of raw dangerouslySetInnerHTML.
 */
export default function SafeHtml({
  html,
  as: Tag = 'div',
  className,
  ...props
}) {
  const sanitized = sanitizeHtml(html);

  if (!sanitized) {
    return null;
  }

  return (
    <Tag
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
      {...props}
    />
  );
}
