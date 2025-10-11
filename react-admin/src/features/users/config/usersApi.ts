export const USERS_API_CONFIG = {
  ENDPOINTS: {
    LIST: "/users",
    CREATE: "/users",
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
    BY_EMAIL: (email: string) => `/users/email/${email}`,
    ACTIVE: "/users/active",
    COUNT: "/users/count",
    BY_ROLE: (roleName: string) => `/users/role/${roleName}`,
    EXISTS: (email: string) => `/users/exists/${email}`,
    ASSIGN_ROLES: (id: number) => `/users/${id}/roles`,
  },
} as const;

export const USERS_ROUTES = {
  USERS: "/users",
} as const;

