'use client';

import { useCart } from '@/app/context/CartContext';
import { useCountry } from '@/app/context/CountryContext';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

export default function CartDrawer() {
  const { items, removeItem, subtotal, itemCount, drawerOpen, setDrawerOpen } = useCart();
  const { currency } = useCountry();
  const router = useRouter();

  if (!drawerOpen) return null;

  const FREE_GIFT_THRESHOLD = 55;
  const progressPct = Math.min(100, (subtotal / FREE_GIFT_THRESHOLD) * 100);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl"
        style={{ fontFamily: 'var(--font-sans-family)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <button onClick={() => setDrawerOpen(false)}>
            <X size={20} />
          </button>
          <span className="text-sm font-bold tracking-widest uppercase">Your Bag</span>
          <span className="text-sm text-slate-500">{itemCount} items</span>
        </div>

        {/* Reward progress */}
        <div className="mx-4 my-3 bg-[#f0ece6] rounded p-4">
          <p className="text-center text-sm mb-2">Congratulations!</p>
          <div className="text-center text-sm font-semibold mb-1">{currency}{FREE_GIFT_THRESHOLD}</div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-slate-800 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="text-center text-xs mt-1 text-slate-500">Free gift</p>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 divide-y divide-slate-200">
          {items.map((item) => (
            <div key={item.id} className="py-4">
              <div className="flex gap-3">
                <img src={item.image} alt={item.name} className="w-20 h-24 object-cover flex-shrink-0 bg-slate-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium leading-5">{item.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.variant}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {item.originalPrice && (
                      <span className="text-xs text-slate-400 line-through">{currency}{item.originalPrice.toFixed(2)}</span>
                    )}
                    <span className="text-xs font-semibold">{currency}{item.price.toFixed(2)}</span>
                  </div>
                  {item.promo && (
                    <p className="text-xs text-slate-500 mt-1">🏷 {item.promo}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-slate-700">
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-4 pb-6 pt-4">
          <div className="flex justify-between text-sm font-bold uppercase tracking-wider mb-1">
            <span>Subtotal</span>
            <span>{currency}{subtotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Including VAT, excluding <span className="underline">shipping</span>.
          </p>
          <button
            onClick={() => {
              setDrawerOpen(false);
              router.push('/checkout');
            }}
            className="w-full py-4 cursor-pointer text-white text-xs font-bold tracking-widest uppercase mb-3"
            style={{ backgroundColor: 'var(--primary-brown)' }}
          >
            CHECKOUT
          </button>
          <button
            className="w-full cursor-pointer text-xs font-bold tracking-widest uppercase underline underline-offset-4"
            style={{ color: 'var(--primary-brown)' }}
            onClick={() => { setDrawerOpen(false); router.push('/cart'); }}
          >
            VIEW BAG
          </button>
        </div>
      </div>
    </>
  );
}
