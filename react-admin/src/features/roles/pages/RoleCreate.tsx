import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import { RoleForm } from '../components/RoleForm';
import { useCreateRole } from '../hooks/useRoleQueries';
import { RoleFormData } from '../types';

export const RoleCreate: React.FC = () => {
  const navigate = useNavigate();
  const createMutation = useCreateRole();

  const handleSubmit = async (data: RoleFormData) => {
    try {
      const newRole = await createMutation.mutateAsync({
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        permissionIds: data.permissionIds,
      });

      toast.success(`Role "${data.name}" created successfully`);
      navigate(`/roles/${newRole.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create role');
      throw error; // Re-throw to let form handle it
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Role</h1>
          <p className="mt-1 text-sm text-gray-500">
            Define a new role and assign permissions
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <div className="px-6 py-6">
          <RoleForm mode="create" onSubmit={handleSubmit} />
        </div>
      </Card>
    </div>
  );
};
