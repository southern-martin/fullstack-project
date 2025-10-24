export const ROLES_API_CONFIG = {
  ENDPOINTS: {
    LIST: '/roles',
    CREATE: '/roles',
    UPDATE: (id: number) => `/roles/${id}`,
    DELETE: (id: number) => `/roles/${id}`,
    BY_ID: (id: number) => `/roles/${id}`,
    BY_NAME: (name: string) => `/roles/name/${name}`,
    ACTIVE: '/roles/active',
    COUNT: '/roles/count',
    STATS: '/roles/stats',
    ASSIGN_PERMISSIONS: (id: number) => `/roles/${id}/permissions`,
    USERS_BY_ROLE: (id: number) => `/roles/${id}/users`,
  },
  PERMISSIONS: {
    LIST: '/permissions',
    BY_CATEGORY: (category: string) => `/permissions/category/${category}`,
    CATEGORIES: '/permissions/categories',
  },
} as const;

export const ROLES_ROUTES = {
  ROLES: '/roles',
  ROLE_DETAILS: (id: number) => `/roles/${id}`,
  ROLE_CREATE: '/roles/create',
  ROLE_EDIT: (id: number) => `/roles/${id}/edit`,
} as const;
