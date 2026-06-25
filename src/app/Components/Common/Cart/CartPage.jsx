'use client';

import { useCart } from '@/app/context/CartContext';
import { useCountry } from '@/app/context/CountryContext';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { getStoredUser } from '@/utils/authStorage';
import Link from 'next/link';
import { getLineTotal } from '@/utils/cartUtils';
import YouMayAlsoLike from '@/app/Components/Common/YouMayAlsoLike/Page';

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal } = useCart();
  const { currency } = useCountry();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background font-sans text-primary-brown">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-light">Your Bag</h1>
          <Link href="/" className="text-xs cursor-pointer font-bold tracking-widest uppercase underline underline-offset-4">
            CONTINUE SHOPPING
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start mb-16">
          <div className="flex-1 min-w-0 w-full">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm text-slate-500 mb-4">Your bag is empty</p>
                <Link
                  href="/"
                  className="inline-block py-3 px-8 cursor-pointer text-white text-xs font-bold tracking-widest uppercase bg-primary-brown hover:opacity-90 transition-opacity"
                >
                  Return to shop
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-200">
                {items.map((item) => {
                  const qty = item.qty ?? 1;
                  const lineTotal = getLineTotal(item);
                  return (
                    <div key={item.id} className="flex gap-4 py-5">
                      <img src={item.image} alt={item.name} className="w-20 h-24 object-cover flex-shrink-0 bg-slate-100" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-5">{item.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.variant}</p>
                        {item.promo && <p className="text-xs text-slate-500 mt-1">🏷 {item.promo}</p>}
                      </div>

                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                        {item.qty !== null && (
                          <div className="flex items-center border border-slate-300 text-sm">
                            <button
                              type="button"
                              onClick={() => qty > 1 && updateQty(item.id, -1)}
                              disabled={qty <= 1}
                              className={`px-2 py-1 ${qty <= 1 ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-slate-100 cursor-pointer'}`}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="px-3 min-w-[2rem] text-center">{qty}</span>
                            <button type="button" onClick={() => updateQty(item.id, 1)} className="px-2 py-1 hover:bg-slate-100 cursor-pointer" aria-label="Increase quantity">+</button>
                          </div>
                        )}
                        <div className="text-right">
                          {item.originalPrice && (
                            <p className="text-xs text-slate-400 line-through">{currency}{(item.originalPrice * qty).toFixed(2)}</p>
                          )}
                          <p className="text-sm font-semibold">{currency}{lineTotal.toFixed(2)}</p>
                          {qty > 1 && (
                            <p className="text-xs text-slate-500">{currency}{item.price.toFixed(2)} each</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="border border-slate-200 p-5">
              <div className="flex justify-between text-sm font-bold uppercase tracking-wider mb-1">
                <span>Subtotal</span>
                <span>{currency}{subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-slate-500 mb-5">
                Tax included. Shipping calculated at checkout.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (items.length === 0) return;
                  if (!getStoredUser()) {
                    router.push('/account/login');
                    return;
                  }
                  router.push('/checkout');
                }}
                className={`w-full py-4 cursor-pointer text-white text-xs font-bold tracking-widest uppercase transition-opacity ${items.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-brown hover:opacity-90'}`}
                disabled={items.length === 0}
              >
                CHECKOUT
              </button>
            </div>
          </div>
        </div>

        <YouMayAlsoLike bordered />
      </div>
    </div>
  );
}
