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

const YMAL_LOAD_KEY = '__hetafuYouMayAlsoLikeLoad';

async function loadYouMayAlsoLike(limit) {
  const cacheKey = `${YMAL_LOAD_KEY}:${limit}`;
  if (typeof globalThis !== 'undefined' && globalThis[cacheKey]) {
    const data = await globalThis[cacheKey];
    if (!data?.items?.length) return [];
    return data.items.map((product) => mapStoreProduct(product));
  }

  const promise = fetchYouMayAlsoLike(limit);

  if (typeof globalThis !== 'undefined') {
    globalThis[cacheKey] = promise;
    promise.catch(() => {
      delete globalThis[cacheKey];
    });
  }

  const data = await promise;
  if (!data?.items?.length) return [];
  return data.items.map((product) => mapStoreProduct(product));
}

function YouMayAlsoLikeCard({ product }) {
  const { addItem } = useCart();
  const { currency } = useCountry();
  const { selectedPackId, setSelectedPackId, displayPrice, buildCartItem } = useStoreProductPack(product);

  return (
    <div className="flex flex-col border border-slate-200 overflow-hidden h-full">
      <div className="aspect-square bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const items = await loadYouMayAlsoLike(limit);
        if (!cancelled) setProducts(items);
      } catch {
        if (!cancelled) setProducts([]);
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
      ) : products.length === 0 ? (
        <p className="text-center text-sm text-slate-500">No recommendations available at the moment.</p>
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
