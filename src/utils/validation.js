/**
 * Global Validation & Input Sanitization Utilities
 * - UAE Mobile Numbers: strictly 9 digits after +971 (e.g. 50 123 4567)
 * - Email addresses: strictly requires valid @gmail.com domain
 */

/**
 * Strips all non-digit characters and caps length to 9 digits.
 * Automatically strips a leading zero if user types e.g. 050...
 * @param {string} value 
 * @returns {string} 9 digits only (e.g. 501234567)
 */
export function formatUaePhone9Digits(value = '') {
  if (typeof value !== 'string') return '';
  let digits = value.replace(/\D/g, '');
  // If user enters leading 0 (e.g. 0501234567), strip the leading 0 when paired with +971
  if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }
  return digits.slice(0, 9);
}

// Alias for compatibility
export const format10DigitPhone = formatUaePhone9Digits;

/**
 * Validates a 9-digit UAE mobile number (after +971)
 * @param {string} phone 
 * @returns {{ isValid: boolean, error: string }}
 */
export function validateUaePhone9Digits(phone = '') {
  const digits = formatUaePhone9Digits(phone);
  if (!digits) {
    return { isValid: false, error: 'UAE mobile number is required' };
  }
  if (digits.length !== 9) {
    return { isValid: false, error: 'Please enter a valid 9-digit UAE mobile number (e.g. 50 123 4567)' };
  }
  if (!digits.startsWith('5')) {
    return { isValid: false, error: 'UAE mobile numbers start with 5 (e.g. 50, 52, 54, 55, 56, 58)' };
  }
  return { isValid: true, error: '' };
}

// Alias for compatibility
export const validate10DigitPhone = validateUaePhone9Digits;

/**
 * Validates that an email is present and ends with @gmail.com
 * @param {string} email 
 * @returns {{ isValid: boolean, error: string }}
 */
export function validateGmail(email = '') {
  const cleanEmail = (typeof email === 'string' ? email : '').trim().toLowerCase();
  if (!cleanEmail) {
    return { isValid: false, error: 'Email address is required' };
  }
  
  // Gmail format: username@gmail.com
  const gmailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;
  if (!gmailRegex.test(cleanEmail)) {
    return { 
      isValid: false, 
      error: 'Please enter a valid Gmail address (must end with @gmail.com)' 
    };
  }
  return { isValid: true, error: '' };
}
