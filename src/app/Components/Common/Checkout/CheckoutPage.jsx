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
    address: '',
    apartment: '',
    city: '',
    state: '',
    postcode: '',
    phone: '',
  });
  const [discountCode, setDiscountCode] = useState('');
  const [errors, setErrors] = useState({});
  const [saveInfo, setSaveInfo] = useState(false);

  const inputClass = (error) =>
    `w-full px-4 py-3 border rounded bg-white focus:outline-none focus:ring-2 text-sm ${
      error ? 'border-red-500 focus:ring-red-300' : 'border-slate-300 focus:ring-slate-400'
    }`;

  const errorClass = (error) =>
    `text-xs mt-1 ${error ? 'text-red-500' : 'text-transparent'}`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : name === 'postcode' ? value.replace(/\D/g, '').slice(0, 6) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
    setErrors((prev) => {
      const { [name]: removed, ...rest } = prev;
      return rest;
    });
  };

  const validateForm = () => {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!emailPattern.test(formData.email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!selectedCountry?.code) {
      nextErrors.country = 'Country/Region is required.';
    }

    if (!formData.address.trim()) {
      nextErrors.address = 'Address is required.';
    }

    if (!formData.city.trim()) {
      nextErrors.city = 'City is required.';
    }

    if (!formData.state.trim()) {
      nextErrors.state = 'State/Province is required.';
    }

    if (!formData.postcode.trim()) {
      nextErrors.postcode = 'Postcode is required.';
    } else if (!/^\d{6}$/.test(formData.postcode)) {
      nextErrors.postcode = 'Postcode must be exactly 6 numbers.';
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      nextErrors.phone = 'Phone number must be exactly 10 numbers.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstInvalidField = Object.keys(nextErrors)[0];
      const element = document.getElementById(`checkout-${firstInvalidField}`);
      if (element) element.focus();
    }

    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      // Continue to payment flow.
    }
  };

  const TAX_RATE = 0.2; // 20% VAT
  const tax = subtotal * TAX_RATE;
  const isShippingAddressComplete = Boolean(
    selectedCountry?.code &&
    formData.address.trim() &&
    formData.city.trim() &&
    formData.state.trim() &&
    /^\d{6}$/.test(formData.postcode)
  );
  const shippingSummary = isShippingAddressComplete
    ? `${formData.address}, ${formData.city}, ${formData.state} ${formData.postcode}, ${selectedCountry.name}`
    : 'Enter shipping address';

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
          <form
            className="lg:col-span-2"
            onSubmit={(e) => {
              e.preventDefault();
              handleContinue();
            }}
          >
            <div className="p-6 md:p-8 rounded-lg" style={{ backgroundColor: 'var(--background)' }}>
              {/* Contact */}
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--primary-brown)' }}>Contact</h2>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={inputClass(errors.email)}
                />
                <p id="checkout-email-error" className={errorClass(errors.email)}>
                  {errors.email}
                </p>
                <label className="flex items-center mt-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 cursor-pointer" />
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
                <label className="flex items-center mt-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveInfo}
                    onChange={(e) => setSaveInfo(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 cursor-pointer"
                  />
                  <span className="ml-2 text-sm" style={{ color: 'var(--primary-brown)' }}>Save my information for a faster checkout</span>
                </label>
                <p className="text-xs text-slate-600 mt-3">
                  By placing the order, you agree to the{' '}
                  <a href="#" className="underline cursor-pointer" style={{ color: 'var(--primary-brown)' }}>Terms and Conditions</a>{' '}
                  and{' '}
                  <a href="#" className="underline cursor-pointer" style={{ color: 'var(--primary-brown)' }}>Privacy Policy</a>.
                </p>
              </div>

              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Country/Region <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="checkout-country"
                        name="country"
                        value={selectedCountry.code}
                        onChange={(e) => {
                          const allCountries = Object.values(countriesByRegion).flat();
                          const country = allCountries.find(c => c.code === e.target.value);
                          if (country) setSelectedCountry(country);
                        }}
                        className={`${inputClass(errors.country)} appearance-none bg-white`}
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
                    <p id="checkout-country-error" className={errorClass(errors.country)}>
                      {errors.country}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      inputMode="numeric"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      maxLength={10}
                      className={inputClass(errors.phone)}
                    />
                    <p id="checkout-phone-error" className={errorClass(errors.phone)}>
                      {errors.phone}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={inputClass(errors.address)}
                  />
                  <p id="checkout-address-error" className={errorClass(errors.address)}>
                    {errors.address}
                  </p>
                </div>

                {/* Apartment (Optional) */}
                <div className="mb-4">
                  <input
                    id="checkout-apartment"
                    type="text"
                    name="apartment"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm text-slate-500"
                  />
                </div>

                {/* City, State & Postcode */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      State/Province <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="checkout-state"
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={inputClass(errors.state)}
                    />
                    <p id="checkout-state-error" className={errorClass(errors.state)}>
                      {errors.state}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="checkout-city"
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={inputClass(errors.city)}
                    />
                    <p id="checkout-city-error" className={errorClass(errors.city)}>
                      {errors.city}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Postcode <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="checkout-postcode"
                      type="text"
                      inputMode="numeric"
                      name="postcode"
                      placeholder="Postcode"
                      value={formData.postcode}
                      onChange={handleInputChange}
                      maxLength={6}
                      className={inputClass(errors.postcode)}
                    />
                    <p id="checkout-postcode-error" className={errorClass(errors.postcode)}>
                      {errors.postcode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>

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
                                className="px-2 py-1 text-sm hover:opacity-70 transition cursor-pointer"
                                style={{ color: 'var(--primary-brown)' }}
                              >
                                −
                              </button>
                              <span className="px-3 text-sm font-medium" style={{ color: 'var(--primary-brown)' }}>
                                {item.qty || 1}
                              </span>
                              <button
                                onClick={() => updateQty(item.id, 1)}
                                className="px-2 py-1 text-sm hover:opacity-70 transition cursor-pointer"
                                style={{ color: 'var(--primary-brown)' }}
                              >
                                +
                              </button>
                            </div>

                            {/* Delete Button */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-slate-400 hover:text-red-500 transition cursor-pointer"
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
                  className="flex-1 px-4 py-2 border border-slate-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
                <button
                  type="button"
                  className="px-6 py-2 text-sm font-semibold transition hover:opacity-80 cursor-pointer"
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
                  <span className="font-semibold text-right text-slate-600">{shippingSummary}</span>
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
                className="w-full mt-8 py-4 text-white text-sm font-bold tracking-widest uppercase rounded transition hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: 'var(--primary-brown)' }}
                onClick={handleContinue}
              >
                Pay now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
