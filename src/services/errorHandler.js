// hetafu-next/src/services/errorHandler.js

export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'APIError';
  }
}

export const handleAPIError = (error) => {
  if (error instanceof APIError) {
    return {
      message: error.message,
      status: error.status,
      data: error.data
    };
  }

  if (error instanceof TypeError) {
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
      data: error
    };
  }

  return {
    message: error.message || 'An unexpected error occurred',
    status: 500,
    data: error
  };
};

export const parseErrorMessage = (error) => {
  if (error?.detail) return error.detail;
  if (error?.message) return error.message;
  if (typeof error === 'string') return error;
  return 'An error occurred. Please try again.';
};

export const getErrorField = (errorMessage) => {
  const lowerMsg = errorMessage.toLowerCase();
  
  if (lowerMsg.includes('email')) return 'email';
  if (lowerMsg.includes('password')) return 'password';
  if (lowerMsg.includes('name')) return 'firstName';
  if (lowerMsg.includes('clinic')) return 'clinicName';
  if (lowerMsg.includes('otp')) return 'otp';
  if (lowerMsg.includes('mobile')) return 'email';
  
  return null;
};

export const isNetworkError = (error) => {
  return error instanceof TypeError || error?.status === 0;
};

export const isAuthError = (error) => {
  return error?.status === 401 || error?.status === 403;
};

export const isValidationError = (error) => {
  return error?.status === 400;
};
