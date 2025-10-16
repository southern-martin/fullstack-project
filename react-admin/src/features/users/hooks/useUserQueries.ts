import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userKeys } from '../../../shared/query/queryKeys';
import {
  CreateUserData,
  PaginationParams,
  UpdateUserData,
  User,
} from '../../../shared/types';
import { userService } from '../services/userService';

/**
 * User Service Hooks using TanStack Query
 */

// Get users list with pagination
export const useUsers = (params: PaginationParams = { page: 1, limit: 10 }) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getUsers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get user by ID
export const useUser = (id: string | number) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUserById(Number(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get users count
export const useUsersCount = () => {
  return useQuery({
    queryKey: userKeys.count(),
    queryFn: () => userService.getUserCount(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Search users - TODO: Implement search method in userService
// export const useUsersSearch = (searchTerm: string) => {
//   return useQuery({
//     queryKey: userKeys.search(searchTerm),
//     queryFn: () => userService.searchUsers(searchTerm),
//     enabled: !!searchTerm && searchTerm.length > 2,
//     staleTime: 1 * 60 * 1000, // 1 minute
//   });
// };

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserData) => userService.createUser(data),
    onSuccess: (newUser: User) => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Invalidate count
      queryClient.invalidateQueries({ queryKey: userKeys.count() });

      // Add new user to cache
      queryClient.setQueryData(userKeys.detail(newUser.id), newUser);
    },
    onError: (error: any) => {
      console.error('Create user failed:', error);
    },
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: UpdateUserData }) =>
      userService.updateUser(Number(id), data),
    onSuccess: (updatedUser: User, variables) => {
      // Update user in cache
      queryClient.setQueryData(userKeys.detail(variables.id), updatedUser);

      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Update user in all lists
      queryClient.setQueriesData(
        { queryKey: userKeys.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((user: User) =>
              user.id === variables.id ? updatedUser : user
            ),
          };
        }
      );
    },
    onError: (error: any) => {
      console.error('Update user failed:', error);
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => userService.deleteUser(Number(id)),
    onSuccess: (_, deletedId) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });

      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      // Invalidate count
      queryClient.invalidateQueries({ queryKey: userKeys.count() });

      // Remove user from all lists
      queryClient.setQueriesData(
        { queryKey: userKeys.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter((user: User) => user.id !== deletedId),
            total: oldData.total - 1,
          };
        }
      );
    },
    onError: (error: any) => {
      console.error('Delete user failed:', error);
    },
  });
};

// Bulk delete users mutation - TODO: Implement bulkDeleteUsers method in userService
// export const useBulkDeleteUsers = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (ids: (string | number)[]) => userService.bulkDeleteUsers(ids),
//     onSuccess: (_, deletedIds) => {
//       // Remove users from cache
//       deletedIds.forEach(id => {
//         queryClient.removeQueries({ queryKey: userKeys.detail(id) });
//       });

//       // Invalidate users list to refetch
//       queryClient.invalidateQueries({ queryKey: userKeys.lists() });

//       // Invalidate count
//       queryClient.invalidateQueries({ queryKey: userKeys.count() });
//     },
//     onError: (error: any) => {
//       console.error('Bulk delete users failed:', error);
//     },
//   });
// };
