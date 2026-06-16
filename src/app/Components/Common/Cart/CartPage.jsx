'use client';

import { useCart } from '@/app/context/CartContext';
import { useCountry } from '@/app/context/CountryContext';
import { useRouter } from 'next/navigation';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

// Original products from the website
const ORIGINAL_PRODUCTS = [
  {
    id: 1,
    name: "Prime Smarts",
    category: "SMARTS",
    price: 55.00,
    description: "Advanced nanotechnology enamel protection serum that repairs and strengthens weakened tooth enamel. Dentist-formulated.",
    image: "/Images/Products/Smarts/Prime.png",
    link: "/products/smarts"
  },
  {
    id: 2,
    name: "Junior Smarts",
    category: "SMARTS",
    price: 55.00,
    description: "Advanced nanotechnology enamel protection serum for junior use. Dentist-formulated.",
    image: "/Images/Products/Smarts/Prime.png",
    link: "/products/smarts"
  },
  {
    id: 3,
    name: "Dia Smarts",
    category: "SMARTS",
    price: 55.00,
    description: "Advanced nanotechnology enamel protection serum for daily use. Dentist-formulated.",
    image: "/Images/Products/Smarts/Prime.png",
    link: "/products/smarts"
  },
  {
    id: 4,
    name: "Pink Smarts",
    category: "SMARTS",
    price: 55.00,
    description: "Advanced nanotechnology enamel protection serum with pink formula. Dentist-formulated.",
    image: "/Images/Products/Smarts/Prime.png",
    link: "/products/smarts"
  },
  {
    id: 5,
    name: "Dentabits",
    category: "BITS",
    price: 45.00,
    description: "Revolutionary dissolvable whitening bits that transform your oral care routine. Eco-friendly and perfect for travel.",
    image: "/Images/Products/Bits/Bits.png",
    link: "/products/bits"
  },
  {
    id: 6,
    name: "Powder",
    category: "CUTE",
    price: 35.00,
    description: "Gentle, alcohol-free family-friendly mouthwash powder that keeps breath fresh all day. Kid-safe and made with natural ingredients.",
    image: "/Images/Products/CUTE/cutepowder.png",
    link: "/products/cute"
  },
  {
    id: 7,
    name: "Tablets",
    category: "CUTE",
    price: 35.00,
    description: "Gentle, alcohol-free family-friendly mouthwash tablets that keeps breath fresh all day. Kid-safe and made with natural ingredients.",
    image: "/Images/Products/CUTE/cutetablets.png",
    link: "/products/cute"
  },
  {
    id: 8,
    name: "Green Apple",
    category: "POPS",
    price: 75.00,
    description: "Professional-grade teeth whitening strips in green apple flavor. Safe for enamel and easy to use.",
    image: "/Images/Products/Dollipops/Dollipop.png",
    link: "/products/pops"
  },
  {
    id: 9,
    name: "Mixed Berry",
    category: "POPS",
    price: 75.00,
    description: "Professional-grade teeth whitening strips in mixed berry flavor. Safe for enamel and easy to use.",
    image: "/Images/Products/Dollipops/Dollipop.png",
    link: "/products/pops"
  }
];

const FREE_GIFT_THRESHOLD = 599; // Updated for Indian pricing

