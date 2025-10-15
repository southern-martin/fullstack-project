import {
    CheckIcon,
    EyeIcon,
    GlobeAltIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    XMarkIcon
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
    // TanStack Query hooks
    const {
        data: translationsResponse,
        isLoading: loading,
        error,
        refetch
    } = useTranslations({
        page: 1,
        limit: 100,
    });

    const { data: languages = [] } = useLanguages();

    const createTranslationMutation = useCreateTranslation();
    const updateTranslationMutation = useUpdateTranslation();
    const deleteTranslationMutation = useDeleteTranslation();

    // Extract data from response
    const translations = translationsResponse?.data || [];

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [selectedTranslation, setSelectedTranslation] = useState<Translation | null>(null);
    const [modalTitle, setModalTitle] = useState('');
    const [modalFooter, setModalFooter] = useState<React.ReactNode>(null);

    // Handle footer from TranslationForm
    const handleFooterReady = useCallback((footer: React.ReactNode) => {
        setModalFooter(footer);
    }, []);

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

    const toggleTranslationStatus = useCallback(async (id: number) => {
        try {
            // TODO: Implement toggleTranslationStatus in translationService and add to TanStack Query hooks
            toast.success('Translation status toggled successfully');
            refetch();
        } catch (error) {
            toast.error('Failed to toggle translation status: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
                    <span className="text-sm font-medium text-gray-900">{key}</span>
                ),
            },
            {
                key: 'originalText',
                label: 'Original Text',
                sortable: true,
                render: (text: string) => (
                    <span className="text-sm text-gray-900 max-w-xs truncate" title={text}>
                        {text}
                    </span>
                ),
            },
            {
                key: 'translatedText',
                label: 'Translated Text',
                sortable: true,
                render: (text: string) => (
                    <span className="text-sm text-gray-900 max-w-xs truncate" title={text}>
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
                        <span className="text-sm text-gray-900">{language?.name || 'Unknown'}</span>
                    </div>
                ),
            },
            {
                key: 'isApproved',
                label: 'Status',
                sortable: true,
                render: (isApproved: boolean) => (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isApproved
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
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
            searchPlaceholder: 'Search translations...',
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
                onClick: (data: Translation | Translation[]) => {
                    const translation = Array.isArray(data) ? data[0] : data;
                    setSelectedTranslation(translation);
                    setModalTitle('Translation Details');
                    setShowViewModal(true);
                },
            },
            {
                type: 'row',
                label: 'Edit',
                icon: <PencilIcon className="h-4 w-4" />,
                variant: 'primary',
                onClick: (data: Translation | Translation[]) => {
                    const translation = Array.isArray(data) ? data[0] : data;
                    setSelectedTranslation(translation);
                    setModalTitle('Edit Translation');
                    setModalFooter(null);
                    setShowEditModal(true);
                },
            },
            {
                type: 'row',
                label: (data: Translation | Translation[]) => {
                    const translation = Array.isArray(data) ? data[0] : data;
                    return translation.isActive ? 'Deactivate' : 'Activate';
                },
                icon: (data: Translation | Translation[]) => {
                    const translation = Array.isArray(data) ? data[0] : data;
                    return translation.isActive ?
                        <XMarkIcon className="h-4 w-4" /> :
                        <CheckIcon className="h-4 w-4" />;
                },
                variant: 'secondary',
                onClick: (data: Translation | Translation[]) => {
                    const translation = Array.isArray(data) ? data[0] : data;
                    if (translation.isActive) {
                        // Toggle active status
                        toggleTranslationStatus(translation.id);
                    }
                },
            },
            {
                type: 'row',
                label: 'Delete',
                icon: <TrashIcon className="h-4 w-4" />,
                variant: 'danger',
                onClick: (data: Translation | Translation[]) => {
                    const translation = Array.isArray(data) ? data[0] : data;
                    setSelectedTranslation(translation);
                    setModalTitle('Delete Translation');
                    setShowDeleteModal(true);
                },
            },
        ],
        emptyMessage: 'No translations found',
    }), [approveTranslation]);

    // Filter options for the toolbar
    const filterOptions = [
        {
            key: 'isApproved',
            label: 'Status',
            type: 'select' as const,
            options: [
                { label: 'All', value: '' },
                { label: 'Approved', value: 'true' },
                { label: 'Pending', value: 'false' },
            ],
        },
        {
            key: 'languageId',
            label: 'Language',
            type: 'select' as const,
            options: [
                { label: 'All Languages', value: '' },
                ...languages.map(lang => ({ label: lang.name, value: lang.id.toString() })),
            ],
        },
    ];

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
                    <h1 className="text-2xl font-bold text-gray-900">Translations</h1>
                    <p className="text-gray-600">Manage translations and languages</p>
                </div>
                <div className="flex space-x-3">
                    <Button
                        onClick={() => refetch()}
                        variant="secondary"
                        size="sm"
                        disabled={loading}
                    >
                        Refresh
                    </Button>
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
                    data={translations}
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
        </div>
    );
};

export default Translations;
