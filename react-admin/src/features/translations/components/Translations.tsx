import {
    CheckIcon,
    ChevronDownIcon,
    EyeIcon,
    GlobeAltIcon,
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
import { ServerSorting } from '../../../shared/components/ui/ServerSorting';
import {
    useCreateTranslation,
    useDeleteTranslation,
    useLanguages,
    useTranslations,
    useUpdateTranslation
} from '../hooks/useTranslationQueries';
import { Translation } from '../services/translationService';

import LanguageManagement from './LanguageManagement';
import TranslationDetails from './TranslationDetails';
import TranslationForm from './TranslationForm';

const Translations: React.FC = () => {
    // Local state for server-side controls
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // TanStack Query hooks
    const {
        data: translationsResponse,
        isLoading: loading,
        error,
        refetch
    } = useTranslations({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        sortBy,
        sortOrder,
    });

    const { data: languagesData = [] } = useLanguages();
    const languages = Array.isArray(languagesData) ? languagesData : [];

    // Debug logging to help identify the issue
    if (languagesData && !Array.isArray(languagesData)) {
        console.warn('Languages data is not an array:', languagesData);
    }

    const createTranslationMutation = useCreateTranslation();
    const updateTranslationMutation = useUpdateTranslation();
    const deleteTranslationMutation = useDeleteTranslation();

    // Extract data from response
    const translations = translationsResponse?.data || [];
    const total = translationsResponse?.total || 0;
    const totalPages = translationsResponse?.totalPages || 0;
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, total);

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [selectedTranslation, setSelectedTranslation] = useState<Translation | null>(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);

    // Dropdown state
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
    const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

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

    // Handle footer from TranslationForm
    const handleFooterReady = useCallback((footer: React.ReactNode) => {
        setModalFooter(footer);
    }, []);

    // Server-side control handlers
    const setSearch = useCallback((search: string) => {
        setSearchTerm(search);
        setCurrentPage(1); // Reset to first page when searching
    }, []);

    const setSorting = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
        setSortBy(sortBy);
        setSortOrder(sortOrder);
        setCurrentPage(1); // Reset to first page when sorting
    }, []);

    const goToPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const changePageSize = useCallback((newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page when changing page size
    }, []);

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const toggleTranslationStatus = useCallback(async (id: number) => {
        try {
            // TODO: Implement toggleTranslationStatus in translationService and add to TanStack Query hooks
            toast.success('Translation status toggled successfully');
            refetch();
        } catch (error) {
            toast.error('Failed to toggle translation status: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }, [refetch]);

    // Dropdown action handlers
    const handleViewTranslation = useCallback((translation: Translation) => {
        setSelectedTranslation(translation);
        setModalTitle('Translation Details');
        setShowViewModal(true);
        setOpenDropdownId(null);
        setDropdownPosition(null);
    }, []);

    const handleEditTranslation = useCallback((translation: Translation) => {
        setSelectedTranslation(translation);
        setModalTitle('Edit Translation');
        setModalFooter(null);
        setShowEditModal(true);
        setOpenDropdownId(null);
        setDropdownPosition(null);
    }, []);

    const handleToggleTranslationStatus = useCallback((translation: Translation) => {
        toggleTranslationStatus(translation.id);
        setOpenDropdownId(null);
        setDropdownPosition(null);
    }, [toggleTranslationStatus]);

    const handleDeleteTranslation = useCallback((translation: Translation) => {
        setSelectedTranslation(translation);
        setModalTitle('Delete Translation');
        setShowDeleteModal(true);
        setOpenDropdownId(null);
        setDropdownPosition(null);
    }, []);

    // Sort options for server-side sorting
    const sortOptions = [
        { key: 'key', label: 'Key' },
        { key: 'value', label: 'Value' },
        { key: 'languageCode', label: 'Language' },
        { key: 'isActive', label: 'Status' },
        { key: 'createdAt', label: 'Created Date' },
    ];

    // CRUD actions using TanStack Query mutations
    const createTranslation = useCallback(async (translationData: any) => {
        try {
            await createTranslationMutation.mutateAsync(translationData);
            toast.success('Translation created successfully');
            setShowCreateModal(false);
            setModalFooter(null);
        } catch (error) {
            toast.error('Failed to create translation: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [createTranslationMutation]);

    const updateTranslation = useCallback(async (id: number, translationData: any) => {
        try {
            await updateTranslationMutation.mutateAsync({ id, data: translationData });
            toast.success('Translation updated successfully');
            setShowEditModal(false);
            setModalFooter(null);
        } catch (error) {
            toast.error('Failed to update translation: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [updateTranslationMutation]);

    const deleteTranslation = useCallback(async (id: number) => {
        try {
            await deleteTranslationMutation.mutateAsync(id);
            toast.success('Translation deleted successfully');
            setShowDeleteModal(false);
        } catch (error) {
            toast.error('Failed to delete translation: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [deleteTranslationMutation]);

    const approveTranslation = useCallback(async (id: number) => {
        try {
            // TODO: Implement approveTranslation in translationService and add to TanStack Query hooks
            toast.success('Translation approved successfully');
            refetch();
        } catch (error) {
            toast.error('Failed to approve translation: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    }, [refetch]);

    // Table configuration
    const tableConfig: TableConfig<Translation> = useMemo(() => ({
        columns: [
            {
                key: 'key',
                label: 'Key',
                sortable: true,
                render: (key: string) => (
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{key}</span>
                ),
            },
            {
                key: 'originalText',
                label: 'Original Text',
                sortable: true,
                render: (text: string) => (
                    <span className="text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate" title={text}>
                        {text}
                    </span>
                ),
            },
            {
                key: 'translatedText',
                label: 'Translated Text',
                sortable: true,
                render: (text: string) => (
                    <span className="text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate" title={text}>
                        {text}
                    </span>
                ),
            },
            {
                key: 'language',
                label: 'Language',
                sortable: true,
                render: (language: any) => (
                    <div className="flex items-center">
                        <span className="text-lg mr-2">{language?.metadata?.flag || '🌐'}</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">{language?.name || 'Unknown'}</span>
                    </div>
                ),
            },
            {
                key: 'isApproved',
                label: 'Status',
                sortable: true,
                render: (isApproved: boolean) => (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isApproved
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                        }`}>
                        {isApproved ? 'Approved' : 'Pending'}
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
            {
                key: 'actions',
                label: 'Actions',
                sortable: false,
                render: (_, translation: Translation) => {
                    const isOpen = openDropdownId === translation.id;

                    return (
                        <div className="relative">
                            <button
                                ref={(el) => {
                                    buttonRefs.current[translation.id] = el;
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (isOpen) {
                                        setOpenDropdownId(null);
                                        setDropdownPosition(null);
                                    } else {
                                        const button = buttonRefs.current[translation.id];
                                        if (button) {
                                            const rect = button.getBoundingClientRect();
                                            setDropdownPosition({
                                                top: rect.bottom + window.scrollY + 4,
                                                left: rect.right - 192 + window.scrollX, // 192px is the dropdown width (w-48)
                                            });
                                        }
                                        setOpenDropdownId(translation.id);
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
        selection: {
            enabled: true,
            multiSelect: true,
        },
        emptyMessage: 'No translations found',
    }), [handleViewTranslation, handleEditTranslation, handleToggleTranslationStatus, handleDeleteTranslation, openDropdownId]);


    // Export function
    const handleExport = useCallback(async (format: 'csv' | 'excel' | 'pdf') => {
        try {
            const { exportData } = await import('../../../shared/components/table/utils/exportUtils');
            exportData(translations, tableConfig.columns, format, {
                filename: `translations-export.${format}`,
                includeHeaders: true,
            });
            toast.success(`Translations exported as ${format.toUpperCase()}`);
        } catch (error) {
            toast.error('Failed to export translations: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }, [translations, tableConfig.columns]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Translations</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage translations and languages</p>
                </div>
                <div className="flex space-x-3">
                    <Button
                        onClick={() => {
                            setModalTitle('Manage Languages');
                            setShowLanguageModal(true);
                        }}
                        variant="secondary"
                        className="flex items-center space-x-2"
                    >
                        <GlobeAltIcon className="h-4 w-4" />
                        <span>Languages</span>
                    </Button>
                    <Button
                        onClick={() => {
                            setModalTitle('Create New Translation');
                            setModalFooter(null);
                            setShowCreateModal(true);
                        }}
                        className="flex items-center space-x-2"
                    >
                        <PlusIcon className="h-4 w-4" />
                        <span>Add Translation</span>
                    </Button>
                </div>
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
                                placeholder="Search translations by key, value, or language..."
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
                    data={translations}
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
                    <TranslationForm
                        languages={languages}
                        onSubmit={createTranslation}
                        onCancel={() => {
                            setShowCreateModal(false);
                            setModalFooter(null);
                        }}
                        onFooterReady={handleFooterReady}
                    />
                </Modal>
            )}

            {showEditModal && selectedTranslation && (
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
                    <TranslationForm
                        languages={languages}
                        translation={selectedTranslation}
                        onSubmit={(translationData) => updateTranslation(selectedTranslation.id, translationData)}
                        onCancel={() => {
                            setShowEditModal(false);
                            setModalFooter(null);
                        }}
                        onFooterReady={handleFooterReady}
                    />
                </Modal>
            )}

            {showViewModal && selectedTranslation && (
                <Modal
                    isOpen={true}
                    onClose={() => setShowViewModal(false)}
                    title={modalTitle}
                    size="lg"
                >
                    <TranslationDetails
                        translation={selectedTranslation}
                        onClose={() => setShowViewModal(false)}
                    />
                </Modal>
            )}

            {showDeleteModal && selectedTranslation && (
                <Modal
                    isOpen={true}
                    onClose={() => setShowDeleteModal(false)}
                    title={modalTitle}
                    size="md"
                >
                    <div className="p-6">
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete this translation? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button
                                variant="secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => deleteTranslation(selectedTranslation.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {showLanguageModal && (
                <Modal
                    isOpen={true}
                    onClose={() => setShowLanguageModal(false)}
                    title={modalTitle}
                    size="lg"
                >
                    <LanguageManagement
                        onClose={() => setShowLanguageModal(false)}
                        onLanguageChange={() => refetch()}
                    />
                </Modal>
            )}

            {/* Portal-based Dropdown */}
            {openDropdownId !== null && dropdownPosition && (
                createPortal(
                    <div
                        data-dropdown-portal
                        className="fixed z-[9999] w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
                        style={{
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                        }}
                    >
                        <div className="py-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const translation = translations.find(t => t.id === openDropdownId);
                                    if (translation) {
                                        handleViewTranslation(translation);
                                    }
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <EyeIcon className="h-4 w-4 mr-3" />
                                View Details
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const translation = translations.find(t => t.id === openDropdownId);
                                    if (translation) {
                                        handleEditTranslation(translation);
                                    }
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <PencilIcon className="h-4 w-4 mr-3" />
                                Edit
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const translation = translations.find(t => t.id === openDropdownId);
                                    if (translation) {
                                        handleToggleTranslationStatus(translation);
                                    }
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                {translations.find(t => t.id === openDropdownId)?.isActive ? (
                                    <>
                                        <XMarkIcon className="h-4 w-4 mr-3" />
                                        Deactivate
                                    </>
                                ) : (
                                    <>
                                        <CheckIcon className="h-4 w-4 mr-3" />
                                        Activate
                                    </>
                                )}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const translation = translations.find(t => t.id === openDropdownId);
                                    if (translation) {
                                        handleDeleteTranslation(translation);
                                    }
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <TrashIcon className="h-4 w-4 mr-3" />
                                Delete
                            </button>
                        </div>
                    </div>,
                    document.body
                )
            )}
        </div>
    );
};

export default Translations;