const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, addItem, setDrawerOpen } = useCart();
  const { currency } = useCountry();
  const router = useRouter();
  const progressPct = Math.min(100, (subtotal / FREE_GIFT_THRESHOLD) * 100);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  const [shuffledProducts, setShuffledProducts] = useState(ORIGINAL_PRODUCTS);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setShuffledProducts(shuffleArray(ORIGINAL_PRODUCTS));
    checkScroll();
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const firstCard = scrollRef.current.querySelector('[data-carousel-card]');
        const cardWidth = firstCard ? firstCard.offsetWidth + 12 : 300; // 12 = gap-3
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 1) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          setShuffledProducts(shuffleArray(ORIGINAL_PRODUCTS));
        } else {
          scrollRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
        setTimeout(checkScroll, 350);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isClient]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const firstCard = scrollRef.current.querySelector('[data-carousel-card]');
      const cardWidth = firstCard ? firstCard.offsetWidth + 12 : 300; // 12 = gap-3
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-primary-brown">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-light">Your Bag</h1>
          <Link href="/products/pops" className="text-xs cursor-pointer font-bold tracking-widest uppercase underline underline-offset-4">
            CONTINUE SHOPPING
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left: items */}
          <div className="flex-1 min-w-0">
            {/* Reward progress */}
            <div className="bg-reward-bg rounded p-5 mb-6">
              <p className="text-center text-sm mb-2">Spend ₹599 more to get a free gift!</p>
              <div className="text-center text-sm font-semibold mb-1">{currency}{FREE_GIFT_THRESHOLD}</div>
              <div className="h-2 bg-slate-300 rounded-full overflow-hidden mb-1">
                <div className="h-full bg-slate-800 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
              </div>
              <p className="text-center text-xs text-slate-500">Free gift</p>
            </div>

            {/* Item list */}
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-slate-500">Your bag is empty</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 py-5">
                    <img src={item.image} alt={item.name} className="w-20 h-24 object-cover flex-shrink-0 bg-slate-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-5">{item.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.variant}</p>
                      {item.promo && <p className="text-xs text-slate-500 mt-1">🏷 {item.promo}</p>}
                    </div>

                    {/* Qty + price */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-slate-700">
                        <X size={16} />
                      </button>
                      {item.qty !== null ? (
                        <div className="flex items-center border border-slate-300 text-sm">
                          <button onClick={() => updateQty(item.id, -1)} className="px-2 py-1 hover:bg-slate-100">−</button>
                          <span className="px-3">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="px-2 py-1 hover:bg-slate-100">+</button>
                        </div>
                      ) : null}
                      <div className="text-right">
                        {item.originalPrice && (
                          <p className="text-xs text-slate-400 line-through">{currency}{item.originalPrice.toFixed(2)}</p>
                        )}
                        <p className="text-sm font-semibold">{currency}{item.price.toFixed(2)}</p>
                        {item.pricePerUnit && <p className="text-xs text-slate-500">{item.pricePerUnit}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: sidebar */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="border border-slate-200 p-5 mb-4">
              <div className="flex justify-between text-sm font-bold uppercase tracking-wider mb-1">
                <span>Subtotal</span>
                <span>{currency}{subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-500 mb-5">
                Tax included. Shipping calculated at checkout.
              </p>
              <button
                onClick={() => {
                  if (items.length === 0) {
                    alert('Please add items to your cart before proceeding to checkout');
                    return;
                  }
                  setDrawerOpen(false);
                  router.push('/checkout');
                }}
                className={`w-full py-4 cursor-pointer text-white text-xs font-bold tracking-widest uppercase ${items.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-brown'}`}
                disabled={items.length === 0}
              >
                CHECKOUT
              </button>
            </div>

            {/* You may also like - Carousel */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3">You May Also Like</p>
              <div className="relative">
                {/* Prev arrow */}
                <button
                  onClick={() => scroll('left')}
                  className={`absolute -left-3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-1 transition-opacity ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} className="text-primary-brown" />
                </button>

                {/* Carousel */}
                <div
                  ref={scrollRef}
                  className="flex gap-3 overflow-x-auto scroll-smooth hide-scrollbar"
                  style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  onScroll={checkScroll}
                >
                  {shuffledProducts.map((product) => (
                    <div key={product.id} data-carousel-card className="flex flex-col flex-shrink-0 border border-slate-200" style={{ width: '100%' }}>
                      <div className="flex gap-4 p-5 items-center">
                        <img src={product.image} alt={product.name} className="w-28 h-28 object-cover bg-slate-100 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-base font-medium leading-5">{product.name}</p>
                          <p className="text-lg font-semibold mt-1">{currency}{product.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => addItem({
                          id: product.id,
                          name: product.name,
                          variant: product.category,
                          price: product.price,
                          originalPrice: null,
                          qty: 1,
                          promo: null,
                          image: product.image
                        })}
                        className="w-full py-4 cursor-pointer text-white text-xs font-bold tracking-widest uppercase bg-primary-brown"
                      >
                        ADD TO BAG
                      </button>
                    </div>
                  ))}
                </div>

                {/* Next arrow */}
                <button
                  onClick={() => scroll('right')}
                  className={`absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow p-1 transition-opacity ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  aria-label="Next"
                >
                  <ChevronRight size={20} className="text-primary-brown" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}