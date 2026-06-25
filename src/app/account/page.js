'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/app/Components/Common/Navbar/Page';
import Footer from '@/app/Components/Common/Footer/Page';
import BestSellers from '@/app/Components/Common/BestSellers/Page';
import WriteReviewModal from '@/app/Components/Common/Reviews/WriteReviewModal';
import { LogOut, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiClient } from '@/services/apiClient';
import { fetchMyOrders } from '@/services/orderService';
import { getStoredUser, saveUser, clearAuthStorage } from '@/utils/authStorage';

const ORDERS_PAGE_SIZE = 10;

function formatOrderDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatInr(amount) {
  return `₹${Number(amount || 0).toFixed(2)}`;
}

function statusLabel(status) {
  const labels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    packed: 'Packed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    returned: 'Returned',
    refunded: 'Refunded',
  };
  return labels[status] || status;
}

function statusClass(status) {
  if (status === 'delivered') return 'bg-green-100 text-green-800';
  if (status === 'cancelled' || status === 'returned' || status === 'refunded') {
    return 'bg-red-100 text-red-800';
  }
  if (status === 'shipped') return 'bg-blue-100 text-blue-800';
  return 'bg-amber-100 text-amber-800';
}

function OrderPagination({ page, totalPages, onPageChange, loading }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-slate-200">
      <button
        type="button"
        disabled={loading || page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="p-2 rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-xs text-slate-600 min-w-[80px] text-center">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        disabled={loading || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="p-2 rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [addressCount, setAddressCount] = useState(0);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewNotice, setReviewNotice] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await apiClient.get('/customer/me');
        setUser(profile);
        saveUser(profile);

        const response = await apiClient.get('/customer/addresses');
        setAddressCount(response.addresses?.length || 0);
        const defaultAddr = response.addresses?.find((addr) => addr.is_default);
        setDefaultAddress(defaultAddr || null);
      } catch (error) {
        const cachedUser = getStoredUser();
        if (cachedUser) {
          setUser(cachedUser);
        } else {
          router.push('/account/login');
          return;
        }

        if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
          clearAuthStorage();
          router.push('/account/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const loadOrders = useCallback(async (page) => {
    setOrdersLoading(true);
    try {
      const response = await fetchMyOrders(page, ORDERS_PAGE_SIZE);
      setOrders(response.orders || []);
      setOrdersTotalPages(response.total_pages || 1);
      setOrdersPage(response.page || page);
    } catch (error) {
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        clearAuthStorage();
        router.push('/account/login');
        return;
      }
      setOrders([]);
      setOrdersTotalPages(1);
    } finally {
      setOrdersLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!loading) {
      loadOrders(ordersPage);
    }
  }, [loading, ordersPage, loadOrders]);

  useEffect(() => {
    const handleTokenExpired = () => {
      setUser(null);
      router.push('/account/login');
    };

    window?.addEventListener('auth:expired', handleTokenExpired);
    return () => window?.removeEventListener('auth:expired', handleTokenExpired);
  }, [router]);

  const handleLogout = async () => {
    try {
      await apiClient.post('/customer/logout', {});
    } catch (error) {
      console.error('Logout error:', error.message);
    } finally {
      clearAuthStorage();
      apiClient.setCSRFToken(null);
      router.push('/account/login');
    }
  };

  const handleReviewSuccess = () => {
    setReviewNotice('Your review has been published on the product page.');
    loadOrders(ordersPage);
  };

  const customerName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '';

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-background py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <h1 className="text-5xl font-light text-primary-brown">Account</h1>
            <button
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-2 text-xs font-bold tracking-widest uppercase text-primary-brown hover:opacity-70 transition"
            >
              <LogOut size={16} />
              LOG OUT
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-primary-brown mb-6">Order history</h2>

              {reviewNotice && (
                <p className="mb-4 text-sm text-green-800 bg-green-50 border border-green-100 rounded px-4 py-3">
                  {reviewNotice}
                </p>
              )}

              {ordersLoading ? (
                <p className="text-sm text-slate-600">Loading your orders...</p>
              ) : orders.length === 0 ? (
                <p className="text-sm text-slate-600">You haven&apos;t placed any orders yet.</p>
              ) : (
                <>
                  <div className="space-y-3">
                    {orders.map((order) => {
                      const reviewableItems = (order.items || []).filter((item) => item.can_review);
                      const singleReviewable = reviewableItems.length === 1 ? reviewableItems[0] : null;

                      return (
                      <div
                        key={order.id}
                        className="border border-slate-200 rounded-lg p-4 bg-white"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <div>
                            <p className="text-xs text-slate-500">{formatOrderDate(order.created_at)}</p>
                            <p className="text-sm font-semibold text-primary-brown">{order.order_number}</p>
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusClass(order.status)}`}>
                            {statusLabel(order.status)}
                          </span>
                        </div>

                        <div className="space-y-2 mb-3">
                          {(order.items || []).map((item) => (
                            <div key={`${order.id}-${item.product_id}`} className="flex items-center gap-3">
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt=""
                                  className="w-12 h-12 object-contain rounded bg-[#f0ece6] flex-shrink-0"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded bg-[#f0ece6] flex-shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-800 line-clamp-1">{item.product_name}</p>
                                <p className="text-xs text-slate-500">Qty {item.quantity}</p>
                              </div>
                              {!singleReviewable && item.can_review && (
                                <button
                                  type="button"
                                  onClick={() => setReviewTarget({
                                    productId: item.product_id,
                                    productName: item.product_name,
                                  })}
                                  className="text-xs font-bold tracking-widest uppercase text-primary-brown underline underline-offset-4 hover:opacity-70 transition cursor-pointer whitespace-nowrap"
                                >
                                  Write a review
                                </button>
                               )}
                              {!singleReviewable && item.already_reviewed && (
                                <span className="text-xs text-slate-500 whitespace-nowrap">Reviewed</span>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-sm">
                          <span>
                            <span className="text-slate-600">Total </span>
                            <span className="font-semibold text-primary-brown">{formatInr(order.total_amount)}</span>
                          </span>
                          <div className="flex flex-wrap items-center gap-4">
                            {singleReviewable && (
                              <button
                                type="button"
                                onClick={() => setReviewTarget({
                                  productId: singleReviewable.product_id,
                                  productName: singleReviewable.product_name,
                                })}
                                className="text-xs font-bold tracking-widest uppercase text-primary-brown underline underline-offset-4 hover:opacity-70 transition cursor-pointer"
                              >
                                Write a review
                              </button>
                            )}
                            <Link
                              href={`/track-order?order=${encodeURIComponent(order.order_number)}`}
                              className="text-xs font-bold tracking-widest uppercase text-primary-brown underline underline-offset-4 hover:opacity-70 transition"
                            >
                              Track order
                            </Link>
                          </div>
                        </div>
                      </div>
                    );})}
                  </div>

                  <OrderPagination
                    page={ordersPage}
                    totalPages={ordersTotalPages}
                    loading={ordersLoading}
                    onPageChange={setOrdersPage}
                  />
                </>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-primary-brown mb-6">Account details</h2>

              {user && (
                <div className="mb-6 text-sm text-slate-700 space-y-1">
                  <p className="font-medium">{user.first_name} {user.last_name}</p>
                  <p>{user.email}</p>
                </div>
              )}

              {defaultAddress ? (
                <div className="mb-8">
                  <div className="text-sm text-slate-700 space-y-1">
                    <p className="font-medium">{defaultAddress.first_name} {defaultAddress.last_name}</p>
                    <p>{defaultAddress.address1}</p>
                    {defaultAddress.address2 && <p>{defaultAddress.address2}</p>}
                    <p>{defaultAddress.city}</p>
                    <p>{defaultAddress.province} {defaultAddress.postal_code}</p>
                    <p>{defaultAddress.country}</p>
                  </div>
                </div>
              ) : null}

              <Link
                href="/account/addresses"
                className="text-xs font-bold tracking-widest uppercase text-primary-brown underline underline-offset-4 hover:opacity-70 transition flex items-center gap-2"
              >
                <MapPin size={16} />
                VIEW ADDRESSES ({addressCount})
              </Link>
            </div>
          </div>
        </div>
      </main>

      {reviewTarget && (
        <WriteReviewModal
          productId={reviewTarget.productId}
          productName={reviewTarget.productName}
          customerName={customerName}
          onClose={() => setReviewTarget(null)}
          onSuccess={handleReviewSuccess}
        />
      )}

      <BestSellers />
      <Footer />
    </div>
  );
}
