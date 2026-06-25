import { apiClient } from './apiClient';
import { isMongoObjectId } from '@/utils/cartUtils';
import {
  clearCachedResponsesByPrefix,
  dedupeRequest,
  getCachedResponse,
  setCachedResponse,
} from './requestDedupe';

const CACHE_TTL_MS = 60_000;
const STATS_KEY_PREFIX = 'review-stats|';

function mapSortBy(sortBy) {
  if (sortBy === 'highest') return 'highest';
  if (sortBy === 'lowest') return 'lowest';
  return 'verified';
}

function buildReviewsCacheKey(productId, { page, limit, sortBy, rating }) {
  return `reviews|${productId}|p${page}|l${limit}|s${mapSortBy(sortBy)}|r${rating || 'all'}`;
}

function buildStatsCacheKey(productId) {
  return `${STATS_KEY_PREFIX}${productId}`;
}

function cacheReviewStats(productId, averageRating, reviewCount) {
  setCachedResponse(buildStatsCacheKey(productId), {
    average_rating: averageRating ?? 0,
    review_count: reviewCount ?? 0,
  });
}

function getCachedReviewStats(productId) {
  return getCachedResponse(buildStatsCacheKey(productId), CACHE_TTL_MS);
}

/**
 * Fetch aggregate review stats (rating + count) for a product.
 * Uses stats cache populated by any prior reviews fetch for this product.
 */
export async function fetchProductReviewStats(productId) {
  const cached = getCachedReviewStats(productId);
  if (cached) return cached;

  return dedupeRequest(
    buildStatsCacheKey(productId),
    async () => {
      const data = await fetchProductReviews(productId, { page: 1, limit: 1 });
      return {
        average_rating: data.average_rating ?? 0,
        review_count: data.review_count ?? 0,
      };
    },
    { ttlMs: CACHE_TTL_MS },
  );
}

/**
 * Fetch live review stats for storefront product cards (Best Sellers, recommendations).
 * Deduplicates by product id within a single batch.
 */
export async function attachReviewStatsToProducts(products) {
  if (!products?.length) return products || [];

  const mongoProducts = products.filter((product) => isMongoObjectId(product.id));
  const uniqueIds = [...new Set(mongoProducts.map((product) => product.id))];

  const statsById = new Map(
    await Promise.all(
      uniqueIds.map(async (id) => {
        try {
          const stats = await fetchProductReviewStats(id);
          return [id, stats];
        } catch {
          return [id, { average_rating: 0, review_count: 0 }];
        }
      }),
    ),
  );

  return products.map((product) => {
    if (!isMongoObjectId(product.id)) return product;
    const stats = statsById.get(product.id) || { average_rating: 0, review_count: 0 };
    return {
      ...product,
      rating: stats.review_count > 0 ? stats.average_rating : 0,
      reviews: stats.review_count ?? 0,
    };
  });
}

/**
 * Fetch paginated reviews for a product.
 */
export async function fetchProductReviews(productId, {
  page = 1,
  limit = 5,
  sortBy = 'verified',
  rating = null,
} = {}) {
  const cacheKey = buildReviewsCacheKey(productId, { page, limit, sortBy, rating });

  return dedupeRequest(
    cacheKey,
    async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort: mapSortBy(sortBy),
      });
      if (rating && rating !== 'all') {
        params.set('rating', String(rating));
      }

      const data = await apiClient.requestWithoutAuth(
        `/ecommerce/store/products/${encodeURIComponent(productId)}/reviews?${params.toString()}`,
      );

      cacheReviewStats(productId, data.average_rating, data.review_count);
      return data;
    },
    { ttlMs: CACHE_TTL_MS },
  );
}

/**
 * Check if the logged-in customer can review this product.
 */
export async function fetchReviewEligibility(productId) {
  try {
    return await apiClient.get(
      `/ecommerce/store/products/${encodeURIComponent(productId)}/reviews/eligibility`,
    );
  } catch {
    return {
      can_review: false,
      has_purchased: false,
      already_reviewed: false,
      customer_name: null,
    };
  }
}

/**
 * Submit a verified-purchase review (requires login + prior purchase).
 */
export async function submitProductReview(productId, { rating, title, body }) {
  const result = await apiClient.post(
    `/ecommerce/store/products/${encodeURIComponent(productId)}/reviews`,
    { rating, title, body },
  );
  clearCachedResponsesByPrefix(`reviews|${productId}|`);
  clearCachedResponsesByPrefix(`${STATS_KEY_PREFIX}${productId}`);
  return result;
}
