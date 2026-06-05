'use client';

import { useCart } from '@/app/context/CartContext';
import { useCountry } from '@/app/context/CountryContext';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import Link from 'next/link';

const SUGGESTED = {
  name: 'Scalp Massage Brush · One Size',
  price: 16,
  image: 'https://uk.moroccanoil.com/cdn/shop/files/os1.webp?v=1684219765&width=200',
};

const FREE_GIFT_THRESHOLD = 55;

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, addItem } = useCart();
  const { currency } = useCountry();
  const router = useRouter();
  const progressPct = Math.min(100, (subtotal / FREE_GIFT_THRESHOLD) * 100);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)', fontFamily: 'var(--font-sans-family)', color: 'var(--primary-brown)' }}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-light">Your Bag</h1>
          <Link href="/" className="text-xs cursor-pointer font-bold tracking-widest uppercase underline underline-offset-4">
            CONTINUE SHOPPING
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left: items */}
          <div className="flex-1 min-w-0">
            {/* Reward progress */}
            <div className="bg-[#f0ece6] rounded p-5 mb-6">
              <p className="text-center text-sm mb-2">Congratulations!</p>
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
                className="w-full py-4 cursor-pointer text-white text-xs font-bold tracking-widest uppercase"
                style={{ backgroundColor: 'var(--primary-brown)' }}
              >
                CHECKOUT
              </button>
            </div>

            {/* You may also like */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-3">You May Also Like</p>
              <div className="border border-slate-200">
                <div className="flex gap-3 p-3 items-center">
                  <img src={SUGGESTED.image} alt={SUGGESTED.name} className="w-20 h-20 object-cover bg-slate-100 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-medium leading-5">{SUGGESTED.name}</p>
                    <p className="text-sm font-semibold mt-1">{currency}{SUGGESTED.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => addItem({ id: 99, name: SUGGESTED.name, variant: 'One Size', price: SUGGESTED.price, originalPrice: null, qty: 1, promo: null, image: SUGGESTED.image })}
                  className="w-full py-3 cursor-pointer text-white text-xs font-bold tracking-widest uppercase"
                  style={{ backgroundColor: 'var(--primary-brown)' }}
                >
                  ADD TO BAG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
