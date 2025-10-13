import {
    EyeIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    UserMinusIcon,
    UserPlusIcon
} from '@heroicons/react/24/outline';
import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import {
    Table,
    TableConfig
} from '../../../shared/components/table';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import Modal from '../../../shared/components/ui/Modal';
import { ServerPagination } from '../../../shared/components/ui/ServerPagination';
import { ServerSearch } from '../../../shared/components/ui/ServerSearch';
import { ServerSorting, SortOption } from '../../../shared/components/ui/ServerSorting';
import { useServerPagination } from '../../../shared/hooks/useServerPagination';
import { User } from '../../../shared/types';
import { CreateUserRequest, UpdateUserRequest, userApiService } from '../services/userApiService';

import UserDetails from './UserDetails';
import UserForm from './UserForm';

const Users: React.FC = () => {
    // Server-side pagination
    const {
        data: users,
        loading,
        error,
        currentPage,
        pageSize,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        startIndex,
        endIndex,
        searchTerm,
        sortBy,
        sortOrder,
        goToPage,
        changePageSize,
        setSearch,
        setSorting,
        refresh,
    } = useServerPagination<User>({
        fetchFunction: userApiService.getUsers,
        initialPage: 1,
        initialPageSize: 10,
        initialSearch: '',
        initialSortBy: 'createdAt',
        initialSortOrder: 'desc',
    });

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);

    // Handle footer from UserForm
    const handleFooterReady = useCallback((footer: React.ReactNode) => {
        setModalFooter(footer);
    }, []);

    // Sort options for the sorting component
    const sortOptions: SortOption[] = useMemo(() => [
        { key: 'firstName', label: 'First Name', defaultOrder: 'asc' },
        { key: 'lastName', label: 'Last Name', defaultOrder: 'asc' },
        { key: 'email', label: 'Email', defaultOrder: 'asc' },
        { key: 'createdAt', label: 'Created Date', defaultOrder: 'desc' },
        { key: 'isActive', label: 'Status', defaultOrder: 'asc' },
    ], []);

    // CRUD actions
    const createUser = useCallback(async (userData: CreateUserRequest) => {
        try {
            await userApiService.createUser(userData);
            toast.success('User created successfully');
            refresh();
            setShowCreateModal(false);
            setModalFooter(null);
        } catch (error) {
            toast.error('Failed to create user: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [refresh]);

    const updateUser = useCallback(async (id: number, userData: UpdateUserRequest) => {
        try {
            await userApiService.updateUser(id, userData);
            toast.success('User updated successfully');
            refresh();
            setShowEditModal(false);
            setModalFooter(null);
        } catch (error) {
            toast.error('Failed to update user: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [refresh]);

    const deleteUser = useCallback(async (id: number) => {
        try {
            await userApiService.deleteUser(id);
            toast.success('User deleted successfully');
            refresh();
            setShowDeleteModal(false);
        } catch (error) {
            toast.error('Failed to delete user: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [refresh]);

    const toggleUserStatus = useCallback(async (id: number, status: boolean) => {
        try {
            await userApiService.updateUser(id, { isActive: status });
            toast.success(status ? 'User activated' : 'User deactivated');
            refresh();
        } catch (error) {
            toast.error('Failed to toggle user status: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [refresh]);

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
        // pagination: undefined, // Disable client-side pagination since we're using server-side
        // sorting: undefined, // Disable client-side sorting since we're using server-side
        // filtering: undefined, // Disable client-side filtering since we're using server-side
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
                    setModalFooter(null);
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

    // Note: Filtering is now handled server-side through search and sorting

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
                        setModalFooter(null);
                        setShowCreateModal(true);
                    }}
                    className="flex items-center space-x-2"
                >
                    <PlusIcon className="h-4 w-4" />
                    Create User
                </Button>
            </div>

            {/* Table with Server-Side Controls */}
            <Card>
                {/* Server-Side Search and Sorting Controls */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                            <ServerSearch
                                searchTerm={searchTerm}
                                onSearchChange={setSearch}
                                loading={loading}
                                placeholder="Search users by name, email, or role..."
                                className="w-full sm:w-80"
                            />
                            <ServerSorting
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSortChange={setSorting}
                                sortOptions={sortOptions}
                                loading={loading}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => handleExport('csv')}
                                variant="secondary"
                                size="sm"
                                disabled={loading}
                            >
                                Export CSV
                            </Button>
                            <Button
                                onClick={refresh}
                                variant="secondary"
                                size="sm"
                                disabled={loading}
                            >
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <Table
                    config={tableConfig}
                    data={users}
                    loading={loading}
                    error={error || undefined}
                />

                {/* Server-Side Pagination */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <ServerPagination
                        currentPage={currentPage}
                        pageSize={pageSize}
                        total={total}
                        totalPages={totalPages}
                        hasNextPage={hasNextPage}
                        hasPreviousPage={hasPreviousPage}
                        startIndex={startIndex}
                        endIndex={endIndex}
                        loading={loading}
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                        onPageChange={goToPage}
                        onPageSizeChange={changePageSize}
                        showPageSizeSelector={true}
                        showTotalInfo={true}
                        showPageNumbers={true}
                        maxVisiblePages={5}
                    />
                </div>
            </Card>

            {/* Modals */}
            {showCreateModal && (
                <Modal
                    isOpen={true}
                    onClose={() => {
                        setShowCreateModal(false);
                        setModalFooter(null);
                    }}
                    title={modalTitle}
                    size="lg"
                    footer={modalFooter}
                >
                    <UserForm
                        onSubmit={(userData) => createUser(userData as CreateUserRequest)}
                        onCancel={() => {
                            setShowCreateModal(false);
                            setModalFooter(null);
                        }}
                        onFooterReady={handleFooterReady}
                    />
                </Modal>
            )}

            {showEditModal && selectedUser && (
                <Modal
                    isOpen={true}
                    onClose={() => {
                        setShowEditModal(false);
                        setModalFooter(null);
                    }}
                    title={modalTitle}
                    size="lg"
                    footer={modalFooter}
                >
                    <UserForm
                        user={selectedUser}
                        onSubmit={(userData) => updateUser(selectedUser.id, userData)}
                        onCancel={() => {
                            setShowEditModal(false);
                            setModalFooter(null);
                        }}
                        onFooterReady={handleFooterReady}
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