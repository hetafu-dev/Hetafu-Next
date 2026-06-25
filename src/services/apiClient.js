import { dedupeRequest } from './requestDedupe';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000');
const GET_DEDUPE_TTL_MS = 60_000;
const CSRF_GLOBAL_KEY = '__hetafuCsrfToken';

class APIClient {
  constructor(baseURL = API_URL, timeout = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
    this.csrfToken = null;
    this.isRefreshing = false;
  }

  setCSRFToken(token) {
    this.csrfToken = token || null;
    if (typeof globalThis !== 'undefined') {
      if (token) globalThis[CSRF_GLOBAL_KEY] = token;
      else delete globalThis[CSRF_GLOBAL_KEY];
    }
  }

  getCSRFToken() {
    if (typeof globalThis !== 'undefined' && globalThis[CSRF_GLOBAL_KEY]) {
      this.csrfToken = globalThis[CSRF_GLOBAL_KEY];
    }
    return this.csrfToken;
  }

  async fetchCSRFToken() {
    try {
      const response = await this.requestWithoutAuth('/customer/csrf-token', {
        method: 'GET',
        _skipDedupe: true,
      });

      if (response.csrf_token) {
        this.setCSRFToken(response.csrf_token);
        return response.csrf_token;
      }
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error.message);
    }
    return null;
  }

  _isMutatingMethod(method = 'GET') {
    return ['POST', 'PUT', 'DELETE', 'PATCH'].includes((method || 'GET').toUpperCase());
  }

  _extractErrorDetail(errorData, fallback = '') {
    if (!errorData) return fallback;
    if (typeof errorData.detail === 'string') return errorData.detail;
    if (Array.isArray(errorData.detail)) {
      return errorData.detail
        .map((err) => (typeof err === 'object' ? err.msg || err.message || String(err) : String(err)))
        .filter(Boolean)
        .join('; ');
    }
    if (errorData.error?.message) return errorData.error.message;
    return fallback;
  }

  _isCsrfError(message = '') {
    return String(message).toLowerCase().includes('csrf');
  }

  async _refreshCsrfAfterMutation(method) {
    if (this._isMutatingMethod(method)) {
      this.setCSRFToken(null);
      await this.fetchCSRFToken();
    }
  }

  async ensureCSRFToken(method = 'GET') {
    if (!this._isMutatingMethod(method)) {
      return;
    }
    if (!this.getCSRFToken()) {
      await this.fetchCSRFToken();
    }
  }

  _applyCSRFHeader(headers, method = 'GET') {
    const token = this.getCSRFToken();
    if (this._isMutatingMethod(method) && token) {
      headers['X-CSRF-Token'] = token;
    }
    return headers;
  }

  async refreshAccessToken() {
    try {
      const response = await this.requestWithoutAuth('/customer/refresh', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      if (response.authenticated) {
        return true;
      }
    } catch (error) {
      console.error('Token refresh error:', error.message);
    }

    this.handleTokenExpiration();
    return false;
  }

  handleTokenExpiration() {
    if (typeof window === 'undefined') return;

    this.setCSRFToken(null);
    window.dispatchEvent(new Event('auth:expired'));

    if (!window.location.pathname.includes('/account/login')) {
      window.location.href = '/account/login';
    }
  }

  async _requestWithoutAuthOnce(url, options = {}) {
    const method = options.method || 'GET';

    await this.ensureCSRFToken(method);

    const headers = this._applyCSRFHeader({
      'Content-Type': 'application/json',
      ...options.headers,
    }, method);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorDetail = this._extractErrorDetail(
          errorData,
          `HTTP ${response.status}: ${response.statusText}`,
        );

        if (response.status === 403 && !options._csrfRetried && this._isCsrfError(errorDetail)) {
          this.setCSRFToken(null);
          await this.fetchCSRFToken();
          return this._requestWithoutAuthOnce(url, { ...options, _csrfRetried: true });
        }

        throw new Error(errorDetail || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      await this._refreshCsrfAfterMutation(method);
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async requestWithoutAuth(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const method = (options.method || 'GET').toUpperCase();

    if (method === 'GET' && !options._skipDedupe) {
      return dedupeRequest(
        `GET|${url}`,
        () => this._requestWithoutAuthOnce(url, options),
        { ttlMs: GET_DEDUPE_TTL_MS },
      );
    }

    return this._requestWithoutAuthOnce(url, options);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const method = options.method || 'GET';

    await this.ensureCSRFToken(method);

    const headers = this._applyCSRFHeader({
      'Content-Type': 'application/json',
      ...options.headers,
    }, method);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorDetail = '';

        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorDetail = this._extractErrorDetail(errorData);
          }
        } catch {
          // Ignore parse errors
        }

        if (response.status === 401 && !options._authRetried) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            const refreshed = await this.refreshAccessToken();
            this.isRefreshing = false;

            if (refreshed) {
              return this.request(endpoint, { ...options, _authRetried: true });
            }
          }

          this.handleTokenExpiration();
        }

        if (response.status === 403 && !options._csrfRetried && this._isCsrfError(errorDetail)) {
          this.setCSRFToken(null);
          await this.fetchCSRFToken();
          return this.request(endpoint, { ...options, _csrfRetried: true });
        }

        if (response.status === 429) {
          const retryAfter = errorDetail.match(/\d+/)?.[0] || '60';
          throw new Error(`HTTP 429: ${errorDetail || `Too many requests. Please try again in ${retryAfter} seconds.`}`);
        }

        throw new Error(errorDetail ? `HTTP ${response.status}: ${errorDetail}` : `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      await this._refreshCsrfAfterMutation(method);
      return data;
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
      body: JSON.stringify(data ?? {}),
    });
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data ?? {}),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data ?? {}),
    });
  }
}

export const apiClient = new APIClient();
export default APIClient;
