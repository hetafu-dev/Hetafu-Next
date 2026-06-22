'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";
import { apiClient } from '@/services/apiClient';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [csrfToken, setCSRFToken] = useState(null);
  
  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [forgotData, setForgotData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
  const [forgotErrors, setForgotErrors] = useState({});
  const [forgotLoading, setForgotLoading] = useState(false);

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        console.log('🔐 Fetching CSRF token for login...');
        const token = await apiClient.fetchCSRFToken();
        setCSRFToken(token);
      } catch (error) {
        console.error('❌ Failed to fetch CSRF token:', error);
      }
    };

    fetchCSRFToken();
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    const trimmedEmail = formData.email.trim();
    
    if (!trimmedEmail) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(trimmedEmail)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleForgotChange = (e) => {
    const { name, value } = e.target;
    setForgotData(prev => ({ ...prev, [name]: value }));
    if (forgotErrors[name]) {
      setForgotErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setForgotStep(1);
    setForgotData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
    setForgotErrors({});
    setMessage({ type: '', text: '' });
  };

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!forgotData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(forgotData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setForgotErrors(newErrors);
      return;
    }

    setForgotLoading(true);
    try {
      // Call endpoint to send OTP and verify email exists
      const response = await apiClient.post('/customer/password-reset/send-otp', {
        email: forgotData.email.trim()
      });
      
      console.log('Send OTP response:', response);
      setForgotStep(2);
      setForgotErrors({});
      setForgotLoading(false);
    } catch (error) {
      console.error('Send OTP error:', error);
      let errorMsg = 'Failed to send OTP. Please try again.';
      
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        errorMsg = 'Email not found. Please check and try again or create a new account.';
      } else if (error.message?.includes('422')) {
        errorMsg = 'Invalid email. Please check and try again.';
      }
      
      setForgotErrors({ email: errorMsg });
      setForgotLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!forgotData.otp.trim()) {
      newErrors.otp = 'OTP is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setForgotErrors(newErrors);
      return;
    }

    setForgotLoading(true);
    try {
      // Call endpoint to verify OTP
      const response = await apiClient.post('/customer/password-reset/verify-otp', {
        email: forgotData.email.trim(),
        otp: forgotData.otp.trim()
      });
      
      console.log('Verify OTP response:', response);
      setForgotStep(3);
      setForgotErrors({});
      setForgotLoading(false);
    } catch (error) {
      console.error('Verify OTP error:', error);
      let errorMsg = 'Invalid OTP. Please check and try again.';
      
      if (error.message?.includes('expired')) {
        errorMsg = 'OTP has expired. Please request a new one.';
      }
      
      setForgotErrors({ otp: errorMsg });
      setForgotLoading(false);
    }
  };

  // Step 3: Update password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!forgotData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (forgotData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!forgotData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (forgotData.newPassword !== forgotData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setForgotErrors(newErrors);
      return;
    }

    setForgotLoading(true);
    try {
      // Call endpoint to update password
      const response = await apiClient.post('/customer/password-reset/update-password', {
        email: forgotData.email.trim(),
        new_password: forgotData.newPassword
      });
      
      console.log('Update password response:', response);
      setMessage({ type: 'success', text: 'Password reset successfully! Please login with your new password.' });
      
      // Reset forgot password form
      setShowForgotPassword(false);
      setForgotStep(1);
      setForgotData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
      setForgotErrors({});
      setForgotLoading(false);
    } catch (error) {
      console.error('Update password error:', error);
      let errorMsg = 'Failed to reset password. Please try again.';
      
      if (error.message?.includes('422')) {
        errorMsg = 'Password does not meet requirements. Please try again.';
      }
      
      setForgotErrors({ newPassword: errorMsg });
      setForgotLoading(false);
    }
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotStep(1);
    setForgotData({ email: '', otp: '', newPassword: '', confirmPassword: '' });
    setForgotErrors({});
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
      const response = await apiClient.post('/customer/login', {
        email: formData.email.trim(),
        password: formData.password,
        csrf_token: csrfToken  // Include CSRF token
      });

      if (response.tokens?.access_token) {
        localStorage.setItem('access_token', response.tokens.access_token);
        if (response.tokens.refresh_token) {
          localStorage.setItem('refresh_token', response.tokens.refresh_token);
          apiClient.setRefreshToken(response.tokens.refresh_token);
        }
        localStorage.setItem('user', JSON.stringify(response.user));
        apiClient.setToken(response.tokens.access_token);
        
        setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
        setTimeout(() => router.push('/account'), 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorText = 'Login failed. Please try again.';
      
      if (error.message) {
        // Error format can be: "HTTP 422: String should have at least 12 characters"
        // or: "String should have at least 12 characters"
        
        // Handle CSRF errors (403)
        if (error.message.includes('403') || error.message.includes('CSRF') || error.message.includes('security token')) {
          errorText = 'Security validation failed. Please refresh the page and try again.';
          setMessage({ type: 'error', text: errorText });
        }
        // Handle rate limiting (429)
        else if (error.message.includes('429') || error.message.includes('Too many requests')) {
          const retryMatch = error.message.match(/(\d+)\s*seconds/);
          const retrySeconds = retryMatch ? retryMatch[1] : '60';
          errorText = `Too many login attempts. Please try again in ${retrySeconds} seconds.`;
          setMessage({ type: 'error', text: errorText });
        } 
        // Handle validation errors (422)
        else if (error.message.includes('String should have at least 12 characters')) {
          errorText = 'Password must be at least 12 characters with uppercase, lowercase, number, and special character.';
          setErrors({ password: errorText });
          setMessage({ type: '', text: '' });
        } else if (error.message.includes('ensure this value has at least 12 characters') || error.message.includes('min_length')) {
          errorText = 'Password must be at least 12 characters.';
          setErrors({ password: errorText });
          setMessage({ type: '', text: '' });
        } else if (error.message.includes('422') || error.message.includes('Unprocessable')) {
          if (error.message.includes('password')) {
            errorText = 'Password must be at least 12 characters with uppercase, lowercase, number, and special character.';
            setErrors({ password: errorText });
            setMessage({ type: '', text: '' });
          } else if (error.message.includes('email')) {
            errorText = 'Invalid email format.';
            setErrors({ email: errorText });
            setMessage({ type: '', text: '' });
          } else {
            errorText = 'Please check your input and try again.';
            setMessage({ type: 'error', text: errorText });
          }
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          errorText = 'Invalid email or password. Please check and try again.';
          setMessage({ type: 'error', text: errorText });
        } else if (error.message.includes('404')) {
          errorText = 'Email address not found. Please check and try again or create a new account.';
          setMessage({ type: 'error', text: errorText });
        } else if (error.message.includes('Connection')) {
          errorText = 'Connection error. Please check your internet and try again.';
          setMessage({ type: 'error', text: errorText });
        } else if (error.message.includes('inactive') || error.message.includes('Inactive')) {
          errorText = 'Your account is inactive. Please contact support.';
          setMessage({ type: 'error', text: errorText });
        } else if (error.message.includes('locked') || error.message.includes('Account')) {
          errorText = error.message; // Show the specific lockout or account message
          setMessage({ type: 'error', text: errorText });
        }
      }
      
      // If no field errors were set, show message error
      if (Object.keys(errors).length === 0) {
        setMessage({ type: 'error', text: errorText });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-background py-20">
        <div className="max-w-2xl mx-auto px-4">
          {!showForgotPassword ? (
            <>
              {/* Login Form */}
              <h1 className="text-5xl font-light text-center mb-16 text-primary-brown">Login</h1>

              {message.text && (
                <div className={`mb-6 p-4 border rounded text-xs ${
                  message.type === 'error' 
                    ? 'bg-red-50 border-red-200 text-red-700' 
                    : message.type === 'success'
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-blue-50 border-blue-200 text-blue-700'
                }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-primary-brown mb-2">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full bg-transparent border-b-2 text-sm text-primary-brown placeholder-gray-400 focus:outline-none py-2 transition ${
                      errors.email 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-primary-brown focus:border-secondary-blue'
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
                    placeholder="Enter your password"
                    className={`w-full bg-transparent border-b-2 text-sm text-primary-brown placeholder-gray-400 focus:outline-none py-2 transition ${
                      errors.password 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-primary-brown focus:border-secondary-blue'
                    }`}
                  />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  <button
                    type="button"
                    onClick={handleForgotPasswordClick}
                    className="text-xs font-bold cursor-pointer tracking-widest text-primary-brown underline mt-2 hover:opacity-70"
                  >
                    FORGOT PASSWORD?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 mx-auto block py-4 cursor-pointer bg-primary-brown text-white font-bold tracking-widest text-sm hover:opacity-90 transition-opacity mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'SIGNING IN...' : 'SIGN IN'}
                </button>
              </form>

              <div className="text-center mt-8">
                <p className="text-xs text-gray-600 mb-4">Don't have an account?</p>
                <Link href="/account/register" className="text-xs font-bold cursor-pointer tracking-widest text-primary-brown underline hover:opacity-80">
                  CREATE ACCOUNT
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Forgot Password Form */}
              <h1 className="text-5xl font-light text-center mb-16 text-primary-brown">Reset your password</h1>
              
              <p className="text-sm text-gray-600 text-center mb-8">We will send you an email to reset your password</p>

              {/* Step 1: Enter Email */}
              {forgotStep === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-6 max-w-md mx-auto">
                  <div>
                    <label className="block text-xs font-bold tracking-widest text-primary-brown mb-2">EMAIL</label>
                    <input
                      type="email"
                      name="email"
                      value={forgotData.email}
                      onChange={handleForgotChange}
                      placeholder="your@email.com"
                      className={`w-full bg-transparent border-b-2 text-sm text-primary-brown placeholder-gray-400 focus:outline-none py-2 transition ${
                        forgotErrors.email 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-primary-brown focus:border-secondary-blue'
                      }`}
                    />
                    {forgotErrors.email && <p className="text-red-500 text-xs mt-1">{forgotErrors.email}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={closeForgotPassword}
                      className="py-3 border-2 border-primary-brown text-primary-brown font-bold tracking-widest uppercase text-xs hover:bg-slate-50 transition cursor-pointer"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="py-3 bg-primary-brown text-white font-bold tracking-widest uppercase text-xs hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                    >
                      {forgotLoading ? 'SENDING...' : 'SUBMIT'}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Verify OTP */}
              {forgotStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-6 max-w-md mx-auto">
                  <p className="text-xs text-gray-600 text-center mb-4">OTP sent to <span className="font-semibold">{forgotData.email}</span></p>
                  <div>
                    <label className="block text-xs font-bold tracking-widest text-primary-brown mb-2">OTP</label>
                    <input
                      type="text"
                      name="otp"
                      value={forgotData.otp}
                      onChange={handleForgotChange}
                      placeholder="Enter OTP"
                      className={`w-full bg-transparent border-b-2 text-sm text-primary-brown placeholder-gray-400 focus:outline-none py-2 transition ${
                        forgotErrors.otp 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-primary-brown focus:border-secondary-blue'
                      }`}
                    />
                    {forgotErrors.otp && <p className="text-red-500 text-xs mt-1">{forgotErrors.otp}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="py-3 border-2 border-primary-brown text-primary-brown font-bold tracking-widest uppercase text-xs hover:bg-slate-50 transition cursor-pointer"
                    >
                      BACK
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="py-3 bg-primary-brown text-white font-bold tracking-widest uppercase text-xs hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                    >
                      {forgotLoading ? 'VERIFYING...' : 'VERIFY'}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Set New Password */}
              {forgotStep === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-6 max-w-md mx-auto">
                  <div>
                    <label className="block text-xs font-bold tracking-widest text-primary-brown mb-2">NEW PASSWORD</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={forgotData.newPassword}
                      onChange={handleForgotChange}
                      placeholder="Enter new password"
                      className={`w-full bg-transparent border-b-2 text-sm text-primary-brown placeholder-gray-400 focus:outline-none py-2 transition ${
                        forgotErrors.newPassword 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-primary-brown focus:border-secondary-blue'
                      }`}
                    />
                    {forgotErrors.newPassword && <p className="text-red-500 text-xs mt-1">{forgotErrors.newPassword}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-widest text-primary-brown mb-2">CONFIRM PASSWORD</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={forgotData.confirmPassword}
                      onChange={handleForgotChange}
                      placeholder="Confirm password"
                      className={`w-full bg-transparent border-b-2 text-sm text-primary-brown placeholder-gray-400 focus:outline-none py-2 transition ${
                        forgotErrors.confirmPassword 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-primary-brown focus:border-secondary-blue'
                      }`}
                    />
                    {forgotErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{forgotErrors.confirmPassword}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setForgotStep(2)}
                      className="py-3 border-2 border-primary-brown text-primary-brown font-bold tracking-widest uppercase text-xs hover:bg-slate-50 transition cursor-pointer"
                    >
                      BACK
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="py-3 bg-primary-brown text-white font-bold tracking-widest uppercase text-xs hover:opacity-90 transition cursor-pointer disabled:opacity-50"
                    >
                      {forgotLoading ? 'UPDATING...' : 'UPDATE'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
        <BestSellers />
      </main>
      <Footer />
    </div>
  );
}
