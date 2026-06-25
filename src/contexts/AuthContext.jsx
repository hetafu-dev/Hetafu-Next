'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient';
import {
  saveUser,
  getStoredUser,
  clearAuthStorage,
  clearLegacyTokenStorage,
} from '../utils/authStorage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSession = useCallback(async () => {
    clearLegacyTokenStorage();

    const cachedUser = getStoredUser();
    if (cachedUser) {
      setUser(cachedUser);
    }

    try {
      const profile = await apiClient.get('/customer/me');
      if (profile) {
        setUser(profile);
        saveUser(profile);
      }
    } catch {
      if (!cachedUser) {
        setUser(null);
        clearAuthStorage();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    loadSession();

    const handleTokenExpired = () => {
      setUser(null);
      clearAuthStorage();
      setError('Session expired. Please login again.');
    };

    window.addEventListener('auth:expired', handleTokenExpired);
    return () => window.removeEventListener('auth:expired', handleTokenExpired);
  }, [loadSession]);

  const login = useCallback(async (identifier, password) => {
    setError(null);
    try {
      const response = await apiClient.post('/customer/login', {
        identifier,
        password,
      });

      if (response.user) {
        saveUser(response.user);
        setUser(response.user);
        apiClient.setCSRFToken(null);
        await apiClient.fetchCSRFToken();
      }

      return response;
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/customer/logout', {});
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      apiClient.setCSRFToken(null);
      clearAuthStorage();
      setUser(null);
      setError(null);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setError(null);
    try {
      const response = await apiClient.post('/customer/register', payload);

      if (response.user) {
        saveUser(response.user);
        setUser(response.user);
        apiClient.setCSRFToken(null);
        await apiClient.fetchCSRFToken();
      }

      return response;
    } catch (err) {
      const errorMsg = err.message || 'Registration failed';
      setError(errorMsg);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    clearError,
    isAuthenticated: !!user,
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
