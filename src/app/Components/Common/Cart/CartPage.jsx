'use client';

import { useCart } from '@/app/context/CartContext';
import { useCountry } from '@/app/context/CountryContext';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import Link from 'next/link';

// Original products from the website
const ORIGINAL_PRODUCTS = [
  {
    id: 1,
    name: "Pops Whitening Strips",
    category: "POPS",
    price: 40.00,
    description: "Professional-grade teeth whitening strips that deliver visible results in. Safe for enamel. Safe for enamel and easy to use.",
    image: "/Images/Products/Dollipops/Dollipopmockup.png",
    link: "/products/pops"
  },
  {
    id: 2,
    name: "Dentabits Whitening Bits",
    category: "BITS",
    price: 45.00,
    description: "Revolutionary dissolvable whitening bits that transform your oral care routine. Eco-friendly and perfect for travel.",
    image: "/Images/Products/CUTE/cutemouthwash1.png",
    link: "/products/bits"
  },
  {
    id: 3,
    name: "Cute Mouthwash",
    category: "CUTE",
    price: 35.00,
    description: "Gentle, alcohol-free family-friendly mouthwash that keeps breath fresh all day. Kid-safe and made with natural ingredients.",
    image: "/Images/Products/CUTE/cutepowder.png",
    link: "/products/cute"
  },
  {
    id: 4,
    name: "Denta Smarts Serum",
    category: "SMARTS",
    price: 55.00,
    description: "Advanced nanotechnology enamel protection serum that repairs and strengthens weakened tooth enamel. Dentist-formulated.",
    image: "/Images/Products/Smarts/Prime.png",
    link: "/products/smarts"
  }
];

const FREE_GIFT_THRESHOLD = 599; // Updated for Indian pricing

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, addItem } = useCart();
  const { currency } = useCountry();
  const router = useRouter();
  const progressPct = Math.min(100, (subtotal / FREE_GIFT_THRESHOLD) * 100);

  return (
    <div className="min-h-screen bg-background font-sans text-primary-brown">
      <div className="max-w-6xl mx-auto px-4 py-10">
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
          </div>

          {/* Right: sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="border border-slate-200 p-5 mb-4">
              <div className="flex justify-between text-sm font-bold uppercase tracking-wider mb-1">
                <span>Subtotal</span>
                <span>{currency}{subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-500 mb-5">
                Tax included. Shipping calculated at checkout.
              </p>
              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-4 cursor-pointer text-white text-xs font-bold tracking-widest uppercase bg-primary-brown"
              >
                CHECKOUT
              </button>
            </div>

            {/* You may also like */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3">You May Also Like</p>
              {/* Show first available original product not in cart */}
              {ORIGINAL_PRODUCTS.filter(p => !items.find(item => item.id === p.id)).slice(0, 1).map((product) => (
                <div key={product.id} className="border border-slate-200">
                  <div className="flex gap-3 p-3 items-center">
                    <img src={product.image} alt={product.name} className="w-20 h-20 object-cover bg-slate-100 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium leading-5">{product.name}</p>
                      <p className="text-sm font-semibold mt-1">{currency}{product.price.toFixed(2)}</p>
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
                    className="w-full py-3 cursor-pointer text-white text-xs font-bold tracking-widest uppercase bg-primary-brown"
                  >
                    ADD TO BAG
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}