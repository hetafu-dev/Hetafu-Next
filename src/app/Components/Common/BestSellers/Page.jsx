"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

const products = [
  {
    id: 1,
    name: "Dollipop",
    reviews: 31,
    rating: 5,
    price: "₹86",
    image: "/Images/Products/Dollipops/Dollipop.png",
  },
  {
    id: 2,
    name: "Denta Smarts",
    reviews: 1997,
    rating: 4.5,
    price: "₹76",
    priceNote: "₹126.67/100ml",
    sizes: ["60ML", "10ML"],
    image: "/Images/Products/Smarts/Prime.png",
  },
  {
    id: 3,
    name: "Cute Mouthwash Powder",
    reviews: 25,
    rating: 4.5,
    price: "₹38",
    image: "/Images/Products/CUTE/cutepowder.png",
  },
  {
    id: 4,
    name: "CUTE Bits",
    reviews: 701,
    rating: 5,
    price: "₹18.50",
    priceNote: "₹7.40/100ml",
    image: "/Images/Products/CUTE/cutebits.png",
  },
  {
    id: 5,
    name: "Dentabits",
    reviews: 142,
    rating: 4,
    price: "₹45",
    image: "/Images/Products/Bits/Bits.png",
  },
];

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
  const [start, setStart] = useState(0);
  const { addItem } = useCart();
  const visible = 4;

  const prev = () => setStart((s) => Math.max(0, s - 1));
  const next = () => setStart((s) => Math.min(products.length - visible, s + 1));

  const shown = products.slice(start, start + visible);

  return (
    <section className="py-12 px-4 font-sans text-primary-brown">
      <h2
        className="text-center text-3xl tracking-widing mb-10"
      >
        BEST SELLERS
      </h2>

      <div className="relative max-w-7xl mx-auto">
        {/* Prev arrow */}
        <button
          onClick={prev}
          disabled={start === 0}
          className="absolute -left-8 top-1/2 -translate-y-1/2 z-10 disabled:opacity-20"
          aria-label="Previous"
        >
          <ChevronLeft size={28} className="text-primary-brown" />
        </button>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {shown.map((p) => (
            <div key={p.id} className="flex flex-col">
              {/* Image */}
              <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="pt-3 flex flex-col gap-1 flex-1">
                <p
                  className="text-sm font-medium leading-snug text-secondary-blue"
                >
                  {p.name}
                </p>
                <div className="flex items-center gap-2">
                  <Stars rating={p.rating} />
                  <span className="text-xs text-gray-500">{p.reviews} reviews</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-sm text-primary-brown">
                    {p.price}
                  </span>
                  {p.priceNote && (
                    <span className="text-xs text-gray-500">{p.priceNote}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400">Including VAT, excluding <span className="underline cursor-pointer">shipping</span></p>
                {p.sizes && (
                  <div className="flex gap-2 mt-1">
                    {p.sizes.map((s) => (
                      <span key={s} className="text-xs border-b border-current cursor-pointer" style={{ color: "var(--primary-brown)" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Button */}
              <button
                onClick={() => addItem({ id: p.id, name: p.name, variant: p.sizes?.[0] ?? 'Standard', price: parseFloat(p.price.replace('₹', '')), originalPrice: null, qty: 1, promo: null, image: p.image })}
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
          onClick={next}
          disabled={start >= products.length - visible}
          className="absolute -right-8 top-1/2 -translate-y-1/2 z-10 disabled:opacity-20"
          aria-label="Next"
        >
          <ChevronRight size={28} className="text-primary-brown" />
        </button>
      </div>
    </section>
  );
}
