import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PermissionSelector } from './PermissionSelector';
import { useRoleLabels } from '../hooks/useRoleLabels';
import { usePermissions } from '../hooks/useRoleQueries';
import { RoleFormData, Role } from '../types';

interface RoleFormProps {
  initialData?: Role;
  onSubmit: (data: RoleFormData) => Promise<void>;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
}

export const RoleForm: React.FC<RoleFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  mode,
}) => {
  const { L } = useRoleLabels();
  const navigate = useNavigate();
  const { data: permissionsData, isLoading: loadingPermissions } = usePermissions();

  const [formData, setFormData] = useState<RoleFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    permissionIds: initialData?.permissions?.map((p) => p.id) || [],
    isActive: initialData?.isActive ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        permissionIds: initialData.permissions?.map((p) => p.id) || [],
        isActive: initialData.isActive,
      });
    }
  }, [initialData]);

  const validateField = (name: keyof RoleFormData, value: any): string => {
    switch (name) {
      case 'name':
        if (!value || value.trim().length === 0) {
          return L.VALIDATION.NAME_REQUIRED;
        }
        if (value.trim().length < 2) {
          return L.VALIDATION.NAME_MIN_LENGTH;
        }
        if (value.length > 50) {
          return L.VALIDATION.NAME_MAX_LENGTH;
        }
        break;
      case 'description':
        if (value && value.length > 200) {
          return L.VALIDATION.DESCRIPTION_MAX_LENGTH;
        }
        break;
      case 'permissionIds':
        if (!value || value.length === 0) {
          return L.VALIDATION.AT_LEAST_ONE_PERMISSION;
        }
        break;
    }
    return '';
  };

  const handleFieldChange = (name: keyof RoleFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate on change if field was touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: keyof RoleFormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    Object.keys(formData).forEach((key) => {
      const error = validateField(key as keyof RoleFormData, formData[key as keyof RoleFormData]);
      if (error) {
        newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      description: true,
      permissionIds: true,
      isActive: true,
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error: any) {
      // Handle validation errors from backend
      if (error.validationErrors) {
        setErrors(error.validationErrors);
      }
    }
  };

  const handleCancel = () => {
    navigate('/roles');
  };

  if (loadingPermissions) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const permissions = permissionsData || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Role Information Section */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {L.DETAILS.INFORMATION}
          </h3>
        </div>

        <div className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {L.FORM.NAME}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder={L.FORM.NAME_PLACEHOLDER}
              disabled={isSubmitting}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.name && touched.name
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {errors.name && touched.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {L.FORM.DESCRIPTION}
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              placeholder={L.FORM.DESCRIPTION_PLACEHOLDER}
              disabled={isSubmitting}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.description && touched.description
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300'
              }`}
            />
            {errors.description && touched.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-gray-900"
              >
                {L.FORM.IS_ACTIVE}
              </label>
              <p className="text-sm text-gray-500 mt-1">
                {L.FORM.IS_ACTIVE_HELP}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={formData.isActive}
              onClick={() => handleFieldChange('isActive', !formData.isActive)}
              disabled={isSubmitting}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                formData.isActive ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Permissions Section */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {L.FORM.PERMISSIONS}
            <span className="text-red-500 ml-1">*</span>
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {L.FORM.SELECT_PERMISSIONS}
          </p>
        </div>

        <div className="p-6">
          <PermissionSelector
            permissions={permissions}
            selectedPermissionIds={formData.permissionIds}
            onChange={(permissionIds) =>
              handleFieldChange('permissionIds', permissionIds)
            }
            disabled={isSubmitting}
          />
          {errors.permissionIds && touched.permissionIds && (
            <p className="mt-2 text-sm text-red-600">{errors.permissionIds}</p>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {L.BUTTONS.CANCEL}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          {isSubmitting && (
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          <span>{L.BUTTONS.SAVE}</span>
        </button>
      </div>
    </form>
  );
};
