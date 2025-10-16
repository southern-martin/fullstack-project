import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { carrierKeys } from '../../../shared/query/queryKeys';
import { PaginationParams } from '../../../shared/types';
import {
  Carrier,
  carrierService,
  CreateCarrierDto,
  UpdateCarrierDto,
} from '../services/carrierService';

/**
 * Carrier Service Hooks using TanStack Query
 */

// Get carriers list with pagination
export const useCarriers = (
  params: PaginationParams = { page: 1, limit: 10 }
) => {
  return useQuery({
    queryKey: carrierKeys.list(params),
    queryFn: () => carrierService.getCarriers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get carrier by ID
export const useCarrier = (id: string | number) => {
  return useQuery({
    queryKey: carrierKeys.detail(id),
    queryFn: () => carrierService.getCarrier(Number(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get carriers count
export const useCarriersCount = () => {
  return useQuery({
    queryKey: carrierKeys.count(),
    queryFn: () => carrierService.getCarrierCount(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Search carriers - TODO: Implement search method in carrierService
// export const useCarriersSearch = (searchTerm: string) => {
//   return useQuery({
//     queryKey: carrierKeys.search(searchTerm),
//     queryFn: () => carrierService.searchCarriers(searchTerm),
//     enabled: !!searchTerm && searchTerm.length > 2,
//     staleTime: 1 * 60 * 1000, // 1 minute
//   });
// };

// Create carrier mutation
export const useCreateCarrier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCarrierDto) => carrierService.createCarrier(data),
    onSuccess: (newCarrier: Carrier) => {
      // Invalidate carriers list to refetch
      queryClient.invalidateQueries({ queryKey: carrierKeys.lists() });

      // Invalidate count
      queryClient.invalidateQueries({ queryKey: carrierKeys.count() });

      // Add new carrier to cache
      queryClient.setQueryData(carrierKeys.detail(newCarrier.id), newCarrier);
    },
    onError: (error: any) => {
      console.error('Create carrier failed:', error);
    },
  });
};

// Update carrier mutation
export const useUpdateCarrier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: UpdateCarrierDto;
    }) => carrierService.updateCarrier(Number(id), data),
    onSuccess: (updatedCarrier: Carrier, variables) => {
      // Update carrier in cache
      queryClient.setQueryData(
        carrierKeys.detail(variables.id),
        updatedCarrier
      );

      // Invalidate carriers list to refetch
      queryClient.invalidateQueries({ queryKey: carrierKeys.lists() });

      // Update carrier in all lists
      queryClient.setQueriesData(
        { queryKey: carrierKeys.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((carrier: Carrier) =>
              carrier.id === variables.id ? updatedCarrier : carrier
            ),
          };
        }
      );
    },
    onError: (error: any) => {
      console.error('Update carrier failed:', error);
    },
  });
};

// Delete carrier mutation
export const useDeleteCarrier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) =>
      carrierService.deleteCarrier(Number(id)),
    onSuccess: (_, deletedId) => {
      // Remove carrier from cache
      queryClient.removeQueries({ queryKey: carrierKeys.detail(deletedId) });

      // Invalidate carriers list to refetch
      queryClient.invalidateQueries({ queryKey: carrierKeys.lists() });

      // Invalidate count
      queryClient.invalidateQueries({ queryKey: carrierKeys.count() });

      // Remove carrier from all lists
      queryClient.setQueriesData(
        { queryKey: carrierKeys.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter(
              (carrier: Carrier) => carrier.id !== deletedId
            ),
            total: oldData.total - 1,
          };
        }
      );
    },
    onError: (error: any) => {
      console.error('Delete carrier failed:', error);
    },
  });
};

// Bulk delete carriers mutation - TODO: Implement bulkDeleteCarriers method in carrierService
// export const useBulkDeleteCarriers = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (ids: (string | number)[]) => carrierService.bulkDeleteCarriers(ids),
//     onSuccess: (_, deletedIds) => {
//       // Remove carriers from cache
//       deletedIds.forEach(id => {
//         queryClient.removeQueries({ queryKey: carrierKeys.detail(id) });
//       });

//       // Invalidate carriers list to refetch
//       queryClient.invalidateQueries({ queryKey: carrierKeys.lists() });

//       // Invalidate count
//       queryClient.invalidateQueries({ queryKey: carrierKeys.count() });
//     },
//     onError: (error: any) => {
//       console.error('Bulk delete carriers failed:', error);
//     },
//   });
// };
