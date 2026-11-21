import axios from 'axios';

const rawUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise = null;

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Attempt automatic silent refresh for expired sessions (once)
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true })
            .finally(() => {
              refreshPromise = null;
            });
        }
        await refreshPromise;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        // If refresh fails, session is dead -> clear session hint
        if (typeof window !== 'undefined') {
          try { localStorage.removeItem('has_session'); } catch (e) {}
        }
        return Promise.reject(refreshErr);
      }
    }

    const isClientExpectedError = error.response && (error.response.status >= 400 && error.response.status < 500);
    const message = error.response?.data?.message || error.message || 'Network error occurred';

    // Only log unexpected server errors (5xx/network) to console.error to avoid Next.js dev overlay on expected validation/auth errors
    if (!isClientExpectedError) {
      console.error('Storefront API Error:', message);
    }

    const customErr = new Error(message);
    customErr.response = error.response;
    return Promise.reject(customErr);
  }
);

export default axiosInstance;
