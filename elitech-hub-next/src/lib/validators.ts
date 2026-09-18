/**
 * Input validation and sanitisation utilities
 * Mirrors the old backend's auth.js validation patterns
 */

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^[+\d\s\-().]{7,20}$/;

/** Strip all HTML tags and trim whitespace */
export function sanitizeText(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(/<[^>]*>/g, '').trim();
}

/** Validate and normalise an email address */
export function validateEmail(email: unknown): { valid: boolean; value: string; error?: string } {
  const str = sanitizeText(email);
  if (!str) return { valid: false, value: '', error: 'Email is required' };
  if (!emailRegex.test(str)) return { valid: false, value: str, error: 'Invalid email format' };
  return { valid: true, value: str.toLowerCase() };
}

/** Validate password strength — mirrors old auth.js rules */
export function validatePassword(password: unknown): { valid: boolean; error?: string } {
  if (typeof password !== 'string' || password.length < 8)
    return { valid: false, error: 'Password must be at least 8 characters' };
  if (!/[A-Z]/.test(password))
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  if (!/[0-9]/.test(password))
    return { valid: false, error: 'Password must contain at least one number' };
  return { valid: true };
}

/** Validate a phone number (optional field) */
export function validatePhone(phone: unknown): boolean {
  if (!phone) return true; // optional
  return phoneRegex.test(sanitizeText(phone));
}

/** Reject anything that isn't a plain string of reasonable length */
export function validateField(
  value: unknown,
  fieldName: string,
  maxLength = 2000
): { valid: boolean; value: string; error?: string } {
  const str = sanitizeText(value);
  if (!str) return { valid: false, value: '', error: `${fieldName} is required` };
  if (str.length > maxLength)
    return { valid: false, value: str, error: `${fieldName} is too long (max ${maxLength} chars)` };
  return { valid: true, value: str };
}
