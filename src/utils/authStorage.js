import { CONFIG } from '@/config';

const USER_KEY = CONFIG.STORAGE.USER_KEY;

const LEGACY_TOKEN_KEYS = [
  'access_token',
  'refresh_token',
  'token',
  'refreshToken',
];

/** Remove legacy JWT storage from localStorage (XSS risk). */
export function clearLegacyTokenStorage() {
  if (typeof window === 'undefined') return;

  LEGACY_TOKEN_KEYS.forEach((key) => {
    localStorage.removeItem(key);
  });
}

export function saveUser(user) {
  if (typeof window === 'undefined' || !user) return;
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearStoredUser() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_KEY);
}

export function clearAuthStorage() {
  clearLegacyTokenStorage();
  clearStoredUser();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth:logout'));
  }
}
