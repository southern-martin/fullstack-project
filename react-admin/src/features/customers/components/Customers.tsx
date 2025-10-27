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
import { CreateCustomerData, Customer, UpdateCustomerData } from '../../../shared/types';
import { useCustomerLabels } from '../hooks/useCustomerLabels';
import {
    useCreateCustomer,
    useCustomers,
    useDeleteCustomer,
    useUpdateCustomer
} from '../hooks/useCustomerQueries';

import CustomerDetails from './CustomerDetails';
import CustomerForm from './CustomerForm';

const Customers: React.FC = () => {
    // Translation hooks
    const { L } = useCustomerLabels();
    // Dropdown state
    const DROPDOWN_WIDTH = 192; // w-48 in pixels
    const DROPDOWN_OFFSET = 4; // gap between button and dropdown
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
    const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

    // Local state for pagination and search
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // TanStack Query hooks
    const {
        data: customersResponse,
        isLoading: loading,
        error,
        refetch: refresh
    } = useCustomers({
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        sortBy: sortBy || undefined,
        sortOrder,
    });

    const createCustomerMutation = useCreateCustomer();
    const updateCustomerMutation = useUpdateCustomer();
    const deleteCustomerMutation = useDeleteCustomer();

    // Extract data from response
    const customers = useMemo(() => customersResponse?.data || [], [customersResponse?.data]);
    const total = customersResponse?.total || 0;
    const totalPages = customersResponse?.totalPages || 0;
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;
    const startIndex = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endIndex = Math.min(currentPage * pageSize, total);

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);

    // Get the customer associated with the currently open dropdown
    const selectedDropdownCustomer = useMemo(() => {
        if (openDropdownId === null) return null;
        return customers.find(customer => customer.id === openDropdownId) || null;
    }, [openDropdownId, customers]);

    // Click outside handler for dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            // Check if click is on dropdown portal
            const isDropdownPortal = target.closest('[data-dropdown-portal]');
            if (isDropdownPortal) return;

            // Check if click is on the trigger button
            if (openDropdownId !== null) {
                const triggerButton = buttonRefs.current[openDropdownId];
                if (triggerButton && triggerButton.contains(target)) return;
            }

            // Close dropdown if clicking outside
            if (openDropdownId !== null) {
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

    // Handle footer from CustomerForm
    const handleFooterReady = useCallback((footer: React.ReactNode) => {
        setModalFooter(footer);
    }, []);

    // Sort options for the sorting component
    const sortOptions: SortOption[] = useMemo(() => [
        { key: 'firstName', label: L.table.firstName, defaultOrder: 'asc' },
        { key: 'lastName', label: L.table.lastName, defaultOrder: 'asc' },
        { key: 'email', label: L.table.email, defaultOrder: 'asc' },
        { key: 'createdAt', label: L.table.createdDate, defaultOrder: 'desc' },
        { key: 'isActive', label: L.form.status, defaultOrder: 'asc' },
    ], [L]);

    // CRUD actions using TanStack Query mutations
    const createCustomer = useCallback(async (customerData: CreateCustomerData) => {
        try {
            await createCustomerMutation.mutateAsync(customerData);
            toast.success(L.messages.createSuccess);
            setShowCreateModal(false);
            setModalFooter(null);
        } catch (error) {
            toast.error(`${L.messages.createError}: ${error instanceof Error ? error.message : L.messages.unknownError}`);
            throw error;
        }
    }, [createCustomerMutation, L]);

    const updateCustomer = useCallback(async (id: number, customerData: UpdateCustomerData) => {
        try {
            await updateCustomerMutation.mutateAsync({ id, data: customerData });
            toast.success(L.messages.updateSuccess);
            setShowEditModal(false);
            setModalFooter(null);
        } catch (error) {
            toast.error(`${L.messages.updateError}: ${error instanceof Error ? error.message : L.messages.unknownError}`);
            throw error;
        }
    }, [updateCustomerMutation, L]);

    const deleteCustomer = useCallback(async (id: number) => {
        try {
            await deleteCustomerMutation.mutateAsync(id);
            toast.success(L.messages.deleteSuccess);
            setShowDeleteModal(false);
        } catch (error) {
            toast.error(`${L.messages.deleteError}: ${error instanceof Error ? error.message : L.messages.unknownError}`);
            throw error;
        }
    }, [deleteCustomerMutation, L]);

    const toggleCustomerStatus = useCallback(async (id: number, status: boolean) => {
        try {
            await updateCustomerMutation.mutateAsync({ id, data: { isActive: status } });
            toast.success(status ? L.messages.activateSuccess : L.messages.deactivateSuccess);
        } catch (error) {
            toast.error(`${L.messages.toggleStatusError}: ${error instanceof Error ? error.message : L.messages.unknownError}`);
            throw error;
        }
    }, [updateCustomerMutation, L]);

    // Dropdown action handlers
    const handleViewCustomer = useCallback((customer: Customer) => {
        setSelectedCustomer(customer);
        setModalTitle(L.modals.view);
        setShowViewModal(true);
        setOpenDropdownId(null);
        setDropdownPosition(null);
    }, [L]);

    const handleEditCustomer = useCallback((customer: Customer) => {
        setSelectedCustomer(customer);
        setModalTitle(L.modals.edit);
        setModalFooter(null);
        setShowEditModal(true);
        setOpenDropdownId(null);
        setDropdownPosition(null);
    }, [L]);

    const handleToggleCustomerStatus = useCallback((customer: Customer) => {
        toggleCustomerStatus(customer.id, !customer.isActive);
        setOpenDropdownId(null);
        setDropdownPosition(null);
    }, [toggleCustomerStatus]);

    const handleDeleteCustomer = useCallback((customer: Customer) => {
        setSelectedCustomer(customer);
        setModalTitle(L.modals.delete);
        setShowDeleteModal(true);
        setOpenDropdownId(null);
        setDropdownPosition(null);
    }, [L]);

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

    // Table configuration
    const tableConfig: TableConfig<Customer> = useMemo(() => ({
        columns: [
            {
                key: 'firstName',
                label: L.form.name,
                sortable: true,
                render: (firstName: string, customer: Customer) => (
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {firstName?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{customer.firstName} {customer.lastName}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</div>
                        </div>
                    </div>
                ),
            },
            {
                key: 'phone',
                label: L.form.phone,
                sortable: true,
                render: (phone: string) => (
                    <span className="text-sm text-gray-900 dark:text-gray-100">{phone || '-'}</span>
                ),
            },
            {
                key: 'preferences',
                label: L.form.company,
                sortable: true,
                render: (preferences: any) => (
                    <span className="text-sm text-gray-900 dark:text-gray-100">{preferences?.company || '-'}</span>
                ),
            },
            {
                key: 'isActive',
                label: L.form.status,
                sortable: true,
                render: (isActive: boolean) => (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                        }`}>
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                ),
            },
            {
                key: 'createdAt',
                label: L.form.created,
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
                render: (_: any, customer: Customer) => {
                    const isOpen = openDropdownId === customer.id;
                    return (
                        <div className="relative">
                            <button
                                ref={(el) => { buttonRefs.current[customer.id] = el; }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isOpen) {
                                        setOpenDropdownId(null);
                                        setDropdownPosition(null);
                                    } else {
                                        const button = buttonRefs.current[customer.id];
                                        if (button) {
                                            const rect = button.getBoundingClientRect();
                                            setDropdownPosition({
                                                top: rect.bottom + window.scrollY + DROPDOWN_OFFSET,
                                                left: rect.right - DROPDOWN_WIDTH + window.scrollX,
                                            });
                                        }
                                        setOpenDropdownId(customer.id);
                                    }
                                }}
                                className={`p-2 rounded-md transition-colors ${isOpen
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                    : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                aria-label="Actions"
                            >
                                <ChevronDownIcon className="h-4 w-4" />
                            </button>
                        </div>
                    );
                }
            },
        ],
        selection: {
            enabled: true,
            multiSelect: true,
        },
        emptyMessage: L.table.emptyMessage,
    }), [openDropdownId, DROPDOWN_OFFSET, DROPDOWN_WIDTH, L]);

    // Note: Filtering is now handled server-side through search and sorting

    // Export function
    const handleExport = useCallback(async (format: 'csv' | 'excel' | 'pdf') => {
        try {
            const { exportData } = await import('../../../shared/components/table/utils/exportUtils');
            exportData(customers, tableConfig.columns, format, {
                filename: `customers-export.${format}`,
                includeHeaders: true,
            });
            toast.success(`Customers exported as ${format.toUpperCase()}`);
        } catch (error) {
            toast.error(`${L.messages.exportError}: ${error instanceof Error ? error.message : L.messages.unknownError}`);
        }
    }, [customers, tableConfig.columns, L]);

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
                        setModalTitle(L.modals.create);
                        setModalFooter(null);
                        setShowCreateModal(true);
                    }}
                    className="flex items-center space-x-2"
                >
                    <PlusIcon className="h-4 w-4" />
                    {L.buttons.add}
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
                    data={customers}
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
                    <CustomerForm
                        onSubmit={(customerData) => createCustomer(customerData as CreateCustomerData)}
                        onCancel={() => {
                            setShowCreateModal(false);
                            setModalFooter(null);
                        }}
                        onFooterReady={handleFooterReady}
                    />
                </Modal>
            )}

            {showEditModal && selectedCustomer && (
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
                    <CustomerForm
                        customer={selectedCustomer}
                        onSubmit={(customerData) => updateCustomer(selectedCustomer.id, customerData as UpdateCustomerData)}
                        onCancel={() => {
                            setShowEditModal(false);
                            setModalFooter(null);
                        }}
                        onFooterReady={handleFooterReady}
                    />
                </Modal>
            )}

            {showViewModal && selectedCustomer && (
                <Modal
                    isOpen={true}
                    onClose={() => setShowViewModal(false)}
                    title={modalTitle}
                    size="lg"
                >
                    <CustomerDetails
                        customer={selectedCustomer}
                        onClose={() => setShowViewModal(false)}
                    />
                </Modal>
            )}

            {showDeleteModal && selectedCustomer && (
                <Modal
                    isOpen={true}
                    onClose={() => setShowDeleteModal(false)}
                    title={modalTitle}
                    size="md"
                >
                    <div className="p-6">
                        <p className="text-gray-600 mb-4">
                            {L.modals.deleteConfirm}
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
                                onClick={() => deleteCustomer(selectedCustomer.id)}
                            >
                                {L.buttons.delete}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Dropdown Portal */}
            {openDropdownId !== null && dropdownPosition && selectedDropdownCustomer && createPortal(
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
                            onClick={() => handleViewCustomer(selectedDropdownCustomer)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                        >
                            <EyeIcon className="h-4 w-4 mr-3" />
                            {L.actions.viewDetails}
                        </button>
                        <button
                            onClick={() => handleEditCustomer(selectedDropdownCustomer)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                        >
                            <PencilIcon className="h-4 w-4 mr-3" />
                            {L.actions.edit}
                        </button>
                        <button
                            onClick={() => handleToggleCustomerStatus(selectedDropdownCustomer)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                        >
                            {selectedDropdownCustomer.isActive ? (
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
                            onClick={() => handleDeleteCustomer(selectedDropdownCustomer)}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
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

export default Customers;


