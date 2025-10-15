/**
 * Centralized query keys for all microservices
 * This ensures consistent query key structure across the application
 */

// Base query key factory
export const createQueryKey = (
  service: string,
  ...keys: (string | number | boolean)[]
) => {
  return [service, ...keys] as const;
};

// Auth Service Query Keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
  health: () => [...authKeys.all, 'health'] as const,
  validate: () => [...authKeys.all, 'validate'] as const,
} as const;

// User Service Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) =>
    [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...userKeys.details(), id] as const,
  count: () => [...userKeys.all, 'count'] as const,
  search: (searchTerm: string) =>
    [...userKeys.all, 'search', searchTerm] as const,
} as const;

// Customer Service Query Keys
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) =>
    [...customerKeys.lists(), filters] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...customerKeys.details(), id] as const,
  count: () => [...customerKeys.all, 'count'] as const,
  search: (searchTerm: string) =>
    [...customerKeys.all, 'search', searchTerm] as const,
} as const;

// Carrier Service Query Keys
export const carrierKeys = {
  all: ['carriers'] as const,
  lists: () => [...carrierKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) =>
    [...carrierKeys.lists(), filters] as const,
  details: () => [...carrierKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...carrierKeys.details(), id] as const,
  count: () => [...carrierKeys.all, 'count'] as const,
  search: (searchTerm: string) =>
    [...carrierKeys.all, 'search', searchTerm] as const,
} as const;

// Pricing Service Query Keys
export const pricingKeys = {
  all: ['pricing'] as const,
  lists: () => [...pricingKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) =>
    [...pricingKeys.lists(), filters] as const,
  details: () => [...pricingKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...pricingKeys.details(), id] as const,
  count: () => [...pricingKeys.all, 'count'] as const,
  search: (searchTerm: string) =>
    [...pricingKeys.all, 'search', searchTerm] as const,
} as const;

// Translation Service Query Keys
export const translationKeys = {
  all: ['translations'] as const,
  lists: () => [...translationKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) =>
    [...translationKeys.lists(), filters] as const,
  details: () => [...translationKeys.all, 'detail'] as const,
  detail: (id: string | number) => [...translationKeys.details(), id] as const,
  count: () => [...translationKeys.all, 'count'] as const,
  search: (searchTerm: string) =>
    [...translationKeys.all, 'search', searchTerm] as const,
  languages: () => [...translationKeys.all, 'languages'] as const,
  language: (code: string) => [...translationKeys.languages(), code] as const,
} as const;

// Dashboard Query Keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  microservices: () => [...dashboardKeys.all, 'microservices'] as const,
  health: () => [...dashboardKeys.all, 'health'] as const,
} as const;

// Export all query keys for easy access
export const queryKeys = {
  auth: authKeys,
  users: userKeys,
  customers: customerKeys,
  carriers: carrierKeys,
  pricing: pricingKeys,
  translations: translationKeys,
  dashboard: dashboardKeys,
} as const;
