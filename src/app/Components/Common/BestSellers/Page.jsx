"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

const baseProducts = [
  { id: 1, name: 'Prime Smarts', slug: 'smarts-prime', image: '/Images/Products/Smarts/prime.png', price: 55.00, rating: 4.9, reviews: 312 },
  { id: 2, name: 'Junior Smarts', slug: 'smarts-junior', image: '/Images/Products/Smarts/junior.png', price: 55.00, rating: 4.9, reviews: 312 },
  { id: 3, name: 'Dia Smarts', slug: 'smarts-dia', image: '/Images/Products/Smarts/dia.png', price: 55.00, rating: 4.9, reviews: 312 },
  { id: 4, name: 'Pink Smarts', slug: 'smarts-pink', image: '/Images/Products/Smarts/pink.png', price: 55.00, rating: 4.9, reviews: 312 },
  { id: 5, name: 'Dentabits', slug: 'bits-dentabits', image: '/Images/Products/Bits/Dentabits.png', price: 45.00, rating: 4.8, reviews: 256 },
  { id: 6, name: 'Powder', slug: 'cute-powder', image: '/Images/Products/CUTE/cutepowder.png', price: 35.00, rating: 4.6, reviews: 189 },
  { id: 7, name: 'Tablets', slug: 'cute-tablets', image: '/Images/Products/CUTE/cutetablets.png', price: 35.00, rating: 4.6, reviews: 189 },
  { id: 8, name: 'Green Apple', slug: 'pops-green-apple', image: '/Images/Products/Dollipops/Dollipop.png', price: 75.00, rating: 4.7, reviews: 347 },
  { id: 9, name: 'Mixed Berry', slug: 'pops-mixed-berry', image: '/Images/Products/Dollipops/Mixedberry.png', price: 75.00, rating: 4.7, reviews: 347 },
];

const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5 text-secondary-blue">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          fill={i <= Math.floor(rating) ? "currentColor" : i - 0.5 <= rating ? "currentColor" : "none"}
          stroke="currentColor"
        />
      ))}
    </div>
  );
}

export default function BestSellers() {
  const { addItem } = useCart();
  const scrollRef = useRef(null);
  const [products, setProducts] = useState(baseProducts);

  useEffect(() => {
    setProducts(shuffleArray(baseProducts));
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 px-4 font-sans text-primary-brown">
      <h2 className="text-center text-3xl tracking-widing mb-10">
        BEST SELLERS
      </h2>

      <div className="relative max-w-7xl mx-auto">
        {/* Prev arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-8 top-1/2 -translate-y-1/2 z-10 hover:opacity-100 transition-opacity"
          aria-label="Previous"
        >
          <ChevronLeft size={28} className="text-primary-brown" />
        </button>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 hide-scrollbar"
          style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((p) => (
            <div key={p.id} className="flex flex-col flex-shrink-0" style={{ width: 'calc(25% - 12px)' }}>
              {/* Image */}
              <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-3">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-3 flex-1">
                <p className="text-md font-bold leading-snug text-primary-brown">
                  {p.name}
                </p>
                <div className="flex items-center gap-2">
                  <Stars rating={p.rating} />
                  <span className="text-xs text-gray-500 leading-relaxed">{p.reviews} reviews</span>
                </div>
                <p className="font-semibold text-sm text-primary-brown mt-1 leading-relaxed">
                  £{p.price.toFixed(2)}
                </p>
              </div>

              {/* Button */}
              <button
                onClick={() => addItem({ id: p.id, name: p.name, variant: 'Standard', price: p.price, originalPrice: null, qty: 1, promo: null, image: p.image })}
                className="mt-3 w-full py-3 text-white text-xs tracking-widest font-semibold"
                style={{ backgroundColor: "var(--primary-brown)" }}
              >
                ADD TO BAG
              </button>
            </div>
          ))}
        </div>

        {/* Next arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-8 top-1/2 -translate-y-1/2 z-10 hover:opacity-100 transition-opacity"
          aria-label="Next"
        >
          <ChevronRight size={28} className="text-primary-brown" />
        </button>
      </div>
    </section>
  );
}
