import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import { RoleForm } from '../components/RoleForm';
import { useRole, useUpdateRole } from '../hooks/useRoleQueries';
import { RoleFormData } from '../types';

export const RoleEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: role, isLoading, error } = useRole(Number(id));
  const updateMutation = useUpdateRole();

  const handleSubmit = async (data: RoleFormData) => {
    if (!role) return;

    try {
      await updateMutation.mutateAsync({
        id: role.id,
        data: {
          name: data.name,
          description: data.description,
          isActive: data.isActive,
          permissionIds: data.permissionIds,
        },
      });

      toast.success(`Role "${data.name}" updated successfully`);
      navigate(`/roles/${role.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update role');
      throw error; // Re-throw to let form handle it
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-sm text-gray-600">Loading role...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="text-center py-12">
            <h3 className="text-sm font-medium text-gray-900">Role not found</h3>
            <p className="mt-1 text-sm text-gray-500">
              The role you're trying to edit doesn't exist or has been deleted.
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/roles/${role.id}`)}
          className="mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Role Details
        </Button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Role</h1>
          <p className="mt-1 text-sm text-gray-500">
            Update role information and permissions
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <div className="px-6 py-6">
          <RoleForm
            mode="edit"
            initialData={role}
            onSubmit={handleSubmit}
            isSubmitting={updateMutation.isPending}
          />
        </div>
      </Card>
    </div>
  );
};
