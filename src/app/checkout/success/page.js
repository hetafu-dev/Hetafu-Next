'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/app/Components/Common/Navbar/Page';
import Footer from '@/app/Components/Common/Footer/Page';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');
  const paymentMethod = searchParams.get('method');
  const prepaid = searchParams.get('prepaid');
  const balance = searchParams.get('balance');

  return (
    <div
      className="max-w-xl mx-auto px-4 py-16 text-center"
      style={{ color: 'var(--primary-brown)' }}
    >
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-2xl">
        ✓
      </div>
      <h1 className="text-2xl font-light mb-3">Thank you for your order!</h1>
      {orderNumber ? (
        <p className="text-sm text-slate-600 mb-2">
          Order number: <span className="font-semibold text-primary-brown">{orderNumber}</span>
        </p>
      ) : (
        <p className="text-sm text-slate-600 mb-2">Your order has been placed successfully.</p>
      )}
      {paymentMethod === 'cod' && (
        <p className="text-sm text-slate-600 mb-8">
          Your Cash on Delivery order is confirmed
          {prepaid ? ` with ₹${prepaid} paid online` : ''}.
          {balance ? ` Please keep ₹${balance} ready in cash when your order arrives.` : ' Please keep the remaining balance ready in cash on delivery.'}
        </p>
      )}
      {paymentMethod === 'online' && (
        <p className="text-sm text-slate-600 mb-8">
          Your online payment was successful. We&apos;ll send updates to your email.
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/account"
          className="px-6 py-3 border border-primary-brown text-primary-brown text-xs font-bold tracking-widest uppercase hover:bg-primary-brown hover:text-white transition"
        >
          View orders & review
        </Link>
        <Link
          href="/track-order"
          className="px-6 py-3 border border-primary-brown text-primary-brown text-xs font-bold tracking-widest uppercase hover:bg-primary-brown hover:text-white transition"
        >
          Track order
        </Link>
        <Link
          href="/"
          className="px-6 py-3 bg-primary-brown text-white text-xs font-bold tracking-widest uppercase hover:opacity-90 transition"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="py-20 text-center text-primary-brown">Loading...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
