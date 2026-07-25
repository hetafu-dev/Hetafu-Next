"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useCountry } from "@/app/context/CountryContext";
import { fetchStoreCatalog } from "@/services/productService";
import { mapStoreProduct } from "@/utils/cartUtils";
import StoreProductReviewSummary from "@/app/Components/Common/StoreProductReviewSummary";
import {
  StoreProductPackOptions,
  useStoreProductPack,
} from "@/app/Components/Common/StoreProductPackOptions";

const DISPLAY_LIMIT = 12;

async function loadBestSellers() {
  const data = await fetchStoreCatalog(50);
  if (!data?.items?.length) return [];
  return data.items.slice(0, DISPLAY_LIMIT).map((product) => mapStoreProduct(product));
}

function BestSellerCard({ product }) {
  const { addItem } = useCart();
  const { currency } = useCountry();
  const { selectedPackId, setSelectedPackId, displayPrice, buildCartItem } = useStoreProductPack(product);

  return (
    <div
      data-bestseller-card
      className="flex flex-col flex-shrink-0 snap-start w-[72vw] max-w-[260px] sm:w-[44vw] sm:max-w-none md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
    >
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
      <div className="flex flex-col gap-2 sm:gap-3 flex-1">
        <p className="text-sm sm:text-base font-bold leading-snug text-primary-brown line-clamp-2">{product.name}</p>
        <StoreProductReviewSummary rating={product.rating} reviews={product.reviews} size={12} />
        <StoreProductPackOptions
          packOptions={product.packOptions}
          selectedPackId={selectedPackId}
          onSelectPack={setSelectedPackId}
        />
        <p className="font-semibold text-sm text-primary-brown">{currency}{displayPrice.toFixed(2)}</p>
      </div>
      <button
        type="button"
        onClick={() => addItem(buildCartItem())}
        className="mt-3 w-full py-2.5 sm:py-3 cursor-pointer text-white text-xs tracking-widest font-semibold bg-primary-brown hover:opacity-90 transition-opacity"
      >
        ADD TO BAG
      </button>
    </div>
  );
}

export default function BestSellers() {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const items = await loadBestSellers();
        if (!cancelled) setProducts(items);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.querySelector('[data-bestseller-card]');
    const gap = 12;
    const scrollAmount = card ? card.offsetWidth + gap : container.clientWidth * 0.75;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-8 md:py-12 px-4 font-sans text-primary-brown overflow-hidden">
      <h2 className="text-center text-2xl md:text-3xl tracking-widest mb-6 md:mb-10">BEST SELLERS</h2>

      {loading ? (
        <p className="text-center text-sm text-slate-500">Loading best sellers...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-sm text-slate-500">No best sellers available at the moment.</p>
      ) : (
        <div className="relative max-w-7xl mx-auto md:px-10 min-w-0">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="hidden md:flex absolute -left-2 lg:left-0 top-[38%] -translate-y-1/2 z-10 p-1 hover:opacity-70 transition-opacity cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft size={28} className="text-primary-brown" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-3 md:gap-4 overflow-x-auto scroll-smooth pb-4 hide-scrollbar min-w-0 w-full snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0"
            style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((p) => (
              <BestSellerCard key={p.id} product={p} />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll('right')}
            className="hidden md:flex absolute -right-2 lg:right-0 top-[38%] -translate-y-1/2 z-10 p-1 hover:opacity-70 transition-opacity cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight size={28} className="text-primary-brown" />
          </button>
        </div>
      )}
    </section>
  );
}