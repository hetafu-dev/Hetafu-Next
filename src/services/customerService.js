// hetafu-next/src/services/customerService.js

import { apiClient } from './apiClient';
import { handleAPIError } from './errorHandler';

export const customerService = {
  getMyProfile: async () => {
    try {
      const response = await apiClient.get('/customers/me/profile');
      return response;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  updateMyProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/customers/me/profile', profileData);
      return response;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  getAllCustomers: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      const params = new URLSearchParams({
        page,
        page_size: pageSize,
        ...filters
      });
      const response = await apiClient.get(`/customers/all?${params}`);
      return response;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  getCustomerDetail: async (customerId) => {
    try {
      const response = await apiClient.get(`/customers/${customerId}`);
      return response;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  updateCustomerStatus: async (customerId, isActive, reason = null) => {
    try {
      const response = await apiClient.put(`/customers/${customerId}/status`, {
        is_active: isActive,
        reason
      });
      return response;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  getCustomerOrders: async (customerId, page = 1, pageSize = 10, status = null) => {
    try {
      const params = new URLSearchParams({
        page,
        page_size: pageSize
      });
      if (status) params.append('status', status);
      
      const response = await apiClient.get(`/customers/${customerId}/orders?${params}`);
      return response;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  getCustomerOrdersSummary: async (customerId) => {
    try {
      const response = await apiClient.get(`/customers/${customerId}/orders/summary`);
      return response;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  getCustomerAddresses: async (customerId) => {
    try {
      const response = await apiClient.get(`/customers/${customerId}/addresses`);
      return response;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  createCustomerAddress: async (customerId, addressData) => {
    try {
      const response = await apiClient.post(`/customers/${customerId}/addresses`, addressData);
      return response;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  updateAddress: async (addressId, addressData) => {
    try {
      const response = await apiClient.put(`/customers/addresses/${addressId}`, addressData);
      return response;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  deleteAddress: async (addressId) => {
    try {
      const response = await apiClient.delete(`/customers/addresses/${addressId}`);
      return response;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  getAnalyticsOverview: async () => {
    try {
      const response = await apiClient.get('/customers/analytics/overview');
      return response;
    } catch (error) {
      throw handleAPIError(error);
    }
  }
};
