import {
    EyeIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    UserMinusIcon,
    UserPlusIcon
} from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import {
    Table,
    TableConfig,
    TableToolbar
} from '../../../shared/components/table';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import Modal from '../../../shared/components/ui/Modal';
import { User } from '../../../shared/types';
import { CreateUserRequest, UpdateUserRequest, userApiService } from '../services/userApiService';

import UserDetails from './UserDetails';
import UserForm from './UserForm';

const Users: React.FC = () => {

    // Local state management
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalTitle, setModalTitle] = useState('');

    // Load users
    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await userApiService.getUsers({
                page: 1,
                limit: 100, // Maximum allowed by backend
            });
            setUsers(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load users');
            toast.error('Failed to load users: ' + (err instanceof Error ? err.message : 'Unknown error'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    // CRUD actions
    const createUser = useCallback(async (userData: CreateUserRequest) => {
        try {
            await userApiService.createUser(userData);
            toast.success('User created successfully');
            loadUsers();
            setShowCreateModal(false);
        } catch (error) {
            toast.error('Failed to create user: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [loadUsers]);

    const updateUser = useCallback(async (id: number, userData: UpdateUserRequest) => {
        try {
            await userApiService.updateUser(id, userData);
            toast.success('User updated successfully');
            loadUsers();
            setShowEditModal(false);
        } catch (error) {
            toast.error('Failed to update user: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [loadUsers]);

    const deleteUser = useCallback(async (id: number) => {
        try {
            await userApiService.deleteUser(id);
            toast.success('User deleted successfully');
            loadUsers();
            setShowDeleteModal(false);
        } catch (error) {
            toast.error('Failed to delete user: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [loadUsers]);

    const toggleUserStatus = useCallback(async (id: number, status: boolean) => {
        try {
            await userApiService.updateUser(id, { isActive: status });
            toast.success(status ? 'User activated' : 'User deactivated');
            loadUsers();
        } catch (error) {
            toast.error('Failed to toggle user status: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [loadUsers]);

    // Table configuration
    const tableConfig: TableConfig<User> = useMemo(() => ({
        columns: [
            {
                key: 'firstName',
                label: 'First Name',
                sortable: true,
                render: (user: User) => (
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                                {user.firstName?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                    </div>
                ),
            },
            {
                key: 'email',
                label: 'Email',
                sortable: true,
                render: (email: string, user: User) => (
                    <span className="text-sm text-gray-900">{email}</span>
                ),
            },
            {
                key: 'roles',
                label: 'Roles',
                sortable: false,
                render: (roles: any[]) => (
                    <div className="flex flex-wrap gap-1">
                        {roles?.map((role: any) => (
                            <span
                                key={role?.id || Math.random()}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                                {role?.name || 'Unknown'}
                            </span>
                        ))}
                    </div>
                ),
            },
            {
                key: 'isActive',
                label: 'Status',
                sortable: true,
                render: (isActive: boolean) => (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                ),
            },
            {
                key: 'createdAt',
                label: 'Created',
                sortable: true,
                render: (date: string) => (
                    <span className="text-sm text-gray-900">
                        {new Date(date).toLocaleDateString()}
                    </span>
                ),
            },
        ],
        pagination: {
            pageSize: 10,
            pageSizeOptions: [5, 10, 25, 50],
            showTotal: true,
            showPageSize: true,
        },
        sorting: {
            defaultSort: { key: 'createdAt', direction: 'desc' },
        },
        filtering: {
            globalSearch: false,
            searchPlaceholder: 'Search users...',
        },
        selection: {
            enabled: true,
            multiSelect: true,
        },
        actions: [
            {
                type: 'row',
                label: 'View',
                icon: <EyeIcon className="h-4 w-4" />,
                variant: 'secondary',
                onClick: (data: User | User[]) => {
                    const user = Array.isArray(data) ? data[0] : data;
                    setSelectedUser(user);
                    setModalTitle('User Details');
                    setShowViewModal(true);
                },
            },
            {
                type: 'row',
                label: 'Edit',
                icon: <PencilIcon className="h-4 w-4" />,
                variant: 'primary',
                onClick: (data: User | User[]) => {
                    const user = Array.isArray(data) ? data[0] : data;
                    setSelectedUser(user);
                    setModalTitle('Edit User');
                    setShowEditModal(true);
                },
            },
            {
                type: 'row',
                label: (data: User | User[]) => {
                    const user = Array.isArray(data) ? data[0] : data;
                    return user.isActive ? 'Deactivate' : 'Activate';
                },
                icon: (data: User | User[]) => {
                    const user = Array.isArray(data) ? data[0] : data;
                    return user.isActive ? <UserMinusIcon className="h-4 w-4" /> : <UserPlusIcon className="h-4 w-4" />;
                },
                variant: 'secondary',
                onClick: (data: User | User[]) => {
                    const user = Array.isArray(data) ? data[0] : data;
                    toggleUserStatus(user.id, !user.isActive);
                },
            },
            {
                type: 'row',
                label: 'Delete',
                icon: <TrashIcon className="h-4 w-4" />,
                variant: 'danger',
                onClick: (data: User | User[]) => {
                    const user = Array.isArray(data) ? data[0] : data;
                    setSelectedUser(user);
                    setModalTitle('Delete User');
                    setShowDeleteModal(true);
                },
            },
        ],
        emptyMessage: 'No users found',
    }), [toggleUserStatus]);

    // Filter options for the toolbar
    const filterOptions = [
        {
            key: 'isActive',
            label: 'Status',
            type: 'select' as const,
            options: [
                { label: 'All', value: '' },
                { label: 'Active', value: 'true' },
                { label: 'Inactive', value: 'false' },
            ],
        },
        {
            key: 'roles',
            label: 'Role',
            type: 'select' as const,
            options: [
                { label: 'All', value: '' },
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' },
                { label: 'Manager', value: 'manager' },
            ],
        },
    ];

    // Export function
    const handleExport = useCallback(async (format: 'csv' | 'excel' | 'pdf') => {
        try {
            const { exportData } = await import('../../../shared/components/table/utils/exportUtils');
            exportData(users, tableConfig.columns, format, {
                filename: `users-export.${format}`,
                includeHeaders: true,
            });
            toast.success(`Users exported as ${format.toUpperCase()}`);
        } catch (error) {
            toast.error('Failed to export users: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }, [users, tableConfig.columns]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-600">Manage your user database</p>
                </div>
                <Button
                    onClick={() => {
                        setModalTitle('Create New User');
                        setShowCreateModal(true);
                    }}
                    className="flex items-center space-x-2"
                >
                    <PlusIcon className="h-4 w-4" />
                    Create User
                </Button>
            </div>

            {/* Table with Toolbar */}
            <Card>
                <TableToolbar
                    onExport={handleExport}
                    filters={filterOptions}
                    onFilterChange={() => { }} // TODO: Implement filtering
                    onSearchChange={() => { }} // TODO: Implement search
                    searchTerm=""
                    activeFilters={[]}
                    onClearAllFilters={() => { }} // TODO: Implement clear filters
                    showSearch={true}
                    showFilters={true}
                    showExport={true}
                    showSettings={true}
                />
                <Table
                    config={tableConfig}
                    data={users}
                    loading={loading}
                    error={error || undefined}
                />
            </Card>

            {/* Modals */}
            {showCreateModal && (
                <Modal
                    isOpen={true}
                    onClose={() => {
                        setShowCreateModal(false);
                    }}
                    title={modalTitle}
                    size="lg"
                >
                    <UserForm
                        onSubmit={(userData) => createUser(userData as CreateUserRequest)}
                        onCancel={() => {
                            setShowCreateModal(false);
                        }}
                    />
                </Modal>
            )}

            {showEditModal && selectedUser && (
                <Modal
                    isOpen={true}
                    onClose={() => {
                        setShowEditModal(false);
                    }}
                    title={modalTitle}
                    size="lg"
                >
                    <UserForm
                        user={selectedUser}
                        onSubmit={(userData) => updateUser(selectedUser.id, userData)}
                        onCancel={() => {
                            setShowEditModal(false);
                        }}
                    />
                </Modal>
            )}

            {showViewModal && selectedUser && (
                <Modal
                    isOpen={true}
                    onClose={() => setShowViewModal(false)}
                    title={modalTitle}
                    size="lg"
                >
                    <UserDetails
                        user={selectedUser}
                        onClose={() => setShowViewModal(false)}
                    />
                </Modal>
            )}

            {showDeleteModal && selectedUser && (
                <Modal
                    isOpen={true}
                    onClose={() => setShowDeleteModal(false)}
                    title={modalTitle}
                    size="md"
                >
                    <div className="p-6">
                        <p className="text-gray-600 mb-4">
                            {'Are you sure you want to delete this user? This action cannot be undone.'}
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                {'Cancel'}
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => deleteUser(selectedUser.id)}
                            >
                                {'Delete'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Users;