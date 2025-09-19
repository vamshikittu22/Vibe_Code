// Token storage keys
const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';

/**
 * Get the authentication token from localStorage
 * @returns {string|null} The authentication token or null if not found/expired
 */
export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  
  // Check if token exists and is not expired
  if (token && expiry) {
    const now = new Date().getTime();
    if (now < parseInt(expiry, 10)) {
      return token;
    }
    // Token expired, clean up
    clearToken();
  }
  return null;
};

/**
 * Set the authentication token in localStorage
 * @param {string} token - The JWT token
 * @param {number} [expiresIn=86400] - Token expiry time in seconds (default: 1 day)
 */
export const setToken = (token, expiresIn = 24 * 60 * 60) => {
  if (!token) return;
  
  const now = new Date().getTime();
  const expiry = now + expiresIn * 1000; // Convert to milliseconds
  
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
};

/**
 * Clear the authentication token from localStorage
 */
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Get the current user from the token (if available)
 * Note: This is a client-side only check and doesn't validate the token
 * @returns {Object|null} The decoded token payload or null if not available
 */
export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    // Decode the token (without verification)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
