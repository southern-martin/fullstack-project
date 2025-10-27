import {
    CheckIcon,
    ChevronDownIcon,
    EyeIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    TruckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../../app/providers/LanguageProvider';

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
import { useCarrierLabels } from '../hooks/useCarrierLabels';
import {
    useCarriers,
    useCreateCarrier,
    useDeleteCarrier,
    useUpdateCarrier
} from '../hooks/useCarrierQueries';
import { useCarrierTranslation } from '../hooks/useCarrierTranslation';
import { Carrier, CreateCarrierRequest, UpdateCarrierRequest } from '../services/carrierApiService';

import CarrierDetails from './CarrierDetails';
import CarrierForm from './CarrierForm';

const Carriers: React.FC = () => {
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
        data: carriersResponse,
        isLoading: loading,
        error,
        refetch: refresh
    } = useCarriers({
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        sortBy: sortBy,
        sortOrder: sortOrder,
    });

    const createCarrierMutation = useCreateCarrier();
    const updateCarrierMutation = useUpdateCarrier();
    const deleteCarrierMutation = useDeleteCarrier();

    // Extract data from response
    const carriers = useMemo(() => carriersResponse?.carriers || [], [carriersResponse?.carriers]);
    const total = carriersResponse?.total || 0;
    const totalPages = carriersResponse?.totalPages || 0;
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;
    const startIndex = total > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endIndex = Math.min(currentPage * pageSize, total);

    // Translation hook
    const { translateCarriers, isTranslating } = useCarrierTranslation();
    const [translatedCarriers, setTranslatedCarriers] = useState<Carrier[]>([]);
    const [isTranslated, setIsTranslated] = useState(false);

    // Label translation hook
    const { L } = useCarrierLabels();

    // Get current language to trigger re-translation on language change
    const { currentLanguage } = useLanguage();

    // Translate carriers when they load or when language changes
    useEffect(() => {
        if (carriers.length > 0) {
            const translate = async () => {
                const translated = await translateCarriers(carriers);
                setTranslatedCarriers(translated);
                setIsTranslated(true);
            };
            translate();
        } else {
            setTranslatedCarriers([]);
            setIsTranslated(false);
        }
    }, [carriers, translateCarriers, currentLanguage]); // Added currentLanguage dependency

    // Use translated carriers for display
    const displayCarriers = isTranslated ? translatedCarriers : carriers;

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);

    // Get the carrier associated with the currently open dropdown
    const selectedDropdownCarrier = useMemo(() => {
        if (openDropdownId === null) return null;
        return displayCarriers.find(carrier => carrier.id === openDropdownId) || null;
    }, [openDropdownId, displayCarriers]);

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

    // Handle footer from CarrierForm
    const handleFooterReady = useCallback((footer: React.ReactNode) => {
        setModalFooter(footer);
    }, []);

    // CRUD actions using TanStack Query mutations
    const createCarrier = useCallback(async (carrierData: CreateCarrierRequest | UpdateCarrierRequest) => {
        try {
            await createCarrierMutation.mutateAsync(carrierData as CreateCarrierRequest);
            toast.success(L.messages.createSuccess);
            setShowCreateModal(false);
            setModalFooter(null);
        } catch (error) {
            toast.error(L.messages.createError);
            throw error;
        }
    }, [createCarrierMutation, L.messages.createSuccess, L.messages.createError]);

    const updateCarrier = useCallback(async (id: number, carrierData: CreateCarrierRequest | UpdateCarrierRequest) => {
        try {
            await updateCarrierMutation.mutateAsync({ id, data: carrierData as UpdateCarrierRequest });
            toast.success(L.messages.updateSuccess);
            setShowEditModal(false);
            setModalFooter(null);
        } catch (error) {
            toast.error(L.messages.updateError);
            throw error;
        }
    }, [updateCarrierMutation, L.messages.updateSuccess, L.messages.updateError]);

    const deleteCarrier = useCallback(async (id: number) => {
        try {
            await deleteCarrierMutation.mutateAsync(id);
            toast.success(L.messages.deleteSuccess);
            setShowDeleteModal(false);
        } catch (error) {
            toast.error(L.messages.deleteError);
            throw error;
        }
    }, [deleteCarrierMutation, L.messages.deleteSuccess, L.messages.deleteError]);

    const toggleCarrierStatus = useCallback(async (id: number, status: boolean) => {
        try {
            await updateCarrierMutation.mutateAsync({ id, data: { isActive: status } });
            toast.success(status ? L.messages.activateSuccess : L.messages.deactivateSuccess);
        } catch (error) {
            toast.error(L.messages.statusError);
            throw error;
        }
    }, [updateCarrierMutation, L.messages.activateSuccess, L.messages.deactivateSuccess, L.messages.statusError]);

    // Dropdown action handlers
    const handleViewCarrier = useCallback((carrier: Carrier) => {
        setSelectedCarrier(carrier);
        setModalTitle(L.modals.view);
        setShowViewModal(true);
        setOpenDropdownId(null);
        setDropdownPosition(null);
    }, [L.modals.view]);

    const handleEditCarrier = useCallback((carrier: Carrier) => {
        setSelectedCarrier(carrier);
        setModalTitle(L.modals.edit);
        setModalFooter(null);
        setShowEditModal(true);
        setOpenDropdownId(null);
        setDropdownPosition(null);
    }, [L.modals.edit]);

    const handleToggleCarrierStatus = useCallback((carrier: Carrier) => {
        toggleCarrierStatus(carrier.id, !carrier.isActive);
        setOpenDropdownId(null);
        setDropdownPosition(null);
    }, [toggleCarrierStatus]);

    const handleDeleteCarrier = useCallback((carrier: Carrier) => {
        setSelectedCarrier(carrier);
        setModalTitle(L.modals.delete);
        setShowDeleteModal(true);
        setOpenDropdownId(null);
        setDropdownPosition(null);
    }, [L.modals.delete]);

    // Helper functions for search, sorting, and pagination
    const setSearch = useCallback((search: string) => {
        setSearchTerm(search);
        setCurrentPage(1); // Reset to first page when searching
    }, []);

    const setSorting = useCallback((sort: string, order: 'asc' | 'desc') => {
        setSortBy(sort);
        setSortOrder(order);
        setCurrentPage(1); // Reset to first page when sorting
    }, []);

    const goToPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const changePageSize = useCallback((newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page when changing page size
    }, []);

    // Refresh handler for the refresh button
    const handleRefresh = useCallback(() => {
        refresh();
    }, [refresh]);

    // Sort options for the sorting component
    const sortOptions: SortOption[] = [
        { key: 'name', label: L.sorting.name, defaultOrder: 'asc' },
        { key: 'contactEmail', label: L.sorting.email, defaultOrder: 'asc' },
        { key: 'contactPhone', label: L.sorting.phone, defaultOrder: 'asc' },
        { key: 'isActive', label: L.sorting.status, defaultOrder: 'desc' },
        { key: 'createdAt', label: L.sorting.createdDate, defaultOrder: 'desc' },
    ];

    // Table configuration
    const tableConfig: TableConfig<Carrier> = useMemo(() => ({
        columns: [
            {
                key: 'name',
                label: L.table.name,
                sortable: true,
                render: (carrier: Carrier) => (
                    <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <TruckIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{carrier.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{carrier.contactEmail}</div>
                        </div>
                    </div>
                ),
            },
            {
                key: 'contactPhone',
                label: L.table.phone,
                sortable: true,
                render: (phone: string) => (
                    <span className="text-sm text-gray-900 dark:text-gray-100">{phone || '-'}</span>
                ),
            },
            {
                key: 'metadata',
                label: L.table.code,
                sortable: true,
                render: (metadata: any) => (
                    <span className="text-sm text-gray-900 dark:text-gray-100">{metadata?.code || '-'}</span>
                ),
            },
            {
                key: 'description',
                label: L.table.description,
                sortable: true,
                render: (description: string) => {
                    const text = description || '-';
                    return (
                        <div className="group relative max-w-[200px]">
                            <span className="text-sm text-gray-900 dark:text-gray-100 block truncate">
                                {text}
                            </span>
                            {description && description.length > 30 && (
                                <div className="invisible group-hover:visible absolute z-50 left-0 top-full mt-1 w-64 p-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded shadow-lg">
                                    {description}
                                </div>
                            )}
                        </div>
                    );
                },
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
                render: (_: any, carrier: Carrier) => {
                    const isOpen = openDropdownId === carrier.id;
                    return (
                        <div className="relative">
                            <button
                                ref={(el) => { buttonRefs.current[carrier.id] = el; }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isOpen) {
                                        setOpenDropdownId(null);
                                        setDropdownPosition(null);
                                    } else {
                                        const button = buttonRefs.current[carrier.id];
                                        if (button) {
                                            const rect = button.getBoundingClientRect();
                                            setDropdownPosition({
                                                top: rect.bottom + window.scrollY + DROPDOWN_OFFSET,
                                                left: rect.right - DROPDOWN_WIDTH + window.scrollX,
                                            });
                                        }
                                        setOpenDropdownId(carrier.id);
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
    }), [openDropdownId, DROPDOWN_OFFSET, DROPDOWN_WIDTH, L.table.name, L.table.phone, L.table.code, L.table.description, L.table.status, L.table.created, L.table.actions, L.table.emptyMessage, L.status.active, L.status.inactive]);

    // Note: Filtering is now handled server-side through search and sorting

    // Export function
    const handleExport = useCallback(async (format: 'csv' | 'excel' | 'pdf') => {
        try {
            const { exportData } = await import('../../../shared/components/table/utils/exportUtils');
            exportData(displayCarriers, tableConfig.columns, format, {
                filename: `carriers-export.${format}`,
                includeHeaders: true,
            });
            toast.success(L.messages.exportSuccess);
        } catch (error) {
            toast.error(L.messages.exportError);
        }
    }, [displayCarriers, tableConfig.columns, L.messages.exportSuccess, L.messages.exportError]);

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
                    {L.actions.add}
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
                                placeholder={L.placeholders.search}
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
                                {L.actions.export}
                            </Button>
                            <Button
                                onClick={handleRefresh}
                                variant="secondary"
                                size="sm"
                                disabled={loading}
                            >
                                {L.actions.refresh}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <Table
                    config={tableConfig}
                    data={displayCarriers}
                    loading={loading || isTranslating}
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
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {L.modals.deleteConfirm}
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                {L.actions.cancel}
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => deleteCarrier(selectedCarrier.id)}
                            >
                                {L.actions.delete}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Dropdown Portal */}
            {openDropdownId !== null && dropdownPosition && selectedDropdownCarrier && createPortal(
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
                            onClick={() => handleViewCarrier(selectedDropdownCarrier)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                        >
                            <EyeIcon className="h-4 w-4 mr-3" />
                            {L.actions.view}
                        </button>
                        <button
                            onClick={() => handleEditCarrier(selectedDropdownCarrier)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                        >
                            <PencilIcon className="h-4 w-4 mr-3" />
                            {L.actions.edit}
                        </button>
                        <button
                            onClick={() => handleToggleCarrierStatus(selectedDropdownCarrier)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors"
                        >
                            {selectedDropdownCarrier.isActive ? (
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
                            onClick={() => handleDeleteCarrier(selectedDropdownCarrier)}
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

export default Carriers;


