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
        // If refresh fails, user is simply an unauthenticated guest
        return Promise.reject(refreshErr);
      }
    }

    const isSilentAuthCheck =
      error.response?.status === 401 &&
      (originalRequest?.url?.includes('/auth/me') || originalRequest?.url?.includes('/auth/refresh'));

    const message = error.response?.data?.message || error.message || 'Network error occurred';

    // Do not log noisy console errors for expected guest session checks
    if (!isSilentAuthCheck) {
      console.error('Storefront API Error:', message);
    }

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
