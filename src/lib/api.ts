import axios from 'axios';

// ============================================================
// Axios Instance
// ⚠️ Content-Type default দেওয়া যাবে না — FormData-এর boundary নষ্ট হবে
// ============================================================

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  // ⚠️ কোনো default Content-Type header নেই
});

// ============================================================
// Request Interceptor
// - FormData হলে → Content-Type remove করে দাও (browser auto-set করবে)
// - JSON হলে → application/json set করো
// ============================================================

api.interceptors.request.use(
  (config) => {
    // FormData হলে Content-Type header remove
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers['Content-Type'];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// Response Interceptor — 401 redirect
// ============================================================

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (
        typeof window !== 'undefined' &&
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        const protectedPaths = [
          '/admin',
          '/moderator',
          '/dashboard',
          '/my-reports',
          '/create-report',
          '/notifications',
          '/chat',
          '/support',
          '/profile',
          '/moderator-application',
        ];
        const isProtected = protectedPaths.some((p) => window.location.pathname.startsWith(p));
        if (isProtected) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ============================================================
// Error helper
// ============================================================

export const getApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message ?? 'Something went wrong';
  }
  return 'Something went wrong';
};
