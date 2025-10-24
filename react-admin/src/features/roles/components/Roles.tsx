import React, { useState } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import Modal from '../../../shared/components/ui/Modal';
import { Table, TableConfig } from '../../../shared/components/table';
import { ServerPagination } from '../../../shared/components/ui/ServerPagination';
import { ServerSearch } from '../../../shared/components/ui/ServerSearch';

import { useRoles, useDeleteRole } from '../hooks/useRoleQueries';
import { Role } from '../types';

export const Roles: React.FC = () => {
  const navigate = useNavigate();

  // Pagination & Search State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch roles
  const {
    data: rolesResponse,
    isLoading,
    error,
    refetch,
  } = useRoles({
    page: currentPage,
    limit: pageSize,
    search: searchTerm || undefined,
  });

  // Delete mutation
  const deleteMutation = useDeleteRole();

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  // Extract data
  const roles = rolesResponse?.data || [];
  const total = rolesResponse?.total || 0;
  const totalPages = rolesResponse?.totalPages || 1;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + roles.length, total);

  // Table configuration
  const tableConfig: TableConfig<Role> = {
    columns: [
      {
        key: 'name',
        label: 'Role Name',
        sortable: true,
        render: (role: Role) => (
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-900">{role.name}</span>
          </div>
        ),
      },
      {
        key: 'description',
        label: 'Description',
        sortable: false,
        render: (description: string) => (
          <span className="text-gray-600 max-w-md truncate block">{description || '-'}</span>
        ),
      },
      {
        key: 'permissions',
        label: 'Permissions',
        sortable: false,
        render: (permissions: any[], role: Role) => (
          <span className="text-sm text-gray-900">
            {role.permissions?.length || 0} permissions
          </span>
        ),
      },
      {
        key: 'userCount',
        label: 'Users',
        sortable: true,
        render: (userCount: number) => (
          <div className="flex items-center gap-2">
            <UserGroupIcon className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-900">{userCount || 0}</span>
          </div>
        ),
      },
      {
        key: 'isActive',
        label: 'Status',
        sortable: true,
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
        key: 'actions',
        label: 'Actions',
        sortable: false,
        render: (_: any, role: Role) => (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/roles/${role.id}`)}
              title="View Details"
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/roles/${role.id}/edit`)}
              title="Edit Role"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDeleteClick(role)}
              title="Delete Role"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    emptyMessage: searchTerm ? 'No roles found matching your search.' : 'No roles available.',
  };

  // Handlers
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roleToDelete) return;

    try {
      await deleteMutation.mutateAsync(roleToDelete.id);
      toast.success(`Role "${roleToDelete.name}" deleted successfully`);
      setShowDeleteModal(false);
      setRoleToDelete(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete role');
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRoleToDelete(null);
  };

  // Empty state
  if (!isLoading && roles.length === 0 && !searchTerm) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="text-center py-12">
            <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No roles</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new role.
            </p>
            <div className="mt-6">
              <Button onClick={() => navigate('/roles/create')}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Role
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
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage roles and permissions for your application
          </p>
        </div>
        <Button onClick={() => navigate('/roles/create')}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <ServerSearch
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          placeholder="Search roles by name or description..."
        />
      </div>

      {/* Table */}
      <Card>
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400 mb-4">
            <p className="text-sm text-red-700">
              Failed to load roles. Please try again.
            </p>
          </div>
        )}

        <Table config={tableConfig} data={roles} loading={isLoading} />

        {/* Pagination */}
        {!isLoading && roles.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <ServerPagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              total={total}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              startIndex={startIndex}
              endIndex={endIndex}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={handleDeleteCancel} title="Delete Role">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete the role "{roleToDelete?.name}"?
          </p>

          {roleToDelete && (roleToDelete.userCount ?? 0) > 0 && (
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
                    This role is assigned to {roleToDelete.userCount} user(s). Deleting it will
                    remove the role from all users.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="secondary" onClick={handleDeleteCancel}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
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
