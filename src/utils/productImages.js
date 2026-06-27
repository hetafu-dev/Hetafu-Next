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
 * Normalize API image paths to relative URLs (/uploads/... or /Images/...).
 * Strips hardcoded backend origins like http://localhost:8000.
 */
export function normalizeStorefrontImagePath(path) {
  if (!path || typeof path !== 'string') return null;
  const trimmed = path.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('/Images/')) return trimmed;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      return new URL(trimmed).pathname;
    } catch {
      return trimmed;
    }
  }
  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

/** Relative storefront image path for img src (proxied via Next.js /uploads rewrite). */
export function resolveStorefrontImageUrl(
  path,
  fallback = '/Images/Products/Dollipops/Dollipop.png',
) {
  return normalizeStorefrontImagePath(path) || fallback;
}

/**
 * Prefer static public/Images assets for display.
 * API upload URLs are often missing on disk (404) — static fallbacks are reliable.
 * When no static fallback exists, use API URLs as last resort.
 */
export function resolveProductImages(apiImages, fallbackImages = []) {
  const fromStatic = (fallbackImages || []).filter(isValidImageUrl);
  if (fromStatic.length) return fromStatic;

  return (apiImages || [])
    .map((url) => normalizeStorefrontImagePath(url))
    .filter(isValidImageUrl);
}

/** Build gallery entries with src + fallback for runtime error handling. */
export function resolveProductImageGallery(apiImages, fallbackImages = []) {
  const api = (apiImages || [])
    .map((url) => normalizeStorefrontImagePath(url))
    .filter(isValidImageUrl);
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
    if (apiItem.discount_price != null) return apiItem.discount_price;
    if (apiItem.price != null) return apiItem.price;
  }
  if (staticItem?.price > 0) return staticItem.price;
  if (variantDef?.defaultPrice > 0) return variantDef.defaultPrice;
  if (config?.defaultPrice > 0) return config.defaultPrice;
  return 0;
}

/** Match an API product name to a variant label using keywords. */
export function matchVariantLabel(apiName, variantDef) {
  const name = (apiName || '').toLowerCase();
  return variantDef.keywords.some((keyword) => name.includes(keyword.toLowerCase()));
}

/** Display name from API product, falling back to variant label. */
export function resolveProductName(apiItem, variantDef, config) {
  if (apiItem?.name?.trim()) return apiItem.name.trim();
  if (variantDef?.label) return variantDef.label;
  return config?.displayName || config?.title || 'Product';
}
