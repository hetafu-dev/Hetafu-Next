/**
 * Resolve product images from API with fallback to public/Images/Products static assets.
 */

export function isValidImageUrl(url) {
  return typeof url === 'string' && url.trim().length > 0;
}

export function isLocalPublicImage(url) {
  return isValidImageUrl(url) && url.startsWith('/');
}

export function isBackendUploadUrl(url) {
  return isValidImageUrl(url) && (url.includes('/uploads/') || /^https?:\/\//i.test(url));
}

/**
 * Prefer static public/Images assets for display.
 * API upload URLs are often missing on disk (404) — static fallbacks are reliable.
 * When no static fallback exists, use API URLs as last resort.
 */
export function resolveProductImages(apiImages, fallbackImages = []) {
  const fromStatic = (fallbackImages || []).filter(isValidImageUrl);
  if (fromStatic.length) return fromStatic;

  return (apiImages || []).filter(isValidImageUrl);
}

/** Build gallery entries with src + fallback for runtime error handling. */
export function resolveProductImageGallery(apiImages, fallbackImages = []) {
  const api = (apiImages || []).filter(isValidImageUrl);
  const fallback = (fallbackImages || []).filter(isValidImageUrl);

  if (!fallback.length) {
    return api.map((src) => ({ src, fallback: src }));
  }

  if (!api.length) {
    return fallback.map((src) => ({ src, fallback: src }));
  }

  const count = Math.max(api.length, fallback.length);
  return Array.from({ length: count }, (_, i) => ({
    src: api[i] || fallback[i] || fallback[0],
    fallback: fallback[i] || fallback[0],
  }));
}

export function resolvePrimaryImage(apiImageUrl, apiImages, fallbackImages = []) {
  const gallery = resolveProductImageGallery(
    apiImageUrl ? [apiImageUrl, ...(apiImages || [])] : apiImages,
    fallbackImages,
  );
  return gallery[0]?.src || gallery[0]?.fallback || null;
}

/** Match an API product name to a variant label using keywords. */
export function matchVariantLabel(apiName, variantDef) {
  const name = (apiName || '').toLowerCase();
  return variantDef.keywords.some((keyword) => name.includes(keyword.toLowerCase()));
}

/** Pick fallback image for a gallery index. */
export function getImageFallback(fallbackImages, index = 0) {
  if (!fallbackImages?.length) return undefined;
  return fallbackImages[index] ?? fallbackImages[0];
}

/**
 * Resolve display price: use API when > 0, else static/config fallback.
 * API may return 0.0 when price is not set in CRM yet.
 */
export function resolveProductPrice(apiItem, staticItem, variantDef, config) {
  if (apiItem) {
    if (apiItem.discount_price != null && apiItem.discount_price > 0) {
      return apiItem.discount_price;
    }
    if (apiItem.price != null && apiItem.price > 0) {
      return apiItem.price;
    }
  }
  if (staticItem?.price > 0) return staticItem.price;
  if (variantDef?.defaultPrice > 0) return variantDef.defaultPrice;
  if (config?.defaultPrice > 0) return config.defaultPrice;
  return apiItem?.price ?? 0;
}

/** Display name from API product, falling back to variant label. */
export function resolveProductName(apiItem, variantDef, config) {
  if (apiItem?.name?.trim()) return apiItem.name.trim();
  if (variantDef?.label) return variantDef.label;
  return config?.displayName || config?.title || 'Product';
}
