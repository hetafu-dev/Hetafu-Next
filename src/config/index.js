export const CONFIG = {
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
  },
  STORAGE: {
    USER_KEY: 'hetafu_user',
  },
  ERRORS: {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',
    UNAUTHORIZED: 'Unauthorized. Please login again.',
    SERVER_ERROR: 'Server error. Please try again later.',
  },
};

export default CONFIG;
