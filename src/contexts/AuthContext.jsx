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
        const storedToken = localStorage?.getItem(CONFIG.STORAGE.TOKEN_KEY);
        const storedRefreshToken = localStorage?.getItem(CONFIG.STORAGE.REFRESH_TOKEN_KEY);
        const storedUser = localStorage?.getItem(CONFIG.STORAGE.USER_KEY);

        if (storedToken) {
          apiClient.setToken(storedToken);
          setToken(storedToken);
        }
        if (storedRefreshToken) {
          setRefreshToken(storedRefreshToken);
        }
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
    }
  }, []);

  const login = useCallback(async (identifier, password) => {
    setError(null);
    try {
      const response = await apiClient.post('/auth/login', { 
        identifier, 
        password 
      });

      const accessToken = response.tokens?.access_token;
      const newRefreshToken = response.tokens?.refresh_token;

      if (accessToken) {
        localStorage?.setItem(CONFIG.STORAGE.TOKEN_KEY, accessToken);
        if (newRefreshToken) {
          localStorage?.setItem(CONFIG.STORAGE.REFRESH_TOKEN_KEY, newRefreshToken);
          setRefreshToken(newRefreshToken);
        }
        localStorage?.setItem(CONFIG.STORAGE.USER_KEY, JSON.stringify(response.user));

        apiClient.setToken(accessToken);
        setToken(accessToken);
        setUser(response.user);

        return response;
      }
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    apiClient.setToken(null);
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    setError(null);
    localStorage?.removeItem(CONFIG.STORAGE.TOKEN_KEY);
    localStorage?.removeItem(CONFIG.STORAGE.REFRESH_TOKEN_KEY);
    localStorage?.removeItem(CONFIG.STORAGE.USER_KEY);
  }, []);

  const register = useCallback(async (email, otp, userData) => {
    setError(null);
    try {
      const response = await apiClient.post('/auth/register/complete', {
        email,
        otp,
        ...userData,
      });

      const accessToken = response.tokens?.access_token;
      const newRefreshToken = response.tokens?.refresh_token;

      if (accessToken) {
        localStorage?.setItem(CONFIG.STORAGE.TOKEN_KEY, accessToken);
        if (newRefreshToken) {
          localStorage?.setItem(CONFIG.STORAGE.REFRESH_TOKEN_KEY, newRefreshToken);
          setRefreshToken(newRefreshToken);
        }
        localStorage?.setItem(CONFIG.STORAGE.USER_KEY, JSON.stringify(response.user));

        apiClient.setToken(accessToken);
        setToken(accessToken);
        setUser(response.user);

        return response;
      }
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
