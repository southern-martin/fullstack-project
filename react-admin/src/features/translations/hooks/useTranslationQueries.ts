import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { translationKeys } from '../../../shared/query/queryKeys';
import { PaginationParams } from '../../../shared/types';
import {
  CreateLanguageDto,
  CreateTranslationDto,
  Language,
  Translation,
  translationService,
  UpdateLanguageDto,
  UpdateTranslationDto,
} from '../services/translationService';

/**
 * Translation Service Hooks using TanStack Query
 */

// Get translations list with pagination
export const useTranslations = (
  params: PaginationParams = { page: 1, limit: 10 }
) => {
  return useQuery({
    queryKey: translationKeys.list(params),
    queryFn: () => translationService.getTranslations(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get translation by ID
export const useTranslation = (id: string | number) => {
  return useQuery({
    queryKey: translationKeys.detail(id),
    queryFn: () => translationService.getTranslation(Number(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get translations count
export const useTranslationsCount = () => {
  return useQuery({
    queryKey: translationKeys.count(),
    queryFn: () => translationService.getTranslationCount(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Search translations - TODO: Implement search method in translationService
// export const useTranslationsSearch = (searchTerm: string) => {
//   return useQuery({
//     queryKey: translationKeys.search(searchTerm),
//     queryFn: () => translationService.searchTranslations(searchTerm),
//     enabled: !!searchTerm && searchTerm.length > 2,
//     staleTime: 1 * 60 * 1000, // 1 minute
//   });
// };

// Get languages list
export const useLanguages = () => {
  return useQuery({
    queryKey: translationKeys.languages(),
    queryFn: () => translationService.getLanguages(),
    staleTime: 10 * 60 * 1000, // 10 minutes (languages don't change often)
  });
};

// Get language by code
export const useLanguage = (code: string) => {
  return useQuery({
    queryKey: translationKeys.language(code),
    queryFn: () => translationService.getLanguageByCode(code),
    enabled: !!code,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Create translation mutation
export const useCreateTranslation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTranslationDto) =>
      translationService.createTranslation(data),
    onSuccess: (newTranslation: Translation) => {
      // Invalidate translations list to refetch
      queryClient.invalidateQueries({ queryKey: translationKeys.lists() });

      // Invalidate count
      queryClient.invalidateQueries({ queryKey: translationKeys.count() });

      // Add new translation to cache
      queryClient.setQueryData(
        translationKeys.detail(newTranslation.id),
        newTranslation
      );
    },
    onError: (error: any) => {
      console.error('Create translation failed:', error);
    },
  });
};

// Update translation mutation
export const useUpdateTranslation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | number;
      data: UpdateTranslationDto;
    }) => translationService.updateTranslation(Number(id), data),
    onSuccess: (updatedTranslation: Translation, variables) => {
      // Update translation in cache
      queryClient.setQueryData(
        translationKeys.detail(variables.id),
        updatedTranslation
      );

      // Invalidate translations list to refetch
      queryClient.invalidateQueries({ queryKey: translationKeys.lists() });

      // Update translation in all lists
      queryClient.setQueriesData(
        { queryKey: translationKeys.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((translation: Translation) =>
              translation.id === variables.id ? updatedTranslation : translation
            ),
          };
        }
      );
    },
    onError: (error: any) => {
      console.error('Update translation failed:', error);
    },
  });
};

// Delete translation mutation
export const useDeleteTranslation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) =>
      translationService.deleteTranslation(Number(id)),
    onSuccess: (_, deletedId) => {
      // Remove translation from cache
      queryClient.removeQueries({
        queryKey: translationKeys.detail(deletedId),
      });

      // Invalidate translations list to refetch
      queryClient.invalidateQueries({ queryKey: translationKeys.lists() });

      // Invalidate count
      queryClient.invalidateQueries({ queryKey: translationKeys.count() });

      // Remove translation from all lists
      queryClient.setQueriesData(
        { queryKey: translationKeys.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter(
              (translation: Translation) => translation.id !== deletedId
            ),
            total: oldData.total - 1,
          };
        }
      );
    },
    onError: (error: any) => {
      console.error('Delete translation failed:', error);
    },
  });
};

// Bulk delete translations mutation - TODO: Implement bulkDeleteTranslations method in translationService
// export const useBulkDeleteTranslations = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (ids: (string | number)[]) => translationService.bulkDeleteTranslations(ids),
//     onSuccess: (_, deletedIds) => {
//       // Remove translations from cache
//       deletedIds.forEach(id => {
//         queryClient.removeQueries({ queryKey: translationKeys.detail(id) });
//       });

//       // Invalidate translations list to refetch
//       queryClient.invalidateQueries({ queryKey: translationKeys.lists() });

//       // Invalidate count
//       queryClient.invalidateQueries({ queryKey: translationKeys.count() });
//     },
//     onError: (error: any) => {
//       console.error('Bulk delete translations failed:', error);
//     },
//   });
// };

// Create language mutation
export const useCreateLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLanguageDto) =>
      translationService.createLanguage(data),
    onSuccess: (newLanguage: Language) => {
      // Invalidate languages list to refetch
      queryClient.invalidateQueries({ queryKey: translationKeys.languages() });

      // Add new language to cache
      queryClient.setQueryData(
        translationKeys.language(newLanguage.code),
        newLanguage
      );
    },
    onError: (error: any) => {
      console.error('Create language failed:', error);
    },
  });
};

// Update language mutation
export const useUpdateLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLanguageDto }) =>
      translationService.updateLanguage(id, data),
    onSuccess: (updatedLanguage: Language, variables) => {
      // Update language in cache
      queryClient.setQueryData(
        translationKeys.language(updatedLanguage.code),
        updatedLanguage
      );

      // Invalidate languages list to refetch
      queryClient.invalidateQueries({ queryKey: translationKeys.languages() });
    },
    onError: (error: any) => {
      console.error('Update language failed:', error);
    },
  });
};
