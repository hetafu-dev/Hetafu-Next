import { apiClient } from './apiClient';

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

/**
 * Best sellers — shuffled products with review stats included (default limit 12).
 */
export async function fetchBestSellers(limit = 12) {
  const params = new URLSearchParams({ limit: String(limit) });
  return apiClient.requestWithoutAuth(`/ecommerce/store/best-sellers?${params.toString()}`);
}

/**
 * You may also like — shuffled products (default limit 4).
 */
export async function fetchYouMayAlsoLike(limit = 4) {
  const params = new URLSearchParams({ limit: String(limit) });
  return apiClient.requestWithoutAuth(`/ecommerce/store/you-may-also-like?${params.toString()}`);
}
