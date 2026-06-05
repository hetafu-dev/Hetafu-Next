'use client';

import { useCart } from '@/app/context/CartContext';
import { useCountry } from '@/app/context/CountryContext';
import { useState } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, subtotal, removeItem, updateQty } = useCart();
  const { selectedCountry, setSelectedCountry, countriesByRegion, currency, currencyCode } = useCountry();
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postcode: '',
    phone: '',
  });
  const [discountCode, setDiscountCode] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const TAX_RATE = 0.2; // 20% VAT
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: 'var(--background)', fontFamily: 'var(--font-sans-family)', color: 'var(--primary-brown)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-light">Checkout</h1>
          <Link href="/cart" className="text-xs cursor-pointer font-bold tracking-widest uppercase underline underline-offset-4" style={{ color: 'var(--primary-brown)' }}>
            BACK TO BAG
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:col-span-2">
            <div className="p-6 md:p-8 rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
              {/* Contact */}
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--primary-brown)' }}>Contact</h2>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                />
                <label className="flex items-center mt-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                  <span className="ml-2 text-sm" style={{ color: 'var(--primary-brown)' }}>Email me with news and offers</span>
                </label>
                <p className="text-xs text-slate-600 mt-3">
                  By signing up I agree that you may use this personal data to send the latest deals and promotional offers. My personal data is processed in accordance with the Moroccanοil{' '}
                  <a href="#" className="underline">Privacy Policy</a>. I can unsubscribe at any time. My data may be used to improve the company's marketing efforts.
                </p>
              </div>

              {/* Delivery */}
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--primary-brown)' }}>Delivery</h2>
              </div>
              
              {/* Name Fields */}
              <div className="mb-8">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                  />
                </div>

                {/* Country Select */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Country/Region</label>
                  <div className="relative">
                    <select
                      name="country"
                      value={selectedCountry.code}
                      onChange={(e) => {
                        const allCountries = Object.values(countriesByRegion).flat();
                        const country = allCountries.find(c => c.code === e.target.value);
                        if (country) setSelectedCountry(country);
                      }}
                      className="w-full px-4 py-3 border border-slate-300 rounded appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                    >
                      {Object.entries(countriesByRegion).map(([region, countries]) => (
                        <optgroup key={region} label={region}>
                          {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400" />
                  </div>
                </div>

                {/* Address */}
                <div className="mb-4 relative">
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  </button>
                </div>

                {/* Apartment (Optional) */}
                <div className="mb-4">
                  <input
                    type="text"
                    name="apartment"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm text-slate-500"
                  />
                </div>

                {/* City, State & Postcode */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                  />
                  <input
                    type="text"
                    name="postcode"
                    placeholder="Postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                  />
                </div>

                {/* Phone */}
                <div className="mb-4 relative">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4m0-4h.01" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--primary-brown)' }}>Shipping method</h2>
                <div className="bg-[#f0ece6] p-6 rounded-lg text-center text-slate-600">
                  <p className="text-sm">Enter your shipping address to view available shipping methods.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-lg sticky top-8" style={{ backgroundColor: 'var(--background)' }}>
              <h2 className="text-lg font-bold mb-6" style={{ color: 'var(--primary-brown)' }}>Order Summary</h2>

              {/* Items */}
              <div className="mb-6 max-h-96 overflow-y-auto">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4 mb-5 pb-5" style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.3)' }}>
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-28 object-contain rounded-lg"
                          style={{ backgroundColor: '#f0ece6' }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <p className="font-semibold text-sm line-clamp-2" style={{ color: 'var(--primary-brown)' }}>{item.name}</p>
                          <p className="text-xs text-slate-500 mt-1">{item.variant}</p>
                        </div>

                        {/* Price and Qty Controls */}
                        <div className="flex items-center justify-between">
                          <div>
                            {item.originalPrice && (
                              <p className="text-xs text-slate-400 line-through">{currency}{item.originalPrice.toFixed(2)}</p>
                            )}
                            <p className="font-semibold text-sm" style={{ color: 'var(--primary-brown)' }}>{currency}{item.price.toFixed(2)}</p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border" style={{ borderColor: 'rgba(148, 163, 184, 0.5)' }}>
                              <button
                                onClick={() => updateQty(item.id, -1)}
                                className="px-2 py-1 text-sm hover:opacity-70 transition"
                                style={{ color: 'var(--primary-brown)' }}
                              >
                                −
                              </button>
                              <span className="px-3 text-sm font-medium" style={{ color: 'var(--primary-brown)' }}>
                                {item.qty || 1}
                              </span>
                              <button
                                onClick={() => updateQty(item.id, 1)}
                                className="px-2 py-1 text-sm hover:opacity-70 transition"
                                style={{ color: 'var(--primary-brown)' }}
                              >
                                +
                              </button>
                            </div>

                            {/* Delete Button */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-slate-400 hover:text-red-500 transition"
                              title="Remove item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 py-8">Your cart is empty</p>
                )}
              </div>

              {/* Discount Code */}
              <div className="mb-6 flex gap-2 py-4" style={{ borderTop: '1px solid rgba(148, 163, 184, 0.3)' }}>
                <input
                  type="text"
                  placeholder="Discount code or gift card"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
                <button
                  type="button"
                  className="px-6 py-2 text-sm font-semibold transition hover:opacity-80"
                  style={{ color: 'var(--primary-brown)' }}
                >
                  Apply
                </button>
              </div>

              {/* Totals */}
              <div className="pt-4 space-y-3" style={{ borderTop: '1px solid rgba(148, 163, 184, 0.3)' }}>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold" style={{ color: 'var(--primary-brown)' }}>{currency}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-semibold text-slate-600">Enter shipping address</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-slate-600">Tax</span>
                  <span className="font-semibold" style={{ color: 'var(--primary-brown)' }}>{currency}{(subtotal * 0.2).toFixed(2)}</span>
                </div>
                <div className="pt-4 flex justify-between text-lg font-bold" style={{ borderTop: '1px solid rgba(148, 163, 184, 0.3)' }}>
                  <span style={{ color: 'var(--primary-brown)' }}>Total</span>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 mr-1">{currencyCode}</span>
                    <span style={{ color: 'var(--primary-brown)' }}>{currency}{(subtotal * 1.2).toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Including {currency}{(subtotal * 0.2).toFixed(2)} in taxes
                </p>
              </div>

              {/* Continue Button */}
              <button
                type="button"
                className="w-full mt-8 py-4 text-white text-sm font-bold tracking-widest uppercase rounded transition hover:opacity-90"
                style={{ backgroundColor: 'var(--primary-brown)' }}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
