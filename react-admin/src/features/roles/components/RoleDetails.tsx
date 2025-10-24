import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import Modal from '../../../shared/components/ui/Modal';
import { Table, TableConfig } from '../../../shared/components/table';

import { useRole, useDeleteRole, useUsersByRole } from '../hooks/useRoleQueries';
import { PermissionCategory } from '../types';

export const RoleDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  // Fetch role details
  const { data: role, isLoading, error } = useRole(Number(id));

  // Fetch users with this role
  const { data: usersResponse, isLoading: usersLoading } = useUsersByRole(Number(id));
  const users = (usersResponse as any)?.data || usersResponse || [];

  // Delete mutation
  const deleteMutation = useDeleteRole();

  // Handle delete
  const handleDelete = async () => {
    if (!role) return;

    try {
      await deleteMutation.mutateAsync(role.id);
      toast.success(`Role "${role.name}" deleted successfully`);
      navigate('/roles');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete role');
    }
  };

  // Group permissions by category
  const groupedPermissions = React.useMemo(() => {
    if (!role?.permissions) return {};

    const groups: Record<string, typeof role.permissions> = {};
    
    role.permissions.forEach((permission) => {
      const category = permission.category || 'OTHER';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
    });

    return groups;
  }, [role]);

  // Category display names
  const categoryNames: Record<PermissionCategory, string> = {
    [PermissionCategory.USERS]: 'User Management',
    [PermissionCategory.ROLES]: 'Role & Permission Management',
    [PermissionCategory.SYSTEM]: 'System Settings',
    [PermissionCategory.CONTENT]: 'Content Management',
    [PermissionCategory.ANALYTICS]: 'Analytics & Reports',
    [PermissionCategory.SETTINGS]: 'Application Settings',
    [PermissionCategory.CARRIERS]: 'Carrier Management',
    [PermissionCategory.CUSTOMERS]: 'Customer Management',
    [PermissionCategory.PRICING]: 'Pricing Management',
  };

  // Table config for users
  const usersTableConfig: TableConfig<any> = {
    columns: [
      {
        key: 'firstName',
        label: 'Name',
        sortable: false,
        render: (firstName: string, user: any) => (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {firstName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
        ),
      },
      {
        key: 'isActive',
        label: 'Status',
        sortable: false,
        render: (isActive: boolean) => (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {isActive ? (
              <>
                <CheckIcon className="h-3 w-3" />
                Active
              </>
            ) : (
              <>
                <XMarkIcon className="h-3 w-3" />
                Inactive
              </>
            )}
          </span>
        ),
      },
      {
        key: 'createdAt',
        label: 'Joined',
        sortable: false,
        render: (date: string) => (
          <span className="text-sm text-gray-600">
            {new Date(date).toLocaleDateString()}
          </span>
        ),
      },
    ],
    emptyMessage: 'No users assigned to this role.',
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-sm text-gray-600">Loading role details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="text-center py-12">
            <XMarkIcon className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Role not found</h3>
            <p className="mt-1 text-sm text-gray-500">
              The role you're looking for doesn't exist or has been deleted.
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate('/roles')}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Roles
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/roles')}
          className="mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Roles
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{role.name}</h1>
              <p className="mt-1 text-sm text-gray-500">{role.description || 'No description'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate(`/roles/${role.id}/edit`)}
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Role
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Role Info & Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Role Information */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Role Information</h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      role.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {role.isActive ? (
                      <>
                        <CheckIcon className="h-3 w-3" />
                        Active
                      </>
                    ) : (
                      <>
                        <XMarkIcon className="h-3 w-3" />
                        Inactive
                      </>
                    )}
                  </span>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Permissions</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {role.permissions?.length || 0} permissions
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Users</dt>
                <dd className="mt-1 flex items-center gap-2 text-sm text-gray-900">
                  <UserGroupIcon className="h-4 w-4 text-gray-400" />
                  {role.userCount || 0} users
                </dd>
              </div>

              {role.createdAt && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(role.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              )}

              {role.updatedAt && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(role.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Permissions & Users */}
        <div className="lg:col-span-2 space-y-6">
          {/* Permissions */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Permissions</h2>
            </div>
            <div className="px-6 py-4">
              {Object.keys(groupedPermissions).length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">
                  No permissions assigned to this role.
                </p>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedPermissions).map(([category, permissions]) => (
                    <div key={category}>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">
                        {categoryNames[category as PermissionCategory] || category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {permissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex items-start gap-2 p-2 rounded-lg bg-gray-50"
                          >
                            <CheckIcon className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {permission.name}
                              </p>
                              {permission.description && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {permission.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Users with this role */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Users with this Role ({users.length})
              </h2>
            </div>
            <div className="px-6 py-4">
              {usersLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Loading users...</p>
                </div>
              ) : (
                <Table config={usersTableConfig} data={users} loading={usersLoading} />
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Role"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete the role "{role.name}"?
          </p>

          {(role.userCount ?? 0) > 0 && (
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    This role is assigned to {role.userCount} user(s). Deleting it will remove
                    the role from all users.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
