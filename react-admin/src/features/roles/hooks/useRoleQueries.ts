import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { roleKeys } from '../../../shared/query/queryKeys';
import { PaginationParams } from '../../../shared/types';
import { roleApiService } from '../services/roleApiService';
import {
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsRequest,
} from '../types';

/**
 * Role Service Hooks using TanStack Query
 */

// Get roles list with pagination
export const useRoles = (params: PaginationParams = { page: 1, limit: 10 }) => {
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () => roleApiService.getRoles(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get role by ID
export const useRole = (id: string | number) => {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => roleApiService.getRoleById(Number(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get all active roles
export const useActiveRoles = () => {
  return useQuery({
    queryKey: roleKeys.active(),
    queryFn: () => roleApiService.getActiveRoles(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get roles count
export const useRolesCount = () => {
  return useQuery({
    queryKey: roleKeys.count(),
    queryFn: () => roleApiService.getRoleCount(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Get role statistics
export const useRoleStats = () => {
  return useQuery({
    queryKey: roleKeys.stats(),
    queryFn: () => roleApiService.getRoleStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Get all permissions
export const usePermissions = () => {
  return useQuery({
    queryKey: roleKeys.permissions(),
    queryFn: () => roleApiService.getPermissions(),
    staleTime: 10 * 60 * 1000, // 10 minutes - permissions change rarely
  });
};

// Get permission categories
export const usePermissionCategories = () => {
  return useQuery({
    queryKey: roleKeys.permissionCategories(),
    queryFn: () => roleApiService.getPermissionCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get users by role
export const useUsersByRole = (roleId: number) => {
  return useQuery({
    queryKey: roleKeys.usersByRole(roleId),
    queryFn: () => roleApiService.getUsersByRole(roleId),
    enabled: !!roleId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create role mutation
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => roleApiService.createRole(data),
    onSuccess: (newRole: Role) => {
      // Invalidate roles list to refetch
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });

      // Invalidate count and stats
      queryClient.invalidateQueries({ queryKey: roleKeys.count() });
      queryClient.invalidateQueries({ queryKey: roleKeys.stats() });
      queryClient.invalidateQueries({ queryKey: roleKeys.active() });

      // Add new role to cache
      queryClient.setQueryData(roleKeys.detail(newRole.id), newRole);
    },
    onError: (error: any) => {
      console.error('Create role failed:', error);
    },
  });
};

// Update role mutation
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: UpdateRoleRequest }) =>
      roleApiService.updateRole(Number(id), data),
    onSuccess: (updatedRole: Role, variables) => {
      // Update role in cache
      queryClient.setQueryData(roleKeys.detail(variables.id), updatedRole);

      // Invalidate roles list to refetch
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roleKeys.active() });
      queryClient.invalidateQueries({ queryKey: roleKeys.stats() });

      // Update role in all lists
      queryClient.setQueriesData(
        { queryKey: roleKeys.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((role: Role) =>
              role.id === variables.id ? updatedRole : role
            ),
          };
        }
      );
    },
    onError: (error: any) => {
      console.error('Update role failed:', error);
    },
  });
};

// Delete role mutation
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => roleApiService.deleteRole(Number(id)),
    onSuccess: (_, deletedId) => {
      // Remove role from cache
      queryClient.removeQueries({ queryKey: roleKeys.detail(deletedId) });

      // Invalidate roles list to refetch
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: roleKeys.count() });
      queryClient.invalidateQueries({ queryKey: roleKeys.stats() });
      queryClient.invalidateQueries({ queryKey: roleKeys.active() });

      // Remove role from all lists
      queryClient.setQueriesData(
        { queryKey: roleKeys.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.filter((role: Role) => role.id !== deletedId),
            total: oldData.total - 1,
          };
        }
      );
    },
    onError: (error: any) => {
      console.error('Delete role failed:', error);
    },
  });
};

// Assign permissions mutation
export const useAssignPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roleId,
      data,
    }: {
      roleId: number;
      data: AssignPermissionsRequest;
    }) => roleApiService.assignPermissions(roleId, data),
    onSuccess: (updatedRole: Role, variables) => {
      // Update role in cache
      queryClient.setQueryData(roleKeys.detail(variables.roleId), updatedRole);

      // Invalidate roles list to refetch
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });

      // Update role in all lists
      queryClient.setQueriesData(
        { queryKey: roleKeys.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((role: Role) =>
              role.id === variables.roleId ? updatedRole : role
            ),
          };
        }
      );
    },
    onError: (error: any) => {
      console.error('Assign permissions failed:', error);
    },
  });
};
