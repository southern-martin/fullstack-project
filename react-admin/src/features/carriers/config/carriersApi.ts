export const CARRIERS_API_CONFIG = {
  ENDPOINTS: {
    LIST: "/carriers",
    CREATE: "/carriers",
    UPDATE: (id: number) => `/carriers/${id}`,
    DELETE: (id: number) => `/carriers/${id}`,
    ACTIVE: "/carriers/active",
  },
} as const;

export const CARRIERS_ROUTES = {
  CARRIERS: "/carriers",
} as const;

