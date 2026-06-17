'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";
import { ChevronDown, Edit, Trash2 } from 'lucide-react';
import { apiClient } from '@/services/apiClient';

const COUNTRIES = [
  { name: 'United Kingdom', provinces: ['British Forces', 'England', 'Scotland', 'Wales', 'Northern Ireland'] },
  { name: 'India', provinces: ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'] },
];

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    const user = JSON.parse(localStorage?.getItem('user') || '{}');
    if (user.first_name || user.last_name) {
      setFormData(prev => ({
        ...prev,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      }));
    }
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/account/login');
        return;
      }
      apiClient.setToken(token);
      const response = await apiClient.get('/customer/addresses');
      setAddresses(response.addresses || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');
      apiClient.setToken(token);
      
      // Prepare data without id field
      const addressData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        country: formData.country,
        province: formData.province,
        postal_code: formData.postal_code,
        phone: formData.phone,
        is_default: formData.is_default,
      };
      
      if (editingId) {
        // Update address
        await apiClient.put(`/customer/addresses/${editingId}`, addressData);
      } else {
        // Create new address
        await apiClient.post('/customer/addresses', addressData);
      }
      
      const user = JSON.parse(localStorage?.getItem('user') || '{}');
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        address1: '',
        address2: '',
        city: '',
        country: 'India',
        province: '',
        postal_code: '',
        phone: '',
        is_default: false,
      });
      setEditingId(null);
      setShowForm(false);
      await fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCountry = COUNTRIES.find(c => c.name === formData.country);
  const provinces = selectedCountry?.provinces || [];

  const handleEditAddress = (address) => {
    setFormData(address);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const token = localStorage.getItem('access_token');
      apiClient.setToken(token);
      await apiClient.delete(`/customer/addresses/${id}`);
      await fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const handleCancelEdit = () => {
    const user = JSON.parse(localStorage?.getItem('user') || '{}');
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      address1: '',
      address2: '',
      city: '',
      country: 'India',
      province: '',
      postal_code: '',
      phone: '',
      is_default: false,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-background py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-light text-center text-primary-brown mb-8">Addresses</h1>
          
          <Link
            href="/account"
            className="text-xs font-bold tracking-widest uppercase text-center block text-primary-brown underline underline-offset-4 hover:opacity-70 transition mb-12"
          >
            RETURN TO ACCOUNT DETAILS
          </Link>

          {!showForm ? (
            <>
              {addresses.length === 0 && (
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-80 py-6 bg-primary-brown text-white font-bold tracking-widest uppercase text-sm hover:opacity-90 transition cursor-pointer"
                  >
                    ADD A NEW ADDRESS
                  </button>
                </div>
              )}
              
              {addresses.length > 0 && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {addresses.map((address) => (
                      <div key={address.id} className="border border-slate-300 p-8 rounded-lg hover:shadow-xl transition bg-background">
                        <div className="flex justify-between items-start mb-5">
                          <div className="flex-1">
                            <p className="font-semibold text-lg text-primary-brown mb-2">{address.first_name} {address.last_name}</p>
                            {address.is_default && <p className="text-xs font-semibold text-primary-brown bg-yellow-100 inline-block px-3 py-1 rounded-full">DEFAULT</p>}
                          </div>
                          <div className="flex gap-3 ml-4">
                            <button
                              onClick={() => handleEditAddress(address)}
                              className="p-2 text-primary-brown cursor-pointer hover:bg-slate-100 rounded-full transition"
                              title="Edit address"
                            >
                              <Edit size={20} />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="p-2 text-red-600 cursor-pointer hover:bg-red-50 rounded-full transition"
                              title="Delete address"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-slate-700">{address.address1}</p>
                          {address.address2 && <p className="text-sm font-medium text-slate-700">{address.address2}</p>}
                          <p className="text-sm text-slate-600">{address.city}, {address.province} {address.postal_code}</p>
                          <p className="text-sm text-slate-600">{address.country}</p>
                          {address.phone && <p className="text-sm text-slate-600 mt-3 pt-3 border-t border-slate-200">{address.phone}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowForm(true)}
                      className="w-80 py-6 cursor-pointer bg-primary-brown text-white font-bold tracking-widest uppercase text-sm hover:opacity-90 transition cursor-pointer"
                    >
                      ADD A NEW ADDRESS
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl">
              <h2 className="text-2xl font-light text-primary-brown mb-8">{editingId ? 'Edit address' : 'Add a new address'}</h2>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-primary-brown mb-2">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="First name"
                    className="w-full border-b-2 border-primary-brown bg-transparent py-2 text-sm focus:outline-none"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-primary-brown mb-2">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    className="w-full border-b-2 border-primary-brown bg-transparent py-2 text-sm focus:outline-none"
                    readOnly
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold tracking-widest uppercase text-primary-brown mb-2">Address 1 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="address1"
                  value={formData.address1}
                  onChange={handleInputChange}
                  placeholder="Address 1"
                  className="w-full border-b-2 border-primary-brown bg-transparent py-2 text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold tracking-widest uppercase text-primary-brown mb-2">Address 2 <span className="text-slate-400 text-xs">(optional)</span></label>
                <input
                  type="text"
                  name="address2"
                  value={formData.address2}
                  onChange={handleInputChange}
                  placeholder="Address 2 (optional)"
                  className="w-full border-b-2 border-primary-brown bg-transparent py-2 text-sm focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold tracking-widest uppercase text-primary-brown mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full border-b-2 border-primary-brown bg-transparent py-2 text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold tracking-widest uppercase text-slate-600 mb-2">Country/region</label>
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full border-b-2 border-primary-brown bg-transparent py-2 text-sm focus:outline-none appearance-none"
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-primary-brown pointer-events-none" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold tracking-widest uppercase text-slate-600 mb-2">Province</label>
                <div className="relative">
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full border-b-2 border-primary-brown bg-transparent py-2 text-sm focus:outline-none appearance-none"
                    required
                  >
                    <option value="">Select province</option>
                    {provinces.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-primary-brown pointer-events-none" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold tracking-widest uppercase text-primary-brown mb-2">Postal/ZIP Code</label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  placeholder="Postal/ZIP code"
                  className="w-full border-b-2 border-primary-brown bg-transparent py-2 text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold tracking-widest uppercase text-primary-brown mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="w-full border-b-2 border-primary-brown bg-transparent py-2 text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="mb-8">
                <label className="flex items-center gap-3 text-sm text-primary-brown">
                  <input
                    type="checkbox"
                    name="is_default"
                    checked={formData.is_default}
                    onChange={handleInputChange}
                    className="w-4 h-4 border border-slate-300"
                  />
                  Set as default address
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-4 bg-primary-brown text-white font-bold tracking-widest uppercase text-sm hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (editingId ? 'UPDATING...' : 'ADDING...') : (editingId ? 'UPDATE ADDRESS' : 'ADD ADDRESS')}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="py-4 border-2 border-primary-brown text-primary-brown font-bold tracking-widest uppercase text-sm hover:bg-slate-50 transition cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
      <BestSellers />
      <Footer />
    </div>
  );
}
