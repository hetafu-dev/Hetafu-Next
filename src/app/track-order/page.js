'use client';

import { useState } from 'react';
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";

export default function TrackOrderPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [error, setError] = useState('');

  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }
    // Simulate tracking - in a real app this would call an API
    setTrackedOrder({
      trackingNumber: trackingNumber,
      status: 'In Transit',
      estimatedDelivery: '2-3 business days',
      carrier: 'DTDC'
    });
    setError('');
  };

  return (
    <div className="flex flex-col bg-background">
      <Navbar />
      <main>
        <div className="bg-background text-primary-brown font-sans py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-light text-center mb-8 md:mb-12 text-slate-950">Track Your Order</h1>
            <div className="prose prose-slate max-w-none">
              <p className="text-sm leading-7 text-slate-600 mb-8">
                Enter your tracking number to check the status of your order. You can find your tracking number in the shipment confirmation email you received, or in your account under order history.
              </p>

              <form onSubmit={handleTrackOrder} className="mb-12">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter your tracking number"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-blue"
                  />
                  <button
                    type="submit"
                    className="px-8 py-3 bg-secondary-blue text-white font-bold uppercase tracking-wider rounded-lg hover:bg-secondary-blue/90 transition-colors"
                  >
                    Track Order
                  </button>
                </div>
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              </form>

              {trackedOrder && (
                <div className="bg-slate-50 p-8 rounded-lg mb-8">
                  <h2 className="text-2xl font-medium text-slate-950 mb-6">Order Tracking Information</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-slate-200 pb-4">
                      <span className="font-medium">Tracking Number:</span>
                      <span className="text-slate-600">{trackedOrder.trackingNumber}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-4">
                      <span className="font-medium">Carrier:</span>
                      <span className="text-slate-600">{trackedOrder.carrier}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-4">
                      <span className="font-medium">Status:</span>
                      <span className="text-green-600 font-semibold">{trackedOrder.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Estimated Delivery:</span>
                      <span className="text-slate-600">{trackedOrder.estimatedDelivery}</span>
                    </div>
                  </div>
                  <a
                    href="https://www.dtdc.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-6 px-6 py-3 border-2 border-secondary-blue text-secondary-blue font-bold uppercase tracking-wider rounded-lg hover:bg-secondary-blue hover:text-white transition-colors"
                  >
                    Track on DTDC Website
                  </a>
                </div>
              )}

              <h3 className="text-xl font-medium text-slate-900 mb-4">Need help with tracking?</h3>
              <p className="text-sm leading-7 text-slate-600 mb-4">
                If you're having trouble tracking your order, please contact our customer service team:
              </p>
              <ul className="text-sm leading-7 text-slate-600 list-disc pl-6">
                <li>Email: <a href="mailto:reachthebest@hetafu.com" className="text-blue-500">reachthebest@hetafu.com</a></li>
                <li>Phone: <a href="tel:+919876543210" className="text-blue-500">+91 98765 43210</a> (Mon-Sat, 9:00 AM - 6:00 PM IST)</li>
                <li>Check your order confirmation email for your tracking number</li>
                <li>Track your order directly on <a href="https://www.dtdc.com" target="_blank" rel="noopener noreferrer" className="underline">DTDC's website</a></li>
              </ul>
            </div>
          </div>
        </div>
        <BestSellers />
      </main>
      <Footer />
    </div>
  );
}