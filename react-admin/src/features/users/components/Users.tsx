import {
    CheckIcon,
    ChevronDownIcon,
    EyeIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
import { CreateUserData, UpdateUserData, User } from '../../../shared/types';
import {
    useCreateUser,
    useDeleteUser,
    useUpdateUser,
    useUsers
} from '../hooks/useUserQueries';

import { useUserLabels } from '../hooks/useUserLabels';
import UserDetails from './UserDetails';
import UserForm from './UserForm';

// Constants
const DROPDOWN_WIDTH = 192; // w-48 in pixels
const DROPDOWN_OFFSET = 4; // gap between button and dropdown

const Users: React.FC = () => {
    const { L } = useUserLabels();
    // Local state for pagination and search
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // TanStack Query hooks
    const {
        data: usersResponse,
        isLoading: loading,
        error,
        refetch: refresh
    } = useUsers({
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        sortBy: sortBy || undefined,
        sortOrder,
    });

    const createUserMutation = useCreateUser();
    const updateUserMutation = useUpdateUser();
    const deleteUserMutation = useDeleteUser();

    // Extract data from response
    const users = useMemo(() => usersResponse?.data || [], [usersResponse?.data]);
    const total = usersResponse?.total || 0;
    const totalPages = usersResponse?.totalPages || 0;
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;
    const startIndex = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endIndex = Math.min(currentPage * pageSize, total);

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);

    // Dropdown state
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
    const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

    // Memoize the selected user for dropdown to avoid repeated lookups
    const selectedDropdownUser = useMemo(() => {
        if (openDropdownId === null) return null;
        return users?.find(u => u.id === openDropdownId) || null;
    }, [users, openDropdownId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdownId !== null) {
                // Check if the click is on the dropdown itself
                const target = event.target as Element;
                const dropdown = document.querySelector('[data-dropdown-portal]');

                if (dropdown && dropdown.contains(target)) {
                    // Click is inside the dropdown, don't close it
                    return;
                }

                // Check if click is on the trigger button
                const button = buttonRefs.current[openDropdownId];
                if (button && button.contains(target)) {
                    // Click is on the trigger button, don't close it (button handles its own toggle)
                    return;
                }

                // Click is outside, close the dropdown
                setOpenDropdownId(null);
                setDropdownPosition(null);
            }
        };

        if (openDropdownId !== null) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [openDropdownId]);

    // Handle footer from UserForm
    const handleFooterReady = useCallback((footer: React.ReactNode) => {
        setModalFooter(footer);
    }, []);

    // Sort options for the sorting component
    const sortOptions: SortOption[] = useMemo(() => [
        { key: 'firstName', label: L.sortOptions.firstName, defaultOrder: 'asc' },
        { key: 'lastName', label: L.sortOptions.lastName, defaultOrder: 'asc' },
        { key: 'email', label: L.sortOptions.email, defaultOrder: 'asc' },
        { key: 'createdAt', label: L.sortOptions.createdAt, defaultOrder: 'desc' },
        { key: 'isActive', label: L.sortOptions.status, defaultOrder: 'asc' },
    ], [L.sortOptions]);

    // CRUD actions using TanStack Query mutations
    const createUser = useCallback(async (userData: CreateUserData) => {
        try {
            await createUserMutation.mutateAsync(userData);
            toast.success(L.messages.createSuccess);
            setShowCreateModal(false);
            setModalFooter(null);
        } catch (error) {
            toast.error(`${L.messages.createError}: ` + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [createUserMutation, L.messages]);

    const updateUser = useCallback(async (id: number, userData: UpdateUserData) => {
        try {
            await updateUserMutation.mutateAsync({ id, data: userData });
            toast.success(L.messages.updateSuccess);
            setShowEditModal(false);
            setModalFooter(null);
        } catch (error) {
            toast.error(`${L.messages.updateError}: ` + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [updateUserMutation, L.messages]);

    const deleteUser = useCallback(async (id: number) => {
        try {
            await deleteUserMutation.mutateAsync(id);
            toast.success(L.messages.deleteSuccess);
            setShowDeleteModal(false);
        } catch (error) {
            toast.error(`${L.messages.deleteError}: ` + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [deleteUserMutation, L.messages]);

    const toggleUserStatus = useCallback(async (id: number, status: boolean) => {
        try {
            await updateUserMutation.mutateAsync({ id, data: { isActive: status } });
            toast.success(status ? L.messages.activateSuccess : L.messages.deactivateSuccess);
        } catch (error) {
            toast.error(`${L.messages.toggleStatusError}: ` + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [updateUserMutation, L.messages]);

    // Pagination and search handlers
    const goToPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const changePageSize = useCallback((newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page when changing page size
    }, []);

    const setSearch = useCallback((search: string) => {
        setSearchTerm(search);
        setCurrentPage(1); // Reset to first page when searching
    }, []);

    const setSorting = useCallback((sort: string, order: 'asc' | 'desc') => {
        setSortBy(sort);
        setSortOrder(order);
        setCurrentPage(1); // Reset to first page when sorting
    }, []);

    // Refresh handler for the refresh button
    const handleRefresh = useCallback(() => {
        refresh();
    }, [refresh]);

    // Dropdown action handlers
    const handleViewUser = useCallback((user: User) => {
        setSelectedUser(user);
        setModalTitle(L.modals.userDetails);
        setShowViewModal(true);
        setOpenDropdownId(null);
        setDropdownPosition(null);
    }, [L.modals]);

    const handleEditUser = useCallback((user: User) => {
        setSelectedUser(user);
        setModalTitle(L.modals.editUser);
        setModalFooter(null);
        setShowEditModal(true);
        setOpenDropdownId(null);
        setDropdownPosition(null);
    }, [L.modals]);

    const handleToggleUserStatus = useCallback((user: User) => {
        toggleUserStatus(user.id, !user.isActive);
        setOpenDropdownId(null);
        setDropdownPosition(null);
    }, [toggleUserStatus]);

    const handleDeleteUser = useCallback((user: User) => {
        setSelectedUser(user);
        setModalTitle(L.modals.deleteUser);
        setShowDeleteModal(true);
        setOpenDropdownId(null);
        setDropdownPosition(null);
    }, [L.modals]);

    // Table configuration
    const tableConfig: TableConfig<User> = useMemo(() => ({
        columns: [
            {
                key: 'firstName',
                label: L.table.firstName,
                sortable: true,
                render: (value: string, user: User) => {
                    // Combine firstName and lastName
                    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
                    const displayName = fullName || 'N/A';
                    const initial = user.firstName?.[0]?.toUpperCase() || user.lastName?.[0]?.toUpperCase() || '?';

                    return (
                        <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {initial}
                                </span>
                            </div>
                            <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {displayName}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                            </div>
                        </div>
                    );
                },
            },
            {
                key: 'email',
                label: L.table.email,
                sortable: true,
                render: (email: string, user: User) => (
                    <span className="text-sm text-gray-900 dark:text-gray-100">{email}</span>
                ),
            },
            {
                key: 'roles',
                label: L.table.roles,
                sortable: false,
                render: (roles: any[]) => (
                    <div className="flex flex-wrap gap-1">
                        {roles?.map((role: any) => (
                            <span
                                key={role?.id || Math.random()}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
                            >
                                {role?.name || 'Unknown'}
                            </span>
                        ))}
                    </div>
                ),
            },
            {
                key: 'isActive',
                label: L.table.status,
                sortable: true,
                render: (isActive: boolean) => (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                        }`}>
                        {isActive ? L.status.active : L.status.inactive}
                    </span>
                ),
            },
            {
                key: 'createdAt',
                label: L.table.created,
                sortable: true,
                render: (date: string) => (
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                        {new Date(date).toLocaleDateString()}
                    </span>
                ),
            },
            {
                key: 'actions',
                label: L.table.actions,
                sortable: false,
                render: (_: any, user: User) => {
                    const isOpen = openDropdownId === user.id;

                    return (
                        <div className="relative">
                            <button
                                ref={(el) => {
                                    buttonRefs.current[user.id] = el;
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isOpen) {
                                        setOpenDropdownId(null);
                                        setDropdownPosition(null);
                                    } else {
                                        const button = buttonRefs.current[user.id];
                                        if (button) {
                                            const rect = button.getBoundingClientRect();
                                            setDropdownPosition({
                                                top: rect.bottom + window.scrollY + DROPDOWN_OFFSET,
                                                left: rect.right - DROPDOWN_WIDTH + window.scrollX,
                                            });
                                        }
                                        setOpenDropdownId(user.id);
                                    }
                                }}
                                className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-md border border-gray-300 dark:border-gray-600"
                                title="Actions"
                            >
                                <ChevronDownIcon className="h-4 w-4" />
                            </button>
                        </div>
                    );
                },
            },
        ],
        // pagination: undefined, // Disable client-side pagination since we're using server-side
        // sorting: undefined, // Disable client-side sorting since we're using server-side
        // filtering: undefined, // Disable client-side filtering since we're using server-side
        selection: {
            enabled: true,
            multiSelect: true,
        },
        emptyMessage: L.table.emptyMessage,
    }), [openDropdownId, L.table, L.status]);

    // Note: Filtering is now handled server-side through search and sorting

    // Export function
    const handleExport = useCallback(async (format: 'csv' | 'excel' | 'pdf') => {
        try {
            const { exportData } = await import('../../../shared/components/table/utils/exportUtils');
            exportData(users, tableConfig.columns, format, {
                filename: `users-export.${format}`,
                includeHeaders: true,
            });
            toast.success(L.messages.exportSuccess.replace('{format}', format.toUpperCase()));
        } catch (error) {
            toast.error(`${L.messages.exportError}: ` + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }, [users, tableConfig.columns, L.messages]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{L.page.title}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{L.page.subtitle}</p>
                </div>
                <Button
                    onClick={() => {
                        setModalTitle(L.modals.createUser);
                        setModalFooter(null);
                        setShowCreateModal(true);
                    }}
                    className="flex items-center space-x-2"
                >
                    <PlusIcon className="h-4 w-4" />
                    {L.buttons.createUser}
                </Button>
            </div>

            {/* Table with Server-Side Controls */}
            <Card>
                {/* Server-Side Search and Sorting Controls */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                            <ServerSearch
                                searchTerm={searchTerm}
                                onSearchChange={setSearch}
                                loading={loading}
                                placeholder={L.search.placeholder}
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
                                {L.buttons.exportCsv}
                            </Button>
                            <Button
                                onClick={handleRefresh}
                                variant="secondary"
                                size="sm"
                                disabled={loading}
                            >
                                {L.buttons.refresh}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <Table
                    config={tableConfig}
                    data={users}
                    loading={loading}
                    error={error?.message || undefined}
                />

                {/* Server-Side Pagination */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
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
                        onSubmit={(userData) => createUser(userData as CreateUserData)}
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
                        onSubmit={(userData) => updateUser(selectedUser.id, userData as UpdateUserData)}
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
                            {L.delete.confirmMessage}
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                {L.buttons.cancel}
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => deleteUser(selectedUser.id)}
                            >
                                {L.buttons.delete}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Dropdown Menu Portal */}
            {openDropdownId !== null && dropdownPosition && selectedDropdownUser && createPortal(
                <div
                    data-dropdown-portal
                    className="absolute z-50 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
                    style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                    }}
                >
                    <div className="py-1">
                        <button
                            onClick={() => handleViewUser(selectedDropdownUser)}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <EyeIcon className="h-4 w-4 mr-3" />
                            {L.actions.viewDetails}
                        </button>
                        <button
                            onClick={() => handleEditUser(selectedDropdownUser)}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <PencilIcon className="h-4 w-4 mr-3" />
                            {L.actions.edit}
                        </button>
                        <button
                            onClick={() => handleToggleUserStatus(selectedDropdownUser)}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {selectedDropdownUser.isActive ? (
                                <>
                                    <XMarkIcon className="h-4 w-4 mr-3" />
                                    {L.actions.deactivate}
                                </>
                            ) : (
                                <>
                                    <CheckIcon className="h-4 w-4 mr-3" />
                                    {L.actions.activate}
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => handleDeleteUser(selectedDropdownUser)}
                            className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <TrashIcon className="h-4 w-4 mr-3" />
                            {L.actions.delete}
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Users;