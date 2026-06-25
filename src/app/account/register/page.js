'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";
import { apiClient } from '@/services/apiClient';
import { saveUser, clearLegacyTokenStorage } from '@/utils/authStorage';
import {
  validatePasswordStrength,
  getPasswordStrengthScore,
  getPasswordStrengthLabel,
  PASSWORD_REQUIREMENTS,
} from '@/utils/passwordValidation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [csrfToken, setCSRFToken] = useState(null);

  // Fetch CSRF token on component mount
  useEffect(() => {
    clearLegacyTokenStorage();

    const fetchCSRFToken = async () => {
      try {
        console.log('🔐 Fetching CSRF token for registration...');
        const token = await apiClient.fetchCSRFToken();
        setCSRFToken(token);
      } catch (error) {
        console.error('❌ Failed to fetch CSRF token:', error);
      }
    };

    fetchCSRFToken();
  }, []);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getPasswordStrength = (password) => getPasswordStrengthScore(password);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';

    const passwordCheck = validatePasswordStrength(formData.password);
    if (!passwordCheck.valid) {
      newErrors.password = passwordCheck.error;
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'password') setPasswordStrength(getPasswordStrength(value));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check if CSRF token is available
    if (!csrfToken) {
      setMessage({
        type: 'error',
        text: 'Security token not available. Please refresh the page and try again.'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/customer/register', {
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        csrf_token: csrfToken  // Include CSRF token
      });

      if (response.user) {
        saveUser(response.user);
        apiClient.setCSRFToken(null);
        await apiClient.fetchCSRFToken();
        window?.dispatchEvent(new Event('auth:login'));

        setMessage({ type: 'success', text: 'Account created successfully! Redirecting...' });
        setTimeout(() => router.push('/account'), 1500);
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorText = error.message || 'Registration failed. Please try again.';
      
      // Better error message parsing
      // Error format can be: "HTTP 422: String should have at least 12 characters"
      // or: "String should have at least 12 characters"
      
      if (errorText.includes('String should have at least 12 characters')) {
        errorText = 'Password must be at least 12 characters with uppercase, lowercase, number, and special character.';
      } else if (errorText.includes('ensure this value has at least 12 characters') || errorText.includes('min_length')) {
        errorText = 'Password must be at least 12 characters.';
      } else if (errorText.includes('password')) {
        errorText = 'Password must be at least 12 characters with uppercase, lowercase, number, and special character.';
      } else if (errorText.includes('422') || errorText.includes('Unprocessable')) {
        errorText = 'Please check your input. Password must be at least 12 characters with uppercase, lowercase, number, and special character.';
      } else if (errorText.includes('400') || errorText.includes('already') || errorText.includes('Unable to create')) {
        errorText = 'Unable to create an account with the provided details. Please check your information or sign in if you already have an account.';
      } else if (errorText.includes('403') || errorText.includes('CSRF')) {
        errorText = 'Security validation failed. Please refresh the page and try again.';
      }
      
      setMessage({ 
        type: 'error', 
        text: errorText
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-background py-20">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-5xl font-light text-center mb-16 text-primary-brown">Create Account</h1>

          {message.text && (
            <div className={`mb-6 p-4 border rounded text-xs ${
              message.type === 'error' 
                ? 'bg-red-50 border-red-200 text-red-700' 
                : 'bg-green-50 border-green-200 text-green-700'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold tracking-widest text-primary-brown mb-2">FIRST NAME</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className={`w-full bg-transparent border-b-2 text-sm text-primary-brown placeholder-gray-400 focus:outline-none py-2 transition ${
                    errors.firstName ? 'border-red-500' : 'border-primary-brown focus:border-secondary-blue'
                  }`}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest text-primary-brown mb-2">LAST NAME</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className={`w-full bg-transparent border-b-2 text-sm text-primary-brown placeholder-gray-400 focus:outline-none py-2 transition ${
                    errors.lastName ? 'border-red-500' : 'border-primary-brown focus:border-secondary-blue'
                  }`}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest text-primary-brown mb-2">EMAIL</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full bg-transparent border-b-2 text-sm text-primary-brown placeholder-gray-400 focus:outline-none py-2 transition ${
                  errors.email ? 'border-red-500' : 'border-primary-brown focus:border-secondary-blue'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest text-primary-brown mb-2">PASSWORD</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 12 characters"
                className={`w-full bg-transparent border-b-2 text-sm text-primary-brown placeholder-gray-400 focus:outline-none py-2 transition ${
                  errors.password ? 'border-red-500' : 'border-primary-brown focus:border-secondary-blue'
                }`}
              />
              {formData.password && (
                <div className="mt-2 text-xs">
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`flex-1 h-1 rounded ${i < passwordStrength / 25 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    ))}
                  </div>
                  <p className="mt-1 text-gray-600">
                    {getPasswordStrengthLabel(passwordStrength)}
                  </p>
                  <p className="mt-1 text-gray-500">{PASSWORD_REQUIREMENTS}</p>
                </div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-1/2 mx-auto block py-4 cursor-pointer bg-primary-brown text-white font-bold tracking-widest text-sm hover:opacity-90 transition-opacity mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-xs text-gray-600 mb-4">Already have an account?</p>
            <Link href="/account/login" className="text-xs font-bold cursor-pointer tracking-widest text-primary-brown underline hover:opacity-80">
              SIGN IN
            </Link>
          </div>
        </div>
        <BestSellers />
      </main>
      <Footer />
    </div>
  );
}
