import { apiClient } from './apiClient';
import { resolveStorefrontImageUrl } from '@/utils/productImages';

/**
 * Fetch hetafu-next store categories (POPS, CUTE, BITS, SMARTS) with DB mapping.
 */
export async function fetchStoreCategories() {
  return apiClient.requestWithoutAuth('/ecommerce/store/categories');
}

/**
 * Fetch products for a navbar category.
 * @param {string} category - POPS | CUTE | BITS | SMARTS
 */
export async function fetchProductsByCategory(category) {
  const params = new URLSearchParams({ category: category.toUpperCase() });
  return apiClient.requestWithoutAuth(`/ecommerce/store/products?${params.toString()}`);
}

/**
 * Fetch full product details by MongoDB id.
 */
export async function fetchProductById(productId) {
  return apiClient.requestWithoutAuth(`/ecommerce/store/products/detail/${productId}`);
}

/**
 * Fetch full product details by storefront slug.
 */
export async function fetchProductBySlug(slug) {
  return apiClient.requestWithoutAuth(`/ecommerce/store/products/by-slug/${encodeURIComponent(slug)}`);
}

const STORE_CATALOG_CACHE_KEY = '__hetafuStoreCatalog';

/**
 * All active storefront products via a single best-sellers request (cached).
 * Used by navbar search, Best Sellers carousel, etc.
 */
export async function fetchStoreCatalog(limit = 50) {
  const cacheKey = `${STORE_CATALOG_CACHE_KEY}:${limit}`;
  if (typeof globalThis !== 'undefined' && globalThis[cacheKey]) {
    return globalThis[cacheKey];
  }

  const params = new URLSearchParams({ limit: String(limit) });
  const promise = apiClient.requestWithoutAuth(`/ecommerce/store/best-sellers?${params.toString()}`);

  if (typeof globalThis !== 'undefined') {
    globalThis[cacheKey] = promise;
    promise.catch(() => {
      delete globalThis[cacheKey];
    });
  }

  return promise;
}

function mapStoreProductForSearch(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category || product.category_name || '',
    price: Number(product.discount_price ?? product.price ?? 0),
    slug: product.slug,
    image: resolveStorefrontImageUrl(product.image_url || product.images?.[0]),
    description: product.description || '',
  };
}

/**
 * Product list for navbar search — reuses the shared store catalog request.
 */
export async function fetchAllStoreProductsForSearch() {
  const data = await fetchStoreCatalog(50);
  return (data?.items || []).map(mapStoreProductForSearch);
}

export async function fetchBestSellers(limit = 12) {
  const data = await fetchStoreCatalog(Math.max(limit, 12));
  if (!data?.items?.length) return data;
  return {
    ...data,
    items: data.items.slice(0, limit),
  };
}

/**
 * You may also like — shuffled products (default limit 4).
 */
export async function fetchYouMayAlsoLike(limit = 4) {
  const params = new URLSearchParams({ limit: String(limit) });
  return apiClient.requestWithoutAuth(`/ecommerce/store/you-may-also-like?${params.toString()}`);
}
