'use client';

import { useEffect, useState } from 'react';

/**
 * Product image with automatic fallback to public/Images assets when API URL fails (404, etc.).
 */
export default function ProductImage({
  src,
  fallbackSrc,
  alt,
  className = '',
  width,
  height,
  priority = false,
  ...props
}) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  };

  if (!currentSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 text-[#887766] text-sm ${className}`}
        style={{ width, height }}
      >
        No image
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt || 'Product'}
      className={className}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={handleError}
      {...props}
    />
  );
}
