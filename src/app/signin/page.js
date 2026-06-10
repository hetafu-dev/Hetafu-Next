'use client';

import { useState } from 'react';
import Navbar from "@/app/Components/Common/Navbar/Page";
import Footer from "@/app/Components/Common/Footer/Page";
import BestSellers from "@/app/Components/Common/BestSellers/Page";

export default function SignInPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      // Handle login logic
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }
      // In a real app, this would call an authentication API
      setSuccess('Login successful!');
    } else {
      // Handle account creation
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
      // In a real app, this would create a user account
      setSuccess('Account created successfully! You can now sign in.');
      setIsLogin(true); // Switch back to login form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div style={{ backgroundColor: 'var(--background)', fontFamily: 'var(--font-sans-family)' }} className="min-h-screen py-20">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-light text-center mb-8 text-slate-950">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h1>
            
            <div className="flex mb-8 border-b border-gray-200">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 text-center font-bold uppercase tracking-wider transition-colors ${isLogin ? 'border-b-2 border-secondary-blue text-slate-950' : 'text-slate-500'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 text-center font-bold uppercase tracking-wider transition-colors ${!isLogin ? 'border-b-2 border-secondary-blue text-slate-950' : 'text-slate-500'}`}
              >
                Create Account
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-blue"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-blue"
                      placeholder="Doe"
                    />
                  </div>
                </>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-blue"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-blue"
                  placeholder="••••••••"
                />
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-blue"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-secondary-blue text-white font-bold uppercase tracking-wider rounded-lg hover:bg-secondary-blue/90 transition-colors"
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {isLogin && (
              <p className="mt-6 text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="font-bold text-secondary-blue hover:underline"
                >
                  Create one here
                </button>
              </p>
            )}
          </div>
        </div>
        <BestSellers />
      </main>
      <Footer />
    </div>
  );
}