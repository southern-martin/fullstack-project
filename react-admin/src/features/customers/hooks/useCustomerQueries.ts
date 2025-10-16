import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { customerKeys } from '../../../shared/query/queryKeys';
import { PaginationParams } from '../../../shared/types';
import {
  CreateCustomerDto,
  Customer,
  customerService,
  UpdateCustomerDto,
} from '../services/customerService';

/**
 * Customer Service Hooks using TanStack Query
 */

// Get customers list with pagination
export const useCustomers = (
  params: PaginationParams = { page: 1, limit: 10 }
) => {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => customerService.getCustomers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get customer by ID
export const useCustomer = (id: string | number) => {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerService.getCustomer(Number(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get customers count
export const useCustomersCount = () => {
  return useQuery({
    queryKey: customerKeys.count(),
    queryFn: () => customerService.getCustomerCount(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Search customers - TODO: Implement search method in customerService
// export const useCustomersSearch = (searchTerm: string) => {
//   return useQuery({
//     queryKey: customerKeys.search(searchTerm),
//     queryFn: () => customerService.searchCustomers(searchTerm),
//     enabled: !!searchTerm && searchTerm.length > 2,
//     staleTime: 1 * 60 * 1000, // 1 minute
//   });
// };

// Create customer mutation
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerDto) =>
      customerService.createCustomer(data),
    onSuccess: (newCustomer: Customer) => {
      // Invalidate customers list to refetch
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });

      // Invalidate count
      queryClient.invalidateQueries({ queryKey: customerKeys.count() });

      // Add new customer to cache
      queryClient.setQueryData(
        customerKeys.detail(newCustomer.id),
        newCustomer
      );
    },
    onError: (error: any) => {
      console.error('Create customer failed:', error);
    },
  });
};

// Update customer mutation
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: UpdateCustomerDto;
    }) => customerService.updateCustomer(Number(id), data),
    onSuccess: (updatedCustomer: Customer, variables) => {
      // Update customer in cache
      queryClient.setQueryData(
        customerKeys.detail(variables.id),
        updatedCustomer
      );

      // Invalidate customers list to refetch
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });

      // Update customer in all lists
      queryClient.setQueriesData(
        { queryKey: customerKeys.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((customer: Customer) =>
              customer.id === variables.id ? updatedCustomer : customer
            ),
          };
        }
      );
    },
    onError: (error: any) => {
      console.error('Update customer failed:', error);
    },
  });
};

// Delete customer mutation
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) =>
      customerService.deleteCustomer(Number(id)),
    onSuccess: (_, deletedId) => {
      // Remove customer from cache
      queryClient.removeQueries({ queryKey: customerKeys.detail(deletedId) });

      // Invalidate customers list to refetch
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });

      // Invalidate count
      queryClient.invalidateQueries({ queryKey: customerKeys.count() });

      // Remove customer from all lists
      queryClient.setQueriesData(
        { queryKey: customerKeys.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter(
              (customer: Customer) => customer.id !== deletedId
            ),
            total: oldData.total - 1,
          };
        }
      );
    },
    onError: (error: any) => {
      console.error('Delete customer failed:', error);
    },
  });
};

// Bulk delete customers mutation - TODO: Implement bulkDeleteCustomers method in customerService
// export const useBulkDeleteCustomers = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (ids: (string | number)[]) => customerService.bulkDeleteCustomers(ids),
//     onSuccess: (_, deletedIds) => {
//       // Remove customers from cache
//       deletedIds.forEach(id => {
//         queryClient.removeQueries({ queryKey: customerKeys.detail(id) });
//       });

//       // Invalidate customers list to refetch
//       queryClient.invalidateQueries({ queryKey: customerKeys.lists() });

//       // Invalidate count
//       queryClient.invalidateQueries({ queryKey: customerKeys.count() });
//     },
//     onError: (error: any) => {
//       console.error('Bulk delete customers failed:', error);
//     },
//   });
// };
