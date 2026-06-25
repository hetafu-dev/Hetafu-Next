/**
 * Pack / size options and price rules for storefront products.
 */

import { CATEGORY_CONFIG } from '@/constants/categoryConfig';
import { matchVariantLabel } from '@/utils/productImages';

export function resolvePackPrice(basePrice, packOption) {
  const base = Number(basePrice) || 0;
  if (!packOption) return base;

  const multiplier = packOption.priceMultiplier ?? 1;
  const adjustment = packOption.priceAdjustment ?? 0;
  return Math.max(0, base * multiplier + adjustment);
}

export function getDefaultPackId(packOptions) {
  if (!packOptions?.options?.length) return null;
  return packOptions.defaultPackId || packOptions.options[0].id;
}

export function getPackOption(packOptions, packId) {
  if (!packOptions?.options?.length) return null;
  return packOptions.options.find((o) => o.id === packId) || packOptions.options[0];
}

export function getPackOptionsForVariant(variantDef, categoryConfig) {
  return variantDef?.packOptions || categoryConfig?.packOptions || null;
}

/** Resolve pack options for a storefront API / carousel product (slug, name, category). */
export function resolveStoreProductPackOptions(product) {
  const categoryKey = (product?.category || product?.category_name || '').toUpperCase();
  const config = CATEGORY_CONFIG[categoryKey];
  if (!config) return null;

  const slug = (product?.slug || '').toLowerCase();
  let variantDef = config.variants.find((v) => v.staticSlug === slug);
  if (!variantDef) {
    variantDef = config.variants.find((v) => matchVariantLabel(product?.name, v));
  }
  if (!variantDef && config.variants.length === 1) {
    variantDef = config.variants[0];
  }

  return getPackOptionsForVariant(variantDef, config);
}

export function shouldShowPackOptions(packOptions) {
  if (!packOptions?.options?.length) return false;
  return packOptions.options.length > 1 || Boolean(packOptions.alwaysShow);
}
