'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";
import { LogOut, MapPin } from 'lucide-react';
import { apiClient } from '@/services/apiClient';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addressCount, setAddressCount] = useState(0);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = localStorage?.getItem('user');
        const token = localStorage?.getItem('access_token');
        
        // If no user or token, redirect to login
        if (!storedUser || !token) {
          console.warn('⚠️ No user or token found - redirecting to login');
          router.push('/account/login');
          return;
        }
        
        setUser(JSON.parse(storedUser));
        
        // Verify token is still valid by making a test API call
        if (!hasInitialized) {
          apiClient.setToken(token);
          try {
            const response = await apiClient.get('/customer/addresses');
            setAddressCount(response.addresses?.length || 0);
            
            // Find default address
            const defaultAddr = response.addresses?.find(addr => addr.is_default);
            setDefaultAddress(defaultAddr || null);
          } catch (error) {
            console.error('❌ Failed to fetch addresses:', error.message);
            // If it's an auth error, clear storage and redirect to login
            if (error.message.includes('401') || error.message.includes('Unauthorized')) {
              console.warn('🔐 Token invalid - redirecting to login');
              localStorage?.removeItem('user');
              localStorage?.removeItem('access_token');
              localStorage?.removeItem('refresh_token');
              apiClient.setToken(null);
              apiClient.setRefreshToken(null);
              router.push('/account/login');
              return;
            }
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
        setHasInitialized(true);
      }
    };

    if (!hasInitialized) {
      fetchProfile();
    }
  }, [router, hasInitialized]);

  // Listen for token expiration events
  useEffect(() => {
    const handleTokenExpired = () => {
      console.warn('🔐 Token expired - redirecting to login');
      setUser(null);
      setLoading(true);
      router.push('/account/login');
    };
    
    window?.addEventListener('auth:expired', handleTokenExpired);
    return () => {
      window?.removeEventListener('auth:expired', handleTokenExpired);
    };
  }, [router]);

  const handleLogout = () => {
    localStorage?.removeItem('access_token');
    localStorage?.removeItem('refresh_token');
    localStorage?.removeItem('user');
    apiClient.setToken(null);
    apiClient.setRefreshToken(null);
    router.push('/account/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-background py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
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

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left: Order history */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-primary-brown mb-6">Order history</h2>
              <p className="text-sm text-slate-600">You haven't placed any orders yet.</p>
            </div>

            {/* Right: Account details */}
            <div>
              <h2 className="text-2xl font-bold text-primary-brown mb-6">Account details</h2>
              
              {/* Display default address */}
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

              {/* View Addresses Link */}
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
      <BestSellers />
      <Footer />
    </div>
  );
}
