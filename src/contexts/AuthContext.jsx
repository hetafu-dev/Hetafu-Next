'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient';
import { CONFIG } from '../config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Tokens are now in HTTP-only cookies, automatically sent by browser
        // No need to store in localStorage
        const storedUser = localStorage?.getItem(CONFIG.STORAGE.USER_KEY);

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      initializeAuth();
      
      // Listen for token expiration events from apiClient
      const handleTokenExpired = () => {
        console.warn('🔐 Token expired event received - logging out');
        setUser(null);
        setToken(null);
        setRefreshToken(null);
        setError('Session expired. Please login again.');
      };
      
      window.addEventListener('auth:expired', handleTokenExpired);
      
      return () => {
        window.removeEventListener('auth:expired', handleTokenExpired);
      };
    }
  }, []);

  const login = useCallback(async (identifier, password) => {
    setError(null);
    try {
      const response = await apiClient.post('/customer/login', { 
        identifier, 
        password 
      });

      console.log('🔍 Login response:', response);
      
      // Get tokens from response
      const accessToken = response.tokens?.access_token;
      const newRefreshToken = response.tokens?.refresh_token;

      console.log('🔑 Extracted tokens:', { 
        accessToken: accessToken ? '✅ Present' : '❌ Missing',
        newRefreshToken: newRefreshToken ? '✅ Present' : '❌ Missing'
      });

      if (accessToken) {
        // Store tokens for use in Authorization headers
        console.log('📝 Setting token in apiClient...');
        apiClient.setToken(accessToken);
        setToken(accessToken);
        console.log('✅ apiClient.token is now:', apiClient.getToken() ? 'SET' : 'NOT SET');
        
        if (newRefreshToken) {
          apiClient.setRefreshToken(newRefreshToken);
          setRefreshToken(newRefreshToken);
        }
      } else {
        console.error('❌ No access token in response!');
      }
      
      // Tokens are in HTTP-only cookies (production) + response body (development)
      localStorage?.setItem(CONFIG.STORAGE.USER_KEY, JSON.stringify(response.user));
      setUser(response.user);

      return response;
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint to clear cookies on backend
      await apiClient.post('/customer/logout', {});
    } catch (err) {
      console.error('Logout error:', err);
      // Continue logout even if API call fails
    } finally {
      // Clear frontend state
      apiClient.setToken(null);
      apiClient.setRefreshToken(null);
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      setError(null);
      localStorage?.removeItem(CONFIG.STORAGE.USER_KEY);
    }
  }, []);

  const register = useCallback(async (email, otp, userData) => {
    setError(null);
    try {
      const response = await apiClient.post('/customer/register', {
        email,
        ...userData,
      });

      // Get tokens from response
      const accessToken = response.tokens?.access_token;
      const newRefreshToken = response.tokens?.refresh_token;

      if (accessToken) {
        // Store tokens for use in Authorization headers
        apiClient.setToken(accessToken);
        setToken(accessToken);
        
        if (newRefreshToken) {
          apiClient.setRefreshToken(newRefreshToken);
          setRefreshToken(newRefreshToken);
        }
      }
      
      localStorage?.setItem(CONFIG.STORAGE.USER_KEY, JSON.stringify(response.user));
      setUser(response.user);

      return response;
    } catch (err) {
      const errorMsg = err.message || 'Registration failed';
      setError(errorMsg);
      throw err;
    }
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return false;

    try {
      const response = await apiClient.post('/auth/refresh', {
        refresh_token: refreshToken
      });

      const newAccessToken = response.access_token;
      if (newAccessToken) {
        localStorage?.setItem(CONFIG.STORAGE.TOKEN_KEY, newAccessToken);
        apiClient.setToken(newAccessToken);
        setToken(newAccessToken);
        return true;
      }
    } catch (err) {
      logout();
      return false;
    }
  }, [refreshToken, logout]);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await apiClient.put('/auth/profile', profileData);
      if (response.user) {
        localStorage?.setItem(CONFIG.STORAGE.USER_KEY, JSON.stringify(response.user));
        setUser(response.user);
        return response;
      }
    } catch (err) {
      const errorMsg = err.message || 'Profile update failed';
      setError(errorMsg);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    token,
    refreshToken,
    loading,
    error,
    login,
    logout,
    register,
    refreshAccessToken,
    updateProfile,
    clearError,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
