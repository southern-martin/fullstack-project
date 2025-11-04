import { useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userKeys } from '../../../../shared/query/queryKeys';
import { User, CreateUserData, UpdateUserData } from '../../../../shared/types';
import { userService } from '../../services/userService';
import { USER_CONSTANTS } from '../../constants/userConstants';
import { useUserLabels } from '../useUserLabels';
import { toast } from 'react-hot-toast';

/**
 * User Management Hook
 *
 * Provides centralized user management operations including CRUD actions,
 * error handling, and state management for user-related operations.
 *
 * @example
 * ```typescript
 * const { handleUserAction, isPending } = useUserManagement();
 *
 * const handleCreateUser = async (userData) => {
 *   await handleUserAction('create', null, userData);
 * };
 * ```
 *
 * @returns {Object} User management utilities
 * @returns {Function} returns.handleUserAction - Handles user CRUD operations
 * @returns {boolean} returns.isPending - Loading state indicator
 *
 * @throws {Error} When invalid action is provided
 * @throws {ValidationError} When form validation fails
 * @throws {ApiError} When API request fails
 *
 * @since 1.0.0
 * @version 2.1.0
 * @author Development Team
 */
export const useUserManagement = () => {
  const queryClient = useQueryClient();
  const { L } = useUserLabels();

  // TanStack Query mutations
  const createUser = useMutation({
    mutationFn: (data: CreateUserData) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.count() });
      toast.success(L.success.created);
    },
    onError: (error: any) => {
      handleError(error, 'create');
    },
  });

  const updateUser = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserData }) =>
      userService.updateUser(id, data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.setQueriesData(
        { queryKey: userKeys.lists() },
        (oldData: any) => {
          if (!oldData?.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.map((user: User) =>
              user.id === updatedUser.id ? updatedUser : user
            ),
          };
        }
      );
      toast.success(L.success.updated);
    },
    onError: (error: any) => {
      handleError(error, 'update');
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.count() });
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
      toast.success(L.success.deleted);
    },
    onError: (error: any) => {
      handleError(error, 'delete');
    },
  });

  /**
   * Centralized error handler for user operations
   */
  const handleError = useCallback((error: any, action: string) => {
    // Handle field validation errors
    if (error?.response?.data?.fieldErrors) {
      const fieldErrors = error.response.data.fieldErrors;
      Object.entries(fieldErrors).forEach(([field, errors]) => {
        const errorMessage = Array.isArray(errors) ? errors[0] : errors as string;
        toast.error(`${field}: ${errorMessage}`);
      });
      return;
    }

    // Handle custom rule errors
    if (error?.customRuleErrors && Array.isArray(error.customRuleErrors)) {
      toast.error(error.customRuleErrors.join(' '));
      return;
    }

    // Handle general error messages
    if (error?.response?.data?.message) {
      toast.error(error.response.data.message);
      return;
    }

    // Handle network errors
    if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network')) {
      toast.error(L.errors.network);
      return;
    }

    // Handle permission errors
    if (error?.response?.status === USER_CONSTANTS.API.STATUS_CODES.FORBIDDEN) {
      toast.error(L.errors.permission);
      return;
    }

    // Handle not found errors
    if (error?.response?.status === USER_CONSTANTS.API.STATUS_CODES.NOT_FOUND) {
      toast.error(L.errors.notFound);
      return;
    }

    // Handle server errors
    if (error?.response?.status === USER_CONSTANTS.API.STATUS_CODES.INTERNAL_ERROR) {
      toast.error(L.errors.serverError);
      return;
    }

    // Generic error fallback
    if (error?.message) {
      toast.error(error.message);
    } else {
      toast.error(L.errors.generic);
    }
  }, [L]);

  /**
   * Centralized user action handler
   */
  const handleUserAction = useCallback(async (
    action: string,
    user: User | null,
    data?: any
  ) => {
    try {
      switch (action) {
        case 'create':
          if (!data) throw new Error('User data is required for create action');
          await createUser.mutateAsync(data);
          break;

        case 'update':
          if (!user || !data) throw new Error('User and data are required for update action');
          await updateUser.mutateAsync({ id: user.id, data });
          break;

        case 'delete':
          if (!user) throw new Error('User is required for delete action');
          await deleteUser.mutateAsync(user.id);
          break;

        case 'toggleStatus':
          if (!user) throw new Error('User is required for toggle status action');
          await updateUser.mutateAsync({
            id: user.id,
            data: { isActive: !user.isActive }
          });
          toast.success(
            user.isActive
              ? L.success.deactivated
              : L.success.activated
          );
          break;

        case 'assignRoles':
          if (!user || !data?.roleIds) throw new Error('User and roleIds are required for assign roles action');
          await updateUser.mutateAsync({
            id: user.id,
            data: { roles: data.roleIds }
          });
          toast.success(L.success.rolesAssigned);
          break;

        default:
          throw new Error(`Unknown action: ${action}`);
      }
    } catch (error: any) {
      // Let mutation error handlers deal with API errors
      if (!error?.message?.includes('required')) {
        console.error(`User action failed: ${action}`, error);
      }
      throw error;
    }
  }, [createUser, updateUser, deleteUser, handleError, L]);

  /**
   * Batch operations for bulk actions
   */
  const handleBulkAction = useCallback(async (
    action: string,
    users: User[],
    options?: any
  ) => {
    if (users.length === 0) {
      toast.error('No users selected');
      return;
    }

    if (users.length > USER_CONSTANTS.BUSINESS.BULK_DELETE_LIMIT) {
      toast.error(`Cannot process more than ${USER_CONSTANTS.BUSINESS.BULK_DELETE_LIMIT} users at once`);
      return;
    }

    try {
      switch (action) {
        case 'bulkDelete':
          // For now, delete one by one (can be optimized with bulk API endpoint)
          await Promise.all(
            users.map(user => deleteUser.mutateAsync(user.id))
          );
          toast.success(`${users.length} users deleted successfully`);
          break;

        case 'bulkActivate':
          await Promise.all(
            users.map(user => updateUser.mutateAsync({
              id: user.id,
              data: { isActive: true }
            }))
          );
          toast.success(`${users.length} users activated successfully`);
          break;

        case 'bulkDeactivate':
          await Promise.all(
            users.map(user => updateUser.mutateAsync({
              id: user.id,
              data: { isActive: false }
            }))
          );
          toast.success(`${users.length} users deactivated successfully`);
          break;

        case 'bulkAssignRoles':
          if (!options?.roleIds) throw new Error('Role IDs are required for bulk assign roles action');
          await Promise.all(
            users.map(user => updateUser.mutateAsync({
              id: user.id,
              data: { roles: options.roleIds }
            }))
          );
          toast.success(`Roles assigned to ${users.length} users successfully`);
          break;

        default:
          throw new Error(`Unknown bulk action: ${action}`);
      }
    } catch (error: any) {
      console.error(`Bulk user action failed: ${action}`, error);
      toast.error(`Bulk ${action} failed. Please try again.`);
    }
  }, [deleteUser, updateUser]);

  /**
   * Validation helper for user operations
   */
  const validateUserOperation = useCallback((
    action: string,
    user: User | null,
    data?: any
  ): { isValid: boolean; error?: string } => {
    switch (action) {
      case 'create':
        if (!data) return { isValid: false, error: 'User data is required' };
        if (!data.email || !data.email.match(USER_CONSTANTS.VALIDATION.EMAIL_REGEX)) {
          return { isValid: false, error: 'Valid email is required' };
        }
        if (!data.firstName || data.firstName.length < USER_CONSTANTS.VALIDATION.MIN_NAME_LENGTH) {
          return { isValid: false, error: `First name must be at least ${USER_CONSTANTS.VALIDATION.MIN_NAME_LENGTH} characters` };
        }
        if (!data.lastName || data.lastName.length < USER_CONSTANTS.VALIDATION.MIN_NAME_LENGTH) {
          return { isValid: false, error: `Last name must be at least ${USER_CONSTANTS.VALIDATION.MIN_NAME_LENGTH} characters` };
        }
        if (data.password && data.password.length < USER_CONSTANTS.VALIDATION.MIN_PASSWORD_LENGTH) {
          return { isValid: false, error: `Password must be at least ${USER_CONSTANTS.VALIDATION.MIN_PASSWORD_LENGTH} characters` };
        }
        break;

      case 'update':
        if (!user) return { isValid: false, error: 'User is required' };
        if (!data) return { isValid: false, error: 'Update data is required' };
        if (data.email && !data.email.match(USER_CONSTANTS.VALIDATION.EMAIL_REGEX)) {
          return { isValid: false, error: 'Valid email is required' };
        }
        break;

      case 'delete':
        if (!user) return { isValid: false, error: 'User is required' };
        if (user.roles && user.roles.some((role: any) => role.name === 'admin')) {
          return { isValid: false, error: 'Cannot delete admin users' };
        }
        break;

      case 'assignRoles':
        if (!user) return { isValid: false, error: 'User is required' };
        if (!data?.roleIds || !Array.isArray(data.roleIds)) {
          return { isValid: false, error: 'Valid role IDs array is required' };
        }
        if (data.roleIds.length > USER_CONSTANTS.BUSINESS.MAX_ROLES_PER_USER) {
          return {
            isValid: false,
            error: `Cannot assign more than ${USER_CONSTANTS.BUSINESS.MAX_ROLES_PER_USER} roles`
          };
        }
        break;

      default:
        return { isValid: false, error: `Unknown action: ${action}` };
    }

    return { isValid: true };
  }, []);

  return {
    handleUserAction,
    handleBulkAction,
    validateUserOperation,
    isPending: createUser.isPending || updateUser.isPending || deleteUser.isPending,
    mutations: {
      create: createUser,
      update: updateUser,
      delete: deleteUser,
    }
  };
};

export type UserManagementHook = ReturnType<typeof useUserManagement>;
