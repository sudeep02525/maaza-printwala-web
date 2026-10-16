import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
        await axios.post(`${BASE_URL}/api/auth/refresh`, {}, { withCredentials: true });
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
