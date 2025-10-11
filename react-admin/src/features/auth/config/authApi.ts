export const AUTH_API_CONFIG = {
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
} as const;

export const AUTH_ROUTES = {
  LOGIN: '/login',
} as const;
