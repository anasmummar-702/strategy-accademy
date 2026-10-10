/**
 * STRATEGY Control Center Admin API Client
 * Connects to /api/v1/admin/... server endpoints
 */

const API_BASE_URL = 'http://localhost:5000/api/v1';

export class AdminApiError extends Error {
  constructor(message, status = 500, details = null) {
    super(message);
    this.name = 'AdminApiError';
    this.status = status;
    this.details = details;
  }
}

let storedToken = typeof window !== 'undefined' ? localStorage.getItem('strategy_admin_token') : null;

export const setAuthToken = (token) => {
  storedToken = token;
  if (token) {
    localStorage.setItem('strategy_admin_token', token);
  } else {
    localStorage.removeItem('strategy_admin_token');
  }
};

export const getAuthToken = () => {
  return storedToken || (typeof window !== 'undefined' ? localStorage.getItem('strategy_admin_token') : null);
};

async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'omit', // use JWT bearer token header
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok || !result.success) {
      const errorMessage = result.error?.message || result.message || 'API Request failed';
      throw new AdminApiError(errorMessage, response.status, result.error?.details);
    }

    return result;
  } catch (err) {
    if (err instanceof AdminApiError) {
      throw err;
    }
    // If backend server is unreachable, throw clear error
    throw new AdminApiError(
      err.message || 'Unable to connect to backend API server on port 5000',
      0,
      { isNetworkError: true }
    );
  }
}

export const adminApi = {
  // Authentication
  async login(email, password) {
    const res = await apiRequest('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res.data;
  },

  async me() {
    const res = await apiRequest('/admin/auth/me');
    return res.data;
  },

  async logout() {
    try {
      await apiRequest('/admin/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignore logout errors
    } finally {
      setAuthToken(null);
    }
  },

  async changePassword(currentPassword, newPassword) {
    const res = await apiRequest('/admin/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return res.data;
  },

  // Dashboard
  async getDashboardKpis() {
    const res = await apiRequest('/admin/dashboard/kpis');
    return res.data;
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await apiRequest(`/admin/products?${query}`);
    return res;
  },

  // File Upload
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const token = getAuthToken();
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/admin/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new AdminApiError(result.error?.message || 'File upload failed', response.status);
    }
    return result.data;
  }
};
