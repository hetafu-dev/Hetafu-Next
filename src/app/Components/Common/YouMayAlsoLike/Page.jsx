"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { useCountry } from "@/app/context/CountryContext";
import { fetchYouMayAlsoLike } from "@/services/productService";
import { mapStoreProduct } from "@/utils/cartUtils";
import StoreProductReviewSummary from "@/app/Components/Common/StoreProductReviewSummary";
import {
  StoreProductPackOptions,
  useStoreProductPack,
} from "@/app/Components/Common/StoreProductPackOptions";

const FALLBACK_RAW = [
  { id: 'ymal-1', name: 'Prime Smarts', slug: 'smarts-prime', category: 'SMARTS', price: 55.0, image: '/Images/Products/Smarts/prime.png', rating: 4.9, reviews: 312 },
  { id: 'ymal-2', name: 'Dentabits', slug: 'bits-dentabits', category: 'BITS', price: 45.0, image: '/Images/Products/Bits/Dentabits.png', rating: 4.8, reviews: 256 },
  { id: 'ymal-3', name: 'Powder', slug: 'cute-powder', category: 'CUTE', price: 35.0, image: '/Images/Products/CUTE/cutepowder.png', rating: 4.6, reviews: 189 },
  { id: 'ymal-4', name: 'Green Apple', slug: 'pops-green-apple', category: 'POPS', price: 75.0, image: '/Images/Products/Dollipops/Dollipop.png', rating: 4.7, reviews: 347 },
];

function mapFallbackProduct(raw) {
  return {
    ...mapStoreProduct({
      id: raw.id,
      name: raw.name,
      slug: raw.slug,
      category: raw.category,
      price: raw.price,
      discount_price: raw.price,
      image_url: raw.image,
    }),
    rating: raw.rating,
    reviews: raw.reviews,
  };
}

const FALLBACK_PRODUCTS = FALLBACK_RAW.map(mapFallbackProduct);
const YMAL_LOAD_KEY = '__hetafuYouMayAlsoLikeLoad';

async function loadYouMayAlsoLike(limit) {
  const cacheKey = `${YMAL_LOAD_KEY}:${limit}`;
  if (typeof globalThis !== 'undefined' && globalThis[cacheKey]) {
    return globalThis[cacheKey];
  }

  const promise = (async () => {
    const data = await fetchYouMayAlsoLike(limit);
    if (!data?.items?.length) return FALLBACK_PRODUCTS.slice(0, limit);
    return data.items.map((product) => mapStoreProduct(product));
  })();

  if (typeof globalThis !== 'undefined') {
    globalThis[cacheKey] = promise;
    promise.catch(() => {
      delete globalThis[cacheKey];
    });
  }

  return promise;
}

function YouMayAlsoLikeCard({ product }) {
  const { addItem } = useCart();
  const { currency } = useCountry();
  const { selectedPackId, setSelectedPackId, displayPrice, buildCartItem } = useStoreProductPack(product);

  return (
    <div className="flex flex-col border border-slate-200 overflow-hidden h-full">
      <div className="aspect-square bg-slate-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-5 flex flex-col flex-1 space-y-2">
        <p className="text-base font-medium leading-snug mb-1">{product.name}</p>
        <StoreProductReviewSummary rating={product.rating} reviews={product.reviews} />
        <StoreProductPackOptions
          packOptions={product.packOptions}
          selectedPackId={selectedPackId}
          onSelectPack={setSelectedPackId}
        />
        <p className="text-lg font-semibold mb-4 mt-2">{currency}{displayPrice.toFixed(2)}</p>
        <button
          type="button"
          onClick={() => addItem(buildCartItem())}
          className="mt-auto w-full py-4 cursor-pointer text-white text-xs font-bold tracking-widest uppercase bg-primary-brown hover:opacity-90 transition-opacity"
        >
          ADD TO BAG
        </button>
      </div>
    </div>
  );
}

export default function YouMayAlsoLike({
  limit = 4,
  title = 'You May Also Like',
  className = '',
  bordered = false,
  contained = false,
}) {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS.slice(0, limit));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const items = await loadYouMayAlsoLike(limit);
        if (!cancelled) setProducts(items);
      } catch {
        if (!cancelled) setProducts(FALLBACK_PRODUCTS.slice(0, limit));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [limit]);

  const content = (
    <>
      <h2 className="text-center text-2xl md:text-3xl font-light tracking-wide mb-10 uppercase">
        {title}
      </h2>

      {loading ? (
        <p className="text-center text-sm text-slate-500">Loading recommendations...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <YouMayAlsoLikeCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );

  return (
    <section
      className={`font-sans text-primary-brown ${bordered ? 'border-t border-slate-200 pt-12' : 'py-12 px-4'} ${className}`}
    >
      {contained ? (
        <div className="max-w-[1400px] mx-auto px-4 md:px-10">
          {content}
        </div>
      ) : (
        content
      )}
    </section>
  );
}
