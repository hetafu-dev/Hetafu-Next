const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000');

class APIClient {
  constructor(baseURL = API_URL, timeout = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.token = null;
    this.refreshToken = null;
    this.csrfToken = null;
    this.isRefreshing = false;
    this.refreshSubscribers = [];
  }

  setToken(token) {
    if (token) {
      console.log(`✅ setToken() called - Token SET (length: ${token.length})`);
      this.token = token;
    } else {
      console.log(`🗑️ setToken() called - Token CLEARED (NULL)`);
      this.token = null;
    }
    console.log(`   Current apiClient.token after set:`, this.token ? 'PRESENT' : 'NULL');
  }

  setCSRFToken(token) {
    if (token) {
      console.log(`🔐 setCSRFToken() called - CSRF Token SET (length: ${token.length})`);
      this.csrfToken = token;
    } else {
      console.log(`🗑️ setCSRFToken() called - CSRF Token CLEARED (NULL)`);
      this.csrfToken = null;
    }
  }

  getCSRFToken() {
    console.log(`📦 getCSRFToken() called - current token:`, this.csrfToken ? '✅ PRESENT' : '❌ NULL');
    return this.csrfToken;
  }

  async fetchCSRFToken() {
    // Fetch a new CSRF token from the server
    try {
      console.log('🔐 Fetching CSRF token...');
      const response = await this.requestWithoutAuth('/customer/csrf-token', {
        method: 'GET',
      });

      if (response.csrf_token) {
        this.setCSRFToken(response.csrf_token);
        console.log('✅ CSRF token fetched and set');
        return response.csrf_token;
      }
    } catch (error) {
      console.error('❌ Failed to fetch CSRF token:', error.message);
    }
    return null;
  }

  setRefreshToken(token) {
    if (token) {
      console.log(`✅ setRefreshToken() called - Token SET (length: ${token.length})`);
      this.refreshToken = token;
    } else {
      console.log(`🗑️ setRefreshToken() called - Token CLEARED (NULL)`);
      this.refreshToken = null;
    }
    console.log(`   Current apiClient.refreshToken after set:`, this.refreshToken ? 'PRESENT' : 'NULL');
  }

  getToken() {
    console.log(`📦 getToken() called - current token:`, this.token ? '✅ PRESENT' : '❌ NULL');
    return this.token;
  }

  getRefreshToken() {
    console.log(`📦 getRefreshToken() called - current refresh token:`, this.refreshToken ? '✅ PRESENT' : '❌ NULL');
    return this.refreshToken;
  }

  subscribeTokenRefresh(callback) {
    this.refreshSubscribers.push(callback);
  }

  notifyTokenRefresh(newToken) {
    this.refreshSubscribers.forEach(callback => callback(newToken));
    this.refreshSubscribers = [];
  }

  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      console.warn('⚠️ No refresh token available for token refresh');
      this.handleTokenExpiration();
      return false;
    }

    try {
      const response = await this.requestWithoutAuth('/customer/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.access_token) {
        this.setToken(response.access_token);
        if (response.refresh_token) {
          this.setRefreshToken(response.refresh_token);
        }
        this.notifyTokenRefresh(response.access_token);
        return true;
      }
      console.warn('⚠️ Token refresh failed: No access_token in response');
      this.handleTokenExpiration();
      return false;
    } catch (error) {
      console.error('❌ Token refresh error:', error.message);
      this.handleTokenExpiration();
      return false;
    }
  }

  handleTokenExpiration() {
    console.warn('🔐 Token expired or invalid - clearing auth and redirecting to login');
    // Clear all tokens and auth state
    this.setToken(null);
    this.setRefreshToken(null);
    
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage?.removeItem('user');
      localStorage?.removeItem('token');
      localStorage?.removeItem('refreshToken');
      localStorage?.removeItem('access_token');
      localStorage?.removeItem('refresh_token');
      
      // Dispatch custom event for AuthContext to listen to
      window.dispatchEvent(new Event('auth:expired'));
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/account/login')) {
        window.location.href = '/account/login';
      }
    }
  }

  async requestWithoutAuth(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',  // Include cookies
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
      console.log(`✅ [${options.method || 'GET'}] ${endpoint} - Authorization header SET`);
    } else {
      console.warn(`⚠️ [${options.method || 'GET'}] ${endpoint} - No token available, Authorization header NOT set`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',  // IMPORTANT: Include cookies automatically
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorDetail = '';
        let errorData = null;
        
        try {
          // Clone response for parsing since we can only read it once
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json();
            console.log('📊 Error response data:', errorData);
            
            // Extract detailed error message from Pydantic validation errors or standard error response
            if (errorData.detail) {
              if (Array.isArray(errorData.detail)) {
                // Handle Pydantic validation error array
                errorDetail = errorData.detail
                  .map(err => {
                    if (typeof err === 'object') {
                      // Try different error object formats
                      return err.msg || err.message || err.detail || String(err);
                    }
                    return String(err);
                  })
                  .filter(msg => msg) // Remove empty strings
                  .join('; ');
              } else if (typeof errorData.detail === 'string') {
                errorDetail = errorData.detail;
              } else if (typeof errorData.detail === 'object') {
                errorDetail = JSON.stringify(errorData.detail);
              }
            }
          }
        } catch (parseErr) {
          console.warn('⚠️ Failed to parse error response:', parseErr.message);
        }

        // Check if it's a 401 (Unauthorized) error
        if (response.status === 401) {
          console.warn('🔐 Received 401 Unauthorized - attempting token refresh');
          // Try to refresh the token
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            const refreshed = await this.refreshAccessToken();
            this.isRefreshing = false;
            
            if (refreshed) {
              // Retry the original request with the new token
              console.log('🔄 Retrying original request with refreshed token');
              return this.request(endpoint, options);
            } else {
              // Token refresh failed, handle expiration
              console.error('❌ Token refresh failed - session expired');
              this.handleTokenExpiration();
            }
          }
        }

        // Check if it's a 429 (Too Many Requests) error - Rate Limit
        if (response.status === 429) {
          console.warn('🔒 Rate limit exceeded (429)');
          // Extract retry-after from error message if available
          const retryAfter = errorDetail.match(/\d+/)?.[0] || '60';
          const errorMessage = errorDetail || `Too many requests. Please try again in ${retryAfter} seconds.`;
          
          throw new Error(`HTTP 429: ${errorMessage}`);
        }

        // Build final error message
        const finalErrorMessage = errorDetail 
          ? `HTTP ${response.status}: ${errorDetail}`
          : `HTTP ${response.status}: ${response.statusText}`;
        
        console.error(`❌ API Error [${response.status}]:`, finalErrorMessage);
        throw new Error(finalErrorMessage);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new APIClient();
export default APIClient;
