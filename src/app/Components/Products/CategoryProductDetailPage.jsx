'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/app/Components/Common/Navbar/Page';
import Footer from '@/app/Components/Common/Footer/Page';
import { CATEGORY_CONFIG } from '@/constants/categoryConfig';
import { fetchProductsByCategory } from '@/services/productService';
import { buildCategoryProductState } from '@/utils/buildCategoryProduct';

const ProductDetailView = dynamic(
  () => import('@/app/products/[slug]/page').then((mod) => mod.ProductDetailView),
  { loading: () => null },
);

const CATEGORY_CACHE_KEY = '__hetafuCategoryProductCache_v2';

function getCategoryCache() {
  if (typeof globalThis === 'undefined') return new Map();
  if (!globalThis[CATEGORY_CACHE_KEY]) {
    globalThis[CATEGORY_CACHE_KEY] = new Map();
  }
  return globalThis[CATEGORY_CACHE_KEY];
}

function readCachedCategoryState(categoryKey) {
  return getCategoryCache().get(categoryKey) || null;
}

function writeCachedCategoryState(categoryKey, state) {
  getCategoryCache().set(categoryKey, state);
}

/**
 * Single-page category product view: opens first variant by default (e.g. Green Apple),
 * customer switches flavour/variant on the same full product page.
 */
export default function CategoryProductDetailPage({ categoryKey, staticProducts = null }) {
  const initialCached = readCachedCategoryState(categoryKey);
  const [product, setProduct] = useState(initialCached?.product ?? null);
  const [variantCatalog, setVariantCatalog] = useState(initialCached?.variantCatalog ?? null);
  const [defaultVariant, setDefaultVariant] = useState(initialCached?.defaultVariant ?? null);
  const [loading, setLoading] = useState(!initialCached);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!readCachedCategoryState(categoryKey)) {
        setLoading(true);
      }
      setError(null);

      try {
        let staticData = staticProducts;
        if (!staticData) {
          try {
            const mod = await import('@/app/products/[slug]/page');
            staticData = mod.ALL_PRODUCTS || {};
          } catch {
            staticData = {};
          }
        }

        const data = await fetchProductsByCategory(categoryKey);
        if (cancelled) return;

        const built = buildCategoryProductState(categoryKey, data.items || [], staticData);
        if (!built) {
          setError('Category not found');
          return;
        }

        writeCachedCategoryState(categoryKey, built);
        setProduct(built.product);
        setVariantCatalog(built.variantCatalog);
        setDefaultVariant(built.defaultVariant);
      } catch (err) {
        if (!cancelled) {
          let staticData = staticProducts || {};
          if (!staticProducts) {
            try {
              const mod = await import('@/app/products/[slug]/page');
              staticData = mod.ALL_PRODUCTS || {};
            } catch {
              staticData = {};
            }
          }
          const built = buildCategoryProductState(categoryKey, [], staticData);
          if (built) {
            writeCachedCategoryState(categoryKey, built);
            setProduct(built.product);
            setVariantCatalog(built.variantCatalog);
            setDefaultVariant(built.defaultVariant);
          } else {
            setError(err.message || 'Failed to load products');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [categoryKey, staticProducts]);

  const config = CATEGORY_CONFIG[categoryKey];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-primary-brown">Loading product...</main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-primary-brown px-4 text-center">
          {error || `No products available for ${config?.title || categoryKey}.`}
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <ProductDetailView
      product={product}
      variantCatalog={variantCatalog}
      defaultVariant={defaultVariant}
    />
  );
}

