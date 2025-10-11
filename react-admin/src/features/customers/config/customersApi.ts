export const CUSTOMERS_API_CONFIG = {
  ENDPOINTS: {
    LIST: "/customers",
    CREATE: "/customers",
    UPDATE: (id: number) => `/customers/${id}`,
    DELETE: (id: number) => `/customers/${id}`,
    BY_EMAIL: (email: string) => `/customers/email/${email}`,
    ACTIVE: "/customers/active",
  },
} as const;

export const CUSTOMERS_ROUTES = {
  CUSTOMERS: "/customers",
} as const;

