// hetafu-next/src/services/authService.js
// Customer auth service using Hetafu customer APIs

import { apiClient } from './apiClient';
import { handleAPIError } from './errorHandler';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/customer/login', {
        email,
        password
      });
      return response;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  register: async (email, password, firstName, lastName) => {
    try {
      const response = await apiClient.post('/customer/register', {
        email,
        password,
        first_name: firstName,
        last_name: lastName
      });
      return response;
    } catch (error) {
      throw handleAPIError(error);
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get('/customer/me');
      return response;
    } catch (error) {
      throw handleAPIError(error);
    }
  }
};
