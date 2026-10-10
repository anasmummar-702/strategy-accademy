/**
 * STRATEGY Public Client API Service
 * Fetches live published content & sends bookings/orders to the backend API (/api/v1/public)
 */

const API_BASE_URL = 'http://localhost:5000/api/v1/public';

async function fetchPublic(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1500);

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timeoutId);
    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.error?.message || result.message || 'API error');
    }
    return result.data;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn(`Public API call [${endpoint}] failed:`, err.message);
    throw err;
  }
}

export const publicApi = {
  async getStorefrontInit() {
    return await fetchPublic('/storefront/init');
  },

  async getHomepage() {
    return await fetchPublic('/homepage');
  },

  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const endpoint = query ? `/products?${query}` : '/products';
    return await fetchPublic(endpoint);
  },

  async getProductBySlug(slug) {
    return await fetchPublic(`/products/${slug}`);
  },

  async getCategories() {
    return await fetchPublic('/categories');
  },

  async getCollections() {
    return await fetchPublic('/collections');
  },

  async getPrograms() {
    return await fetchPublic('/programs');
  },

  async getCoaches() {
    return await fetchPublic('/coaches');
  },

  async submitOrder(orderData) {
    return await fetchPublic('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  async submitEnquiry(enquiryData) {
    return await fetchPublic('/enquiries', {
      method: 'POST',
      body: JSON.stringify(enquiryData),
    });
  },
};
