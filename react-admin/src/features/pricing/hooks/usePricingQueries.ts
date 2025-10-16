import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pricingKeys } from '../../../shared/query/queryKeys';
import { PaginationParams } from '../../../shared/types';
import {
  CreatePricingRuleDto,
  PricingRule,
  pricingService,
  UpdatePricingRuleDto,
} from '../services/pricingService';

/**
 * Pricing Service Hooks using TanStack Query
 */

// Get pricing rules list with pagination
export const usePricingRules = (
  params: PaginationParams = { page: 1, limit: 10 }
) => {
  return useQuery({
    queryKey: pricingKeys.list(params),
    queryFn: () => pricingService.getPricingRules(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get pricing rule by ID
export const usePricingRule = (id: string | number) => {
  return useQuery({
    queryKey: pricingKeys.detail(id),
    queryFn: () => pricingService.getPricingRule(Number(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get pricing rules count
export const usePricingRulesCount = () => {
  return useQuery({
    queryKey: pricingKeys.count(),
    queryFn: () => pricingService.getPricingRuleCount(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Search pricing rules - TODO: Implement search method in pricingService
// export const usePricingRulesSearch = (searchTerm: string) => {
//   return useQuery({
//     queryKey: pricingKeys.search(searchTerm),
//     queryFn: () => pricingService.searchPricingRules(searchTerm),
//     enabled: !!searchTerm && searchTerm.length > 2,
//     staleTime: 1 * 60 * 1000, // 1 minute
//   });
// };

// Create pricing rule mutation
export const useCreatePricingRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePricingRuleDto) =>
      pricingService.createPricingRule(data),
    onSuccess: (newPricingRule: PricingRule) => {
      // Invalidate pricing rules list to refetch
      queryClient.invalidateQueries({ queryKey: pricingKeys.lists() });

      // Invalidate count
      queryClient.invalidateQueries({ queryKey: pricingKeys.count() });

      // Add new pricing rule to cache
      queryClient.setQueryData(
        pricingKeys.detail(newPricingRule.id),
        newPricingRule
      );
    },
    onError: (error: any) => {
      console.error('Create pricing rule failed:', error);
    },
  });
};

// Update pricing rule mutation
export const useUpdatePricingRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: UpdatePricingRuleDto;
    }) => pricingService.updatePricingRule(Number(id), data),
    onSuccess: (updatedPricingRule: PricingRule, variables) => {
      // Update pricing rule in cache
      queryClient.setQueryData(
        pricingKeys.detail(variables.id),
        updatedPricingRule
      );

      // Invalidate pricing rules list to refetch
      queryClient.invalidateQueries({ queryKey: pricingKeys.lists() });

      // Update pricing rule in all lists
      queryClient.setQueriesData(
        { queryKey: pricingKeys.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((pricingRule: PricingRule) =>
              pricingRule.id === variables.id ? updatedPricingRule : pricingRule
            ),
          };
        }
      );
    },
    onError: (error: any) => {
      console.error('Update pricing rule failed:', error);
    },
  });
};

// Delete pricing rule mutation
export const useDeletePricingRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) =>
      pricingService.deletePricingRule(Number(id)),
    onSuccess: (_, deletedId) => {
      // Remove pricing rule from cache
      queryClient.removeQueries({ queryKey: pricingKeys.detail(deletedId) });

      // Invalidate pricing rules list to refetch
      queryClient.invalidateQueries({ queryKey: pricingKeys.lists() });

      // Invalidate count
      queryClient.invalidateQueries({ queryKey: pricingKeys.count() });

      // Remove pricing rule from all lists
      queryClient.setQueriesData(
        { queryKey: pricingKeys.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter(
              (pricingRule: PricingRule) => pricingRule.id !== deletedId
            ),
            total: oldData.total - 1,
          };
        }
      );
    },
    onError: (error: any) => {
      console.error('Delete pricing rule failed:', error);
    },
  });
};

// Bulk delete pricing rules mutation - TODO: Implement bulkDeletePricingRules method in pricingService
// export const useBulkDeletePricingRules = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (ids: (string | number)[]) => pricingService.bulkDeletePricingRules(ids),
//     onSuccess: (_, deletedIds) => {
//       // Remove pricing rules from cache
//       deletedIds.forEach(id => {
//         queryClient.removeQueries({ queryKey: pricingKeys.detail(id) });
//       });

//       // Invalidate pricing rules list to refetch
//       queryClient.invalidateQueries({ queryKey: pricingKeys.lists() });

//       // Invalidate count
//       queryClient.invalidateQueries({ queryKey: pricingKeys.count() });
//     },
//     onError: (error: any) => {
//       console.error('Bulk delete pricing rules failed:', error);
//     },
//   });
// };
