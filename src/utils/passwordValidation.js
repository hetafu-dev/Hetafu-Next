/**
 * Client-side password validation aligned with Backend/app/utils/validators.py
 */

const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_\-+=[\]{};:'",.<>?/\\|`~]/;

const WEAK_PATTERNS = [
  /(.)\1{2,}/i,
  /(012|123|234|345|456|567|678|789|890)/,
  /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i,
  /(qwerty|asdfgh|zxcvbn|password|admin|letmein|welcome|monkey)/i,
];

export const PASSWORD_REQUIREMENTS =
  'At least 12 characters with uppercase, lowercase, number, and special character.';

export function validatePasswordStrength(password) {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 12) {
    return { valid: false, error: 'Password must be at least 12 characters long' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password must not exceed 128 characters' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter (A-Z)' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter (a-z)' };
  }

  if (!/\d/.test(password)) {
    return { valid: false, error: 'Password must contain at least one digit (0-9)' };
  }

  if (!SPECIAL_CHAR_REGEX.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one special character (!@#$%^&*...)',
    };
  }

  for (const pattern of WEAK_PATTERNS) {
    if (pattern.test(password)) {
      return {
        valid: false,
        error: 'Password contains weak or common patterns. Please use a unique combination',
      };
    }
  }

  return { valid: true, error: null };
}

/** Returns 0–100 score for password strength UI. */
export function getPasswordStrengthScore(password) {
  if (!password) return 0;

  let score = 0;
  if (password.length >= 12) score += 20;
  if (password.length >= 16) score += 10;
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/\d/.test(password)) score += 15;
  if (SPECIAL_CHAR_REGEX.test(password)) score += 15;
  if (!WEAK_PATTERNS.some((pattern) => pattern.test(password))) score += 10;

  return Math.min(score, 100);
}

export function getPasswordStrengthLabel(score) {
  if (score >= 100) return 'Strong';
  if (score >= 75) return 'Good';
  if (score >= 50) return 'Fair';
  if (score > 0) return 'Weak';
  return '';
}
