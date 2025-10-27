import React, { useMemo, useState } from 'react';
import { Permission, PermissionCategory, PermissionGroup } from '../types';
import { useRoleLabels } from '../hooks/useRoleLabels';

interface PermissionSelectorProps {
  permissions: Permission[];
  selectedPermissionIds: number[];
  onChange: (permissionIds: number[]) => void;
  disabled?: boolean;
}

export const PermissionSelector: React.FC<PermissionSelectorProps> = ({
  permissions,
  selectedPermissionIds,
  onChange,
  disabled = false,
}) => {
  const { L } = useRoleLabels();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.values(PermissionCategory))
  );

  // Group permissions by category
  const permissionGroups: PermissionGroup[] = useMemo(() => {
    const groups: Record<string, PermissionGroup> = {};

    permissions.forEach((permission) => {
      const category = permission.category || PermissionCategory.SYSTEM;
      
      if (!groups[category]) {
        groups[category] = {
          category,
          label: L.categories[category as keyof typeof L.categories] || category,
          permissions: [],
        };
      }
      
      groups[category].permissions.push(permission);
    });

    // Sort categories and permissions within each category
    return Object.values(groups)
      .sort((a, b) => a.label.localeCompare(b.label))
      .map((group) => ({
        ...group,
        permissions: group.permissions.sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
      }));
  }, [permissions, L]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    onChange(permissions.map((p) => p.id));
  };

  const handleDeselectAll = () => {
    onChange([]);
  };

  const handleCategoryToggle = (categoryPermissions: Permission[]) => {
    const categoryIds = categoryPermissions.map((p) => p.id);
    const allSelected = categoryIds.every((id) =>
      selectedPermissionIds.includes(id)
    );

    if (allSelected) {
      // Deselect all in this category
      onChange(
        selectedPermissionIds.filter((id) => !categoryIds.includes(id))
      );
    } else {
      // Select all in this category
      const newSelected = new Set([...selectedPermissionIds, ...categoryIds]);
      onChange(Array.from(newSelected));
    }
  };

  const handlePermissionToggle = (permissionId: number) => {
    if (selectedPermissionIds.includes(permissionId)) {
      onChange(selectedPermissionIds.filter((id) => id !== permissionId));
    } else {
      onChange([...selectedPermissionIds, permissionId]);
    }
  };

  const selectedCount = selectedPermissionIds.length;
  const totalCount = permissions.length;

  return (
    <div className="permission-selector space-y-4">
      {/* Header with select all/none */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">
            {selectedCount} {L.permissions.selectedCount} / {totalCount}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleSelectAll}
            disabled={disabled || selectedCount === totalCount}
            className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {L.permissions.selectAll}
          </button>
          <button
            type="button"
            onClick={handleDeselectAll}
            disabled={disabled || selectedCount === 0}
            className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {L.permissions.deselectAll}
          </button>
        </div>
      </div>

      {/* Permission groups */}
      <div className="space-y-3">
        {permissionGroups.map((group) => {
          const categoryPermissions = group.permissions;
          const categoryIds = categoryPermissions.map((p) => p.id);
          const selectedInCategory = categoryIds.filter((id) =>
            selectedPermissionIds.includes(id)
          ).length;
          const allCategorySelected = selectedInCategory === categoryIds.length;
          const someCategorySelected = selectedInCategory > 0 && !allCategorySelected;
          const isExpanded = expandedCategories.has(group.category);

          return (
            <div
              key={group.category}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Category Header */}
              <div className="bg-gray-50 border-b border-gray-200">
                <div className="flex items-center px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleCategory(group.category)}
                    className="flex-1 flex items-center space-x-2 text-left"
                    disabled={disabled}
                  >
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        isExpanded ? 'transform rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span className="font-medium text-gray-900">
                      {group.label}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({selectedInCategory}/{categoryPermissions.length})
                    </span>
                  </button>

                  {/* Category checkbox */}
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allCategorySelected}
                      ref={(input) => {
                        if (input) {
                          input.indeterminate = someCategorySelected;
                        }
                      }}
                      onChange={() =>
                        handleCategoryToggle(categoryPermissions)
                      }
                      disabled={disabled}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </label>
                </div>
              </div>

              {/* Category Permissions */}
              {isExpanded && (
                <div className="p-4 space-y-2 bg-white">
                  {categoryPermissions.map((permission) => {
                    const isSelected = selectedPermissionIds.includes(
                      permission.id
                    );

                    return (
                      <label
                        key={permission.id}
                        className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50 border-blue-200'
                            : 'hover:bg-gray-50'
                        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handlePermissionToggle(permission.id)}
                          disabled={disabled}
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900">
                            {permission.name}
                          </div>
                          {permission.description && (
                            <div className="text-sm text-gray-500 mt-1">
                              {permission.description}
                            </div>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No permissions message */}
      {permissions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>{L.empty.noPermissionsTitle}</p>
        </div>
      )}
    </div>
  );
};
