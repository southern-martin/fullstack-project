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
import { CreateCustomerData, Customer, UpdateCustomerData } from '../../../shared/types';
import {
    useCreateCustomer,
    useCustomers,
    useDeleteCustomer,
    useUpdateCustomer
} from '../hooks/useCustomerQueries';

import CustomerDetails from './CustomerDetails';
import CustomerForm from './CustomerForm';

const Customers: React.FC = () => {
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
    const customers = customersResponse?.data || [];
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

    // Handle footer from CustomerForm
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

    // CRUD actions using TanStack Query mutations
    const createCustomer = useCallback(async (customerData: CreateCustomerData) => {
        try {
            await createCustomerMutation.mutateAsync(customerData);
            toast.success('Customer created successfully');
            setShowCreateModal(false);
            setModalFooter(null);
        } catch (error) {
            toast.error('Failed to create customer: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [createCustomerMutation]);

    const updateCustomer = useCallback(async (id: number, customerData: UpdateCustomerData) => {
        try {
            await updateCustomerMutation.mutateAsync({ id, data: customerData });
            toast.success('Customer updated successfully');
            setShowEditModal(false);
            setModalFooter(null);
        } catch (error) {
            toast.error('Failed to update customer: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [updateCustomerMutation]);

    const deleteCustomer = useCallback(async (id: number) => {
        try {
            await deleteCustomerMutation.mutateAsync(id);
            toast.success('Customer deleted successfully');
            setShowDeleteModal(false);
        } catch (error) {
            toast.error('Failed to delete customer: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [deleteCustomerMutation]);

    const toggleCustomerStatus = useCallback(async (id: number, status: boolean) => {
        try {
            await updateCustomerMutation.mutateAsync({ id, data: { isActive: status } });
            toast.success(status ? 'Customer activated' : 'Customer deactivated');
        } catch (error) {
            toast.error('Failed to toggle customer status: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [updateCustomerMutation]);

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
                label: 'Name',
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
                label: 'Phone',
                sortable: true,
                render: (phone: string) => (
                    <span className="text-sm text-gray-900 dark:text-gray-100">{phone || '-'}</span>
                ),
            },
            {
                key: 'preferences',
                label: 'Company',
                sortable: true,
                render: (preferences: any) => (
                    <span className="text-sm text-gray-900 dark:text-gray-100">{preferences?.company || '-'}</span>
                ),
            },
            {
                key: 'isActive',
                label: 'Status',
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
                label: 'Created',
                sortable: true,
                render: (date: string) => (
                    <span className="text-sm text-gray-900 dark:text-gray-100">
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
                onClick: (data: Customer | Customer[]) => {
                    const customer = Array.isArray(data) ? data[0] : data;
                    setSelectedCustomer(customer);
                    setModalTitle('Customer Details');
                    setShowViewModal(true);
                },
            },
            {
                type: 'row',
                label: 'Edit',
                icon: <PencilIcon className="h-4 w-4" />,
                variant: 'primary',
                onClick: (data: Customer | Customer[]) => {
                    const customer = Array.isArray(data) ? data[0] : data;
                    setSelectedCustomer(customer);
                    setModalTitle('Edit Customer');
                    setModalFooter(null);
                    setShowEditModal(true);
                },
            },
            {
                type: 'row',
                label: (data: Customer | Customer[]) => {
                    const customer = Array.isArray(data) ? data[0] : data;
                    return customer.isActive ? 'Deactivate' : 'Activate';
                },
                icon: (data: Customer | Customer[]) => {
                    const customer = Array.isArray(data) ? data[0] : data;
                    return customer.isActive ? <UserMinusIcon className="h-4 w-4" /> : <UserPlusIcon className="h-4 w-4" />;
                },
                variant: 'secondary',
                onClick: (data: Customer | Customer[]) => {
                    const customer = Array.isArray(data) ? data[0] : data;
                    toggleCustomerStatus(customer.id, !customer.isActive);
                },
            },
            {
                type: 'row',
                label: 'Delete',
                icon: <TrashIcon className="h-4 w-4" />,
                variant: 'danger',
                onClick: (data: Customer | Customer[]) => {
                    const customer = Array.isArray(data) ? data[0] : data;
                    setSelectedCustomer(customer);
                    setModalTitle('Delete Customer');
                    setShowDeleteModal(true);
                },
            },
        ],
        emptyMessage: 'No customers found',
    }), [toggleCustomerStatus]);

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
            toast.error('Failed to export customers: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }, [customers, tableConfig.columns]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{'Customers'}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{'Manage your customer database'}</p>
                </div>
                <Button
                    onClick={() => {
                        setModalTitle('Create New Customer');
                        setModalFooter(null);
                        setShowCreateModal(true);
                    }}
                    className="flex items-center space-x-2"
                >
                    <PlusIcon className="h-4 w-4" />
                    {'Add Customer'}
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
                                placeholder="Search customers by name, email, or company..."
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
                                onClick={handleRefresh}
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
                            {'Are you sure you want to delete this customer? This action cannot be undone.'}
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
                                onClick={() => deleteCustomer(selectedCustomer.id)}
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

export default Customers;


