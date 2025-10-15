import {
    EyeIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    TruckIcon
} from '@heroicons/react/24/outline';
import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import {
    Table,
    TableConfig,
    TableToolbar
} from '../../../shared/components/table';
import Button from '../../../shared/components/ui/Button';
import Card from '../../../shared/components/ui/Card';
import Modal from '../../../shared/components/ui/Modal';
import {
    useCarriers,
    useCreateCarrier,
    useDeleteCarrier,
    useUpdateCarrier
} from '../hooks/useCarrierQueries';
import { Carrier, CreateCarrierRequest, UpdateCarrierRequest } from '../services/carrierApiService';

import CarrierDetails from './CarrierDetails';
import CarrierForm from './CarrierForm';

const Carriers: React.FC = () => {
    // TanStack Query hooks
    const {
        data: carriersResponse,
        isLoading: loading,
        error,
        refetch: refresh
    } = useCarriers({
        page: 1,
        limit: 100, // Maximum allowed by backend
    });

    const createCarrierMutation = useCreateCarrier();
    const updateCarrierMutation = useUpdateCarrier();
    const deleteCarrierMutation = useDeleteCarrier();

    // Extract data from response
    const carriers = carriersResponse?.carriers || [];

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);

    // Handle footer from CarrierForm
    const handleFooterReady = useCallback((footer: React.ReactNode) => {
        setModalFooter(footer);
    }, []);

    // CRUD actions using TanStack Query mutations
    const createCarrier = useCallback(async (carrierData: CreateCarrierRequest | UpdateCarrierRequest) => {
        try {
            await createCarrierMutation.mutateAsync(carrierData as CreateCarrierRequest);
            toast.success('Carrier created successfully');
            setShowCreateModal(false);
            setModalFooter(null);
        } catch (error) {
            toast.error('Failed to create carrier: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [createCarrierMutation]);

    const updateCarrier = useCallback(async (id: number, carrierData: CreateCarrierRequest | UpdateCarrierRequest) => {
        try {
            await updateCarrierMutation.mutateAsync({ id, data: carrierData as UpdateCarrierRequest });
            toast.success('Carrier updated successfully');
            setShowEditModal(false);
            setModalFooter(null);
        } catch (error) {
            toast.error('Failed to update carrier: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [updateCarrierMutation]);

    const deleteCarrier = useCallback(async (id: number) => {
        try {
            await deleteCarrierMutation.mutateAsync(id);
            toast.success('Carrier deleted successfully');
            setShowDeleteModal(false);
        } catch (error) {
            toast.error('Failed to delete carrier: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [deleteCarrierMutation]);

    // Table configuration
    const tableConfig: TableConfig<Carrier> = useMemo(() => ({
        columns: [
            {
                key: 'name',
                label: 'Name',
                sortable: true,
                render: (carrier: Carrier) => (
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <TruckIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{carrier.name}</div>
                            <div className="text-sm text-gray-500">{carrier.contactEmail}</div>
                        </div>
                    </div>
                ),
            },
            {
                key: 'contactPhone',
                label: 'Phone',
                sortable: true,
                render: (phone: string) => (
                    <span className="text-sm text-gray-900">{phone || '-'}</span>
                ),
            },
            {
                key: 'metadata',
                label: 'Code',
                sortable: true,
                render: (metadata: any) => (
                    <span className="text-sm text-gray-900">{metadata?.code || '-'}</span>
                ),
            },
            {
                key: 'description',
                label: 'Description',
                sortable: true,
                render: (description: string) => (
                    <span className="text-sm text-gray-900">{description || '-'}</span>
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
            globalSearch: true,
            searchPlaceholder: 'Search carriers...',
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
                onClick: (data: Carrier | Carrier[]) => {
                    const carrier = Array.isArray(data) ? data[0] : data;
                    setSelectedCarrier(carrier);
                    setModalTitle('Carrier Details');
                    setShowViewModal(true);
                },
            },
            {
                type: 'row',
                label: 'Edit',
                icon: <PencilIcon className="h-4 w-4" />,
                variant: 'primary',
                onClick: (data: Carrier | Carrier[]) => {
                    const carrier = Array.isArray(data) ? data[0] : data;
                    setSelectedCarrier(carrier);
                    setModalTitle('Edit Carrier');
                    setModalFooter(null);
                    setShowEditModal(true);
                },
            },
            {
                type: 'row',
                label: 'Delete',
                icon: <TrashIcon className="h-4 w-4" />,
                variant: 'danger',
                onClick: (data: Carrier | Carrier[]) => {
                    const carrier = Array.isArray(data) ? data[0] : data;
                    setSelectedCarrier(carrier);
                    setModalTitle('Delete Carrier');
                    setShowDeleteModal(true);
                },
            },
        ],
        emptyMessage: 'No carriers found',
    }), []);

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
            key: 'code',
            label: 'Code',
            type: 'text' as const,
            placeholder: 'Filter by code...',
        },
        {
            key: 'description',
            label: 'Description',
            type: 'text' as const,
            placeholder: 'Filter by description...',
        },
    ];

    // Export function
    const handleExport = useCallback(async (format: 'csv' | 'excel' | 'pdf') => {
        try {
            const { exportData } = await import('../../../shared/components/table/utils/exportUtils');
            exportData(carriers, tableConfig.columns, format, {
                filename: `carriers-export.${format}`,
                includeHeaders: true,
            });
            toast.success(`Carriers exported as ${format.toUpperCase()}`);
        } catch (error) {
            toast.error('Failed to export carriers: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }, [carriers, tableConfig.columns]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{'Carriers'}</h1>
                    <p className="text-gray-600">{'Manage your carrier partners'}</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button
                        onClick={() => {
                            setModalTitle('Create New Carrier');
                            setModalFooter(null);
                            setShowCreateModal(true);
                        }}
                        className="flex items-center space-x-2"
                    >
                        <PlusIcon className="h-4 w-4" />
                        {'Add Carrier'}
                    </Button>
                    <Button
                        onClick={() => refresh()}
                        variant="secondary"
                        size="sm"
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                </div>
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
                    data={carriers}
                    loading={loading}
                    error={error?.message || undefined}
                />
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
                    <CarrierForm
                        onSubmit={createCarrier}
                        onCancel={() => {
                            setShowCreateModal(false);
                            setModalFooter(null);
                        }}
                        onFooterReady={handleFooterReady}
                    />
                </Modal>
            )}

            {showEditModal && selectedCarrier && (
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
                    <CarrierForm
                        carrier={selectedCarrier}
                        onSubmit={(carrierData) => updateCarrier(selectedCarrier.id, carrierData)}
                        onCancel={() => {
                            setShowEditModal(false);
                            setModalFooter(null);
                        }}
                        onFooterReady={handleFooterReady}
                    />
                </Modal>
            )}

            {showViewModal && selectedCarrier && (
                <Modal
                    isOpen={true}
                    onClose={() => setShowViewModal(false)}
                    title={modalTitle}
                    size="lg"
                >
                    <CarrierDetails
                        carrier={selectedCarrier}
                        onClose={() => setShowViewModal(false)}
                    />
                </Modal>
            )}

            {showDeleteModal && selectedCarrier && (
                <Modal
                    isOpen={true}
                    onClose={() => setShowDeleteModal(false)}
                    title={modalTitle}
                    size="md"
                >
                    <div className="p-6">
                        <p className="text-gray-600 mb-4">
                            {'Are you sure you want to delete this carrier? This action cannot be undone.'}
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
                                onClick={() => deleteCarrier(selectedCarrier.id)}
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

export default Carriers;


