'use client';

import { useCart } from '@/app/context/CartContext';
import { useCountry } from '@/app/context/CountryContext';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Banknote, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/services/apiClient';
import { fetchCheckoutQuote, placeEcommerceOrder, verifyEcommercePayment } from '@/services/orderService';
import { getStoredUser, clearAuthStorage } from '@/utils/authStorage';
import { getLineTotal, isMongoObjectId } from '@/utils/cartUtils';
import { openRazorpayCheckout } from '@/utils/razorpayCheckout';

const COUNTRIES = [
  { name: 'United Kingdom', provinces: ['British Forces', 'England', 'Scotland', 'Wales', 'Northern Ireland'] },
  {
    name: 'India',
    provinces: [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
      'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
      'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
      'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    ],
  },
];

const EMPTY_ADDRESS_FORM = {
  first_name: '',
  last_name: '',
  address1: '',
  address2: '',
  city: '',
  country: 'India',
  province: '',
  postal_code: '',
  phone: '',
  is_default: false,
};

const COD_PREPAYMENT_AMOUNT = 99;
const PAYMENT_CURRENCY = '₹';

function formatInr(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return `${PAYMENT_CURRENCY}0.00`;
  return `${PAYMENT_CURRENCY}${value.toFixed(2)}`;
}

const PAYMENT_OPTIONS = [
  {
    id: 'cod',
    label: 'Cash on Delivery',
    description: `Pay ₹${COD_PREPAYMENT_AMOUNT} now online to confirm. Pay the remaining balance in cash on delivery.`,
    icon: Banknote,
  },
  {
    id: 'online',
    label: 'Pay Online',
    description: 'Credit / debit card, UPI, net banking & wallets via Razorpay.',
    icon: CreditCard,
  },
];

function buildCheckoutLineItems(items) {
  return items
    .filter((item) => isMongoObjectId(item.productId))
    .map((item) => ({
      product_id: item.productId,
      quantity: item.qty || 1,
      unit_price: Number(item.price) > 0 ? Number(item.price) : undefined,
      pack_id: item.packId || null,
      variant_label: item.variant || null,
    }));
}

function buildOrderPayload({ email, activeShippingAddress, items, paymentMethod, customerId }) {
  const orderItems = buildCheckoutLineItems(items);

  const addressLine = [activeShippingAddress.address1, activeShippingAddress.address2]
    .filter(Boolean)
    .join(', ');

  return {
    first_name: activeShippingAddress.first_name || '',
    last_name: activeShippingAddress.last_name || '',
    email: email.trim(),
    phone: activeShippingAddress.phone,
    address: addressLine,
    city: activeShippingAddress.city,
    state: activeShippingAddress.province,
    zip_code: activeShippingAddress.postal_code,
    country: activeShippingAddress.country || 'India',
    items: orderItems,
    payment_method: paymentMethod,
    hetafu_customer_id: customerId || null,
  };
}

function formatAddress(address) {
  if (!address) return '';
  const line1 = [address.first_name, address.last_name].filter(Boolean).join(' ');
  const line2 = [address.address1, address.address2].filter(Boolean).join(', ');
  const line3 = [address.city, address.province, address.postal_code].filter(Boolean).join(', ');
  return [line1, line2, line3, address.country, address.phone].filter(Boolean).join('\n');
}

export default function CheckoutPage() {
  const { items, subtotal, updateQty, clearCart } = useCart();
  const { currency, currencyCode } = useCountry();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS_FORM);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [submittingAddress, setSubmittingAddress] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [errors, setErrors] = useState({});
  const [checkoutStep, setCheckoutStep] = useState('shipping');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [customerId, setCustomerId] = useState(null);
  const [serverQuote, setServerQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(false);

  const TAX_RATE = 0.05;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const codDueNow = serverQuote?.cod_prepaid_amount ?? COD_PREPAYMENT_AMOUNT;
  const codBalanceOnDelivery = serverQuote?.balance_on_delivery ?? Math.max(total - COD_PREPAYMENT_AMOUNT, 0);
  const displaySubtotal = serverQuote?.subtotal ?? subtotal;
  const displayTax = serverQuote?.tax_amount ?? tax;
  const displayTotal = serverQuote?.total_amount ?? total;
  const displayPayNow = serverQuote?.amount_due_now ?? (paymentMethod === 'cod' ? codDueNow : total);

  const selectedSavedAddress = useMemo(
    () => savedAddresses.find((a) => a.id === selectedAddressId) || null,
    [savedAddresses, selectedAddressId],
  );

  const activeShippingAddress = useMemo(() => {
    if (!useNewAddress && selectedSavedAddress) return selectedSavedAddress;
    if (
      useNewAddress &&
      addressForm.address1.trim() &&
      addressForm.city.trim() &&
      addressForm.province.trim() &&
      addressForm.postal_code.trim()
    ) {
      return addressForm;
    }
    return null;
  }, [useNewAddress, selectedSavedAddress, addressForm]);

  const shippingSummary = activeShippingAddress
    ? formatAddress(activeShippingAddress).replace(/\n/g, ', ')
    : 'Enter shipping address here';

  const provinces = COUNTRIES.find((c) => c.name === addressForm.country)?.provinces || [];

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      router.push('/account/login');
      return;
    }

    setEmail(user.email || '');
    setCustomerId(user.id || user._id || null);
    setAddressForm((prev) => ({
      ...prev,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
    }));

    fetchAddresses();

    const handleTokenExpired = () => {
      clearAuthStorage();
      router.push('/account/login');
    };
    window?.addEventListener('auth:expired', handleTokenExpired);
    return () => window?.removeEventListener('auth:expired', handleTokenExpired);
  }, [router]);

  useEffect(() => {
    if (checkoutStep !== 'payment' || items.length === 0) {
      setServerQuote(null);
      return undefined;
    }

    const quoteItems = buildCheckoutLineItems(items);

    if (!quoteItems.length) {
      setServerQuote(null);
      return undefined;
    }

    let cancelled = false;
    setLoadingQuote(true);

    fetchCheckoutQuote({ items: quoteItems, paymentMethod })
      .then((quote) => {
        if (!cancelled) setServerQuote(quote);
      })
      .catch(() => {
        if (!cancelled) setServerQuote(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingQuote(false);
      });

    return () => {
      cancelled = true;
    };
  }, [checkoutStep, paymentMethod, items]);

  const fetchAddresses = async () => {
    try {
      const response = await apiClient.get('/customer/addresses');
      const list = response.addresses || [];
      setSavedAddresses(list);

      const defaultAddress = list.find((a) => a.is_default) || list[0];
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
        setUseNewAddress(false);
      } else {
        setUseNewAddress(true);
      }
    } catch (error) {
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        clearAuthStorage();
        router.push('/account/login');
      }
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const validateCheckout = () => {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!emailPattern.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!activeShippingAddress) {
      nextErrors.address = 'Please select or add a shipping address.';
    }

    if (useNewAddress) {
      if (!addressForm.address1.trim()) nextErrors.address1 = 'Address is required.';
      if (!addressForm.city.trim()) nextErrors.city = 'City is required.';
      if (!addressForm.province.trim()) nextErrors.province = 'Province is required.';
      if (!addressForm.postal_code.trim()) nextErrors.postal_code = 'Postal code is required.';
      if (!addressForm.phone.trim()) nextErrors.phone = 'Phone is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.address1.trim() || !addressForm.city.trim() || !addressForm.province.trim() || !addressForm.postal_code.trim() || !addressForm.phone.trim()) {
      setErrors({
        address1: !addressForm.address1.trim() ? 'Address is required.' : undefined,
        city: !addressForm.city.trim() ? 'City is required.' : undefined,
        province: !addressForm.province.trim() ? 'Province is required.' : undefined,
        postal_code: !addressForm.postal_code.trim() ? 'Postal code is required.' : undefined,
        phone: !addressForm.phone.trim() ? 'Phone is required.' : undefined,
      });
      return;
    }

    setSubmittingAddress(true);
    try {
      const response = await apiClient.post('/customer/addresses', {
        first_name: addressForm.first_name,
        last_name: addressForm.last_name,
        address1: addressForm.address1,
        address2: addressForm.address2,
        city: addressForm.city,
        country: addressForm.country,
        province: addressForm.province,
        postal_code: addressForm.postal_code,
        phone: addressForm.phone,
        is_default: addressForm.is_default,
      });
      await fetchAddresses();
      const newId = response?.address?.id || response?.id;
      if (newId) {
        setSelectedAddressId(newId);
        setUseNewAddress(false);
      }
    } catch (error) {
      if (error.message?.includes('401')) router.push('/account/login');
    } finally {
      setSubmittingAddress(false);
    }
  };

  const handleContinueToPayment = () => {
    setOrderError('');
    if (!validateCheckout()) return;
    if (items.length === 0) {
      setOrderError('Your cart is empty.');
      return;
    }
    const invalidItems = items.filter((item) => !isMongoObjectId(item.productId));
    if (invalidItems.length > 0) {
      setOrderError('Some items in your cart cannot be checked out. Please remove them and try again.');
      return;
    }
    setCheckoutStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setOrderError('');
    if (!validateCheckout()) {
      setCheckoutStep('shipping');
      return;
    }
    if (items.length === 0) {
      setOrderError('Your cart is empty.');
      return;
    }

    const orderPayload = buildOrderPayload({
      email,
      activeShippingAddress,
      items,
      paymentMethod,
      customerId,
    });

    if (!orderPayload.items.length) {
      setOrderError('No valid products in your cart.');
      return;
    }

    setPlacingOrder(true);
    try {
      const initiateResponse = await placeEcommerceOrder(orderPayload);

      if (!initiateResponse.razorpay_order_id || !initiateResponse.razorpay_key) {
        throw new Error(
          paymentMethod === 'cod'
            ? 'Could not start ₹99 COD advance payment. Please try again or choose Pay Online.'
            : 'Online payment could not be started. Please try again or choose Cash on Delivery.',
        );
      }

      const payNowAmount = initiateResponse.amount_due_now;
      const customerName = `${orderPayload.first_name} ${orderPayload.last_name}`.trim();
      const paymentResult = await openRazorpayCheckout({
        key: initiateResponse.razorpay_key,
        orderId: initiateResponse.razorpay_order_id,
        name: customerName,
        email: orderPayload.email,
        phone: orderPayload.phone,
        description:
          paymentMethod === 'cod'
            ? `COD advance ${formatInr(payNowAmount)} — Order ${initiateResponse.order_number}`
            : `Pay ${formatInr(payNowAmount)} — Order ${initiateResponse.order_number}`,
      });

      const verifyResponse = await verifyEcommercePayment({
        orderData: {
          ...orderPayload,
          order_number: initiateResponse.order_number,
        },
        razorpayPaymentId: paymentResult.razorpay_payment_id,
        razorpayOrderId: paymentResult.razorpay_order_id,
        razorpaySignature: paymentResult.razorpay_signature,
      });

      if (!verifyResponse.success) {
        throw new Error(verifyResponse.message || 'Payment verification failed.');
      }

      await clearCart();
      router.push(
        `/checkout/success?order=${encodeURIComponent(verifyResponse.order_number)}&method=${paymentMethod}${
          paymentMethod === 'cod'
            ? `&prepaid=${payNowAmount}&balance=${(initiateResponse.balance_on_delivery ?? codBalanceOnDelivery).toFixed(2)}`
            : ''
        }`,
      );
    } catch (error) {
      const message = error?.message || 'Unable to complete checkout. Please try again.';
      if (message.toLowerCase().includes('payment cancelled')) {
        setOrderError('Payment was cancelled. You can try again or choose Cash on Delivery.');
      } else {
        setOrderError(message);
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  const inputClass = (error) =>
    `w-full border-b-2 border-primary-brown bg-transparent py-2 text-sm focus:outline-none ${error ? 'border-red-500' : ''}`;

  if (loadingAddresses) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-primary-brown">
        Loading checkout...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: 'var(--background)', fontFamily: 'var(--font-sans-family)', color: 'var(--primary-brown)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-light">Checkout</h1>
          <Link
            href="/cart"
            className="text-xs cursor-pointer font-bold tracking-widest uppercase underline underline-offset-4"
            style={{ color: 'var(--primary-brown)' }}
          >
            BACK TO BAG
          </Link>
        </div>

        <div className="flex items-center justify-center gap-0 mb-10 max-w-md mx-auto">
          {[
            { id: 'shipping', step: 1, label: 'Shipping' },
            { id: 'payment', step: 2, label: 'Payment' },
          ].map(({ id, step, label }, index) => {
            const isActive = checkoutStep === id;
            const isCompleted = checkoutStep === 'payment' && id === 'shipping';
            return (
              <div key={id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2 min-w-[72px]">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                      isActive
                        ? 'bg-primary-brown border-primary-brown text-white'
                        : isCompleted
                          ? 'bg-primary-brown/10 border-primary-brown text-primary-brown'
                          : 'bg-white border-slate-300 text-slate-400'
                    }`}
                  >
                    {step}
                  </div>
                  <span
                    className={`text-xs font-bold tracking-widest uppercase ${
                      isActive || isCompleted ? 'text-primary-brown' : 'text-slate-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {index === 0 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 mb-6 transition-colors ${
                      checkoutStep === 'payment' ? 'bg-primary-brown' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left — step content */}
          <div className="space-y-8">
            {checkoutStep === 'shipping' && (
              <>
            {/* Contact */}
            <section className="p-6 md:p-8 rounded-lg border border-slate-200">
              <h2 className="text-lg font-bold mb-4">Contact</h2>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="checkout-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="Email"
                className={inputClass(errors.email)}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </section>

            {/* Delivery */}
            <section className="p-6 md:p-8 rounded-lg border border-slate-200">
              <h2 className="text-lg font-bold mb-4">Delivery</h2>

              {savedAddresses.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold tracking-widest uppercase mb-3">Saved addresses</p>
                  <div className="space-y-3">
                    {savedAddresses.map((address) => (
                      <label
                        key={address.id}
                        className={`block border rounded-lg p-4 cursor-pointer transition ${
                          !useNewAddress && selectedAddressId === address.id
                            ? 'border-secondary-blue bg-secondary-blue/5'
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="saved-address"
                          className="sr-only"
                          checked={!useNewAddress && selectedAddressId === address.id}
                          onChange={() => {
                            setSelectedAddressId(address.id);
                            setUseNewAddress(false);
                            setErrors((prev) => ({ ...prev, address: undefined }));
                          }}
                        />
                        <p className="font-semibold text-sm">{address.first_name} {address.last_name}</p>
                        {address.is_default && (
                          <span className="text-xs font-semibold bg-yellow-100 inline-block px-2 py-0.5 rounded-full mt-1">DEFAULT</span>
                        )}
                        <p className="text-sm text-slate-600 mt-2 whitespace-pre-line">{formatAddress(address)}</p>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input
                  type="radio"
                  name="address-mode"
                  checked={useNewAddress}
                  onChange={() => setUseNewAddress(true)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Add a new address</span>
              </label>

              {useNewAddress && (
                <form onSubmit={handleSaveNewAddress} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase mb-2">First Name</label>
                      <input type="text" name="first_name" value={addressForm.first_name} readOnly className={inputClass()} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase mb-2">Last Name</label>
                      <input type="text" name="last_name" value={addressForm.last_name} readOnly className={inputClass()} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">
                      Address 1 <span className="text-red-500">*</span>
                    </label>
                    <input type="text" name="address1" value={addressForm.address1} onChange={handleAddressInputChange} placeholder="Address 1" className={inputClass(errors.address1)} required />
                    {errors.address1 && <p className="text-xs text-red-500 mt-1">{errors.address1}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">
                      Address 2 <span className="text-slate-400 normal-case">(optional)</span>
                    </label>
                    <input type="text" name="address2" value={addressForm.address2} onChange={handleAddressInputChange} placeholder="Address 2 (optional)" className={inputClass()} />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">City</label>
                    <input type="text" name="city" value={addressForm.city} onChange={handleAddressInputChange} placeholder="City" className={inputClass(errors.city)} required />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">Country/region</label>
                    <div className="relative">
                      <select name="country" value={addressForm.country} onChange={handleAddressInputChange} className={`${inputClass()} appearance-none pr-8`}>
                        {COUNTRIES.map((c) => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">Province</label>
                    <div className="relative">
                      <select name="province" value={addressForm.province} onChange={handleAddressInputChange} className={`${inputClass(errors.province)} appearance-none pr-8`} required>
                        <option value="">Select province</option>
                        {provinces.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {errors.province && <p className="text-xs text-red-500 mt-1">{errors.province}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">Postal/ZIP Code</label>
                    <input type="text" name="postal_code" value={addressForm.postal_code} onChange={handleAddressInputChange} placeholder="Postal/ZIP code" className={inputClass(errors.postal_code)} required />
                    {errors.postal_code && <p className="text-xs text-red-500 mt-1">{errors.postal_code}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">Phone</label>
                    <input type="tel" name="phone" value={addressForm.phone} onChange={handleAddressInputChange} placeholder="Phone" className={inputClass(errors.phone)} required />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <label className="flex items-center gap-3 text-sm">
                    <input type="checkbox" name="is_default" checked={addressForm.is_default} onChange={handleAddressInputChange} className="w-4 h-4" />
                    Set as default address
                  </label>

                  <button
                    type="submit"
                    disabled={submittingAddress}
                    className="w-full py-4 bg-primary-brown text-white font-bold tracking-widest uppercase text-sm hover:opacity-90 transition disabled:opacity-50"
                  >
                    {submittingAddress ? 'Saving...' : 'Save & use this address'}
                  </button>
                </form>
              )}

              {errors.address && <p className="text-xs text-red-500 mt-4">{errors.address}</p>}
            </section>
              </>
            )}

            {checkoutStep === 'payment' && (
              <section className="p-6 md:p-8 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Payment</h2>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('shipping')}
                    className="text-xs font-bold tracking-widest uppercase underline underline-offset-4 cursor-pointer"
                  >
                    Edit shipping
                  </button>
                </div>
                <p className="text-sm text-slate-600 mb-5">Choose how you would like to pay for your order.</p>
                <div className="space-y-3">
                  {PAYMENT_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const selected = paymentMethod === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`flex items-start gap-4 border rounded-lg p-4 cursor-pointer transition ${
                          selected
                            ? 'border-secondary-blue bg-secondary-blue/5'
                            : 'border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment-method"
                          className="mt-1"
                          checked={selected}
                          onChange={() => setPaymentMethod(option.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon size={18} />
                            <span className="font-semibold text-sm">{option.label}</span>
                          </div>
                          <p className="text-sm text-slate-600">{option.description}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {paymentMethod === 'online' && (
                  <p className="text-xs text-slate-500 mt-4">
                    You will pay {formatInr(displayPayNow)} via Razorpay secure checkout (card, UPI, net banking, and wallets).
                  </p>
                )}
                {paymentMethod === 'cod' && (
                  <p className="text-xs text-slate-500 mt-4">
                    Pay {formatInr(displayPayNow)} now via Razorpay to confirm your COD order.
                    The remaining {formatInr(codBalanceOnDelivery)} is payable in cash on delivery.
                  </p>
                )}
                <p className="text-xs text-slate-500 mt-3 border-t border-slate-100 pt-3">
                  All payments are processed in Indian Rupees (INR) via Razorpay.
                  {loadingQuote && checkoutStep === 'payment' ? ' Calculating final amount…' : null}
                </p>
              </section>
            )}
          </div>

          {/* Right — Order Summary */}
          <div className="p-6 md:p-8 rounded-lg border border-slate-200 lg:sticky lg:top-8">
            <h2 className="text-lg font-bold mb-6">Order Summary</h2>

            <div className="mb-6 max-h-96 overflow-y-auto">
              {items.length > 0 ? (
                items.map((item) => {
                  const qty = item.qty || 1;
                  const lineTotal = getLineTotal(item);
                  return (
                  <div key={item.id} className="flex gap-4 mb-5 pb-5 border-b border-slate-200 last:border-0">
                    <img src={item.image} alt={item.name} className="w-20 h-24 object-contain rounded-lg bg-[#f0ece6] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm line-clamp-2">{item.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.variant}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div>
                          {item.originalPrice && (
                            <p className="text-xs text-slate-400 line-through">{currency}{(item.originalPrice * qty).toFixed(2)}</p>
                          )}
                          <p className="font-semibold text-sm">{currency}{lineTotal.toFixed(2)}</p>
                          {qty > 1 && (
                            <p className="text-xs text-slate-500">{currency}{item.price.toFixed(2)} each</p>
                          )}
                        </div>
                        <div className="flex items-center border border-slate-300">
                          <button
                            type="button"
                            onClick={() => qty > 1 && updateQty(item.id, -1)}
                            disabled={qty <= 1}
                            className={`px-2 py-1 text-sm ${qty <= 1 ? 'text-slate-300 cursor-not-allowed' : 'hover:opacity-70 cursor-pointer'}`}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="px-3 text-sm font-medium">{qty}</span>
                          <button type="button" onClick={() => updateQty(item.id, 1)} className="px-2 py-1 text-sm hover:opacity-70 cursor-pointer">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })
              ) : (
                <p className="text-center text-slate-500 py-8">Your cart is empty</p>
              )}
            </div>

            <div className="mb-6 flex gap-2 py-4 border-t border-slate-200">
              <input
                type="text"
                placeholder="Discount code or gift card"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <button type="button" className="px-6 py-2 text-sm font-semibold hover:opacity-80 cursor-pointer">Apply</button>
            </div>

            <div className="pt-4 space-y-3 border-t border-slate-200">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-semibold">
                  {checkoutStep === 'payment' ? formatInr(displaySubtotal) : `${currency}${subtotal.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm gap-4">
                <span className="text-slate-600 flex-shrink-0">Shipping</span>
                <span className="font-semibold text-right text-slate-600 text-xs leading-relaxed">{shippingSummary}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Tax (5% GST)</span>
                <span className="font-semibold">
                  {checkoutStep === 'payment' ? formatInr(displayTax) : `${currency}${tax.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-4 flex justify-between text-lg font-bold border-t border-slate-200">
                <span>Total</span>
                <div className="text-right">
                  {checkoutStep === 'payment' ? (
                    <>
                      <span className="text-xs text-slate-500 mr-1">INR</span>
                      <span>{formatInr(displayTotal)}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-slate-500 mr-1">{currencyCode}</span>
                      <span>{currency}{total.toFixed(2)}</span>
                    </>
                  )}
                </div>
              </div>
              {checkoutStep === 'payment' && (
                <div className="rounded-lg bg-secondary-blue/5 border border-secondary-blue/20 px-4 py-3 space-y-2">
                  <div className="flex justify-between text-sm font-semibold text-secondary-blue">
                    <span>Pay now via Razorpay</span>
                    <span>{formatInr(displayPayNow)}</span>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Pay on delivery</span>
                      <span className="font-semibold">{formatInr(codBalanceOnDelivery)}</span>
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs text-slate-500">
                Including {checkoutStep === 'payment' ? formatInr(displayTax) : `${currency}${tax.toFixed(2)}`} GST (5%)
              </p>
            </div>

            {orderError && (
              <p className="mt-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded px-4 py-3">{orderError}</p>
            )}

            {checkoutStep === 'shipping' ? (
              <button
                type="button"
                className="w-full mt-8 py-4 text-white text-sm font-bold tracking-widest uppercase rounded transition hover:opacity-90 bg-primary-brown cursor-pointer disabled:opacity-50"
                onClick={handleContinueToPayment}
                disabled={items.length === 0}
              >
                Continue to payment
              </button>
            ) : (
              <button
                type="button"
                className="w-full mt-8 py-4 text-white text-sm font-bold tracking-widest uppercase rounded transition hover:opacity-90 bg-primary-brown cursor-pointer disabled:opacity-50"
                onClick={handlePlaceOrder}
                disabled={placingOrder || items.length === 0 || loadingQuote}
              >
                {placingOrder
                  ? 'Processing...'
                  : loadingQuote
                    ? 'Calculating amount...'
                    : paymentMethod === 'cod'
                      ? `Pay ${formatInr(displayPayNow)} & place COD order`
                      : `Pay ${formatInr(displayPayNow)} securely`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
