import { CheckIcon, PencilIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../../../shared/components/ui/Button';
import Modal from '../../../shared/components/ui/Modal';
import { getLanguageFlag } from '../../../shared/utils/languageFlags';
import { Language, translationService } from '../services/translationService';

interface LanguageManagementProps {
    onClose: () => void;
    onLanguageChange: () => void;
}

const LanguageManagement: React.FC<LanguageManagementProps> = ({
    onClose,
    onLanguageChange,
}) => {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

    const loadLanguages = useCallback(async () => {
        try {
            setLoading(true);
            const response = await translationService.getLanguages();
            setLanguages(response);
        } catch (error) {
            toast.error('Failed to load languages: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLanguages();
    }, [loadLanguages]);

    const handleCreateLanguage = async (languageData: any) => {
        try {
            await translationService.createLanguage(languageData);
            toast.success('Language created successfully');
            loadLanguages();
            onLanguageChange();
            setShowCreateModal(false);
        } catch (error) {
            toast.error('Failed to create language: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    };

    const handleUpdateLanguage = async (id: number, languageData: any) => {
        try {
            await translationService.updateLanguage(id, languageData);
            toast.success('Language updated successfully');
            loadLanguages();
            onLanguageChange();
            setShowEditModal(false);
        } catch (error) {
            toast.error('Failed to update language: ' + (error instanceof Error ? error.message : 'Unknown error'));
            throw error;
        }
    };

    const handleDeleteLanguage = async (id: number) => {
        try {
            await translationService.deleteLanguage(id);
            toast.success('Language deleted successfully');
            loadLanguages();
            onLanguageChange();
        } catch (error) {
            toast.error('Failed to delete language: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };

    const toggleLanguageStatus = async (id: number, isActive: boolean) => {
        try {
            await translationService.updateLanguage(id, { isActive });
            toast.success(isActive ? 'Language activated' : 'Language deactivated');
            loadLanguages();
            onLanguageChange();
        } catch (error) {
            toast.error('Failed to update language status: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">
                            Language Management
                        </h3>
                        <p className="text-sm text-gray-500">
                            Manage available languages for translations
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center space-x-2"
                    >
                        <PlusIcon className="h-4 w-4" />
                        <span>Add Language</span>
                    </Button>
                </div>

                {/* Languages List */}
                <div className="space-y-3">
                    {languages.map((language) => (
                        <div
                            key={language.id}
                            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-2xl">{getLanguageFlag(language.code)}</span>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {language.name}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            ({language.code})
                                        </span>
                                        {language.code === 'en' && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {language.nativeName}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${language.isActive
                                    ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                                    : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                                    }`}>
                                    {language.isActive ? 'Active' : 'Inactive'}
                                </span>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedLanguage(language);
                                        setShowEditModal(true);
                                    }}
                                >
                                    <PencilIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => toggleLanguageStatus(language.id, !language.isActive)}
                                >
                                    {language.isActive ? (
                                        <XMarkIcon className="h-4 w-4" />
                                    ) : (
                                        <CheckIcon className="h-4 w-4" />
                                    )}
                                </Button>
                                {language.code !== 'en' && (
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeleteLanguage(language.id)}
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </div>
            </div>

            {/* Create Language Modal */}
            {showCreateModal && (
                <Modal
                    isOpen={true}
                    onClose={() => setShowCreateModal(false)}
                    title="Create New Language"
                    size="md"
                >
                    <LanguageForm
                        onSubmit={handleCreateLanguage}
                        onCancel={() => setShowCreateModal(false)}
                    />
                </Modal>
            )}

            {/* Edit Language Modal */}
            {showEditModal && selectedLanguage && (
                <Modal
                    isOpen={true}
                    onClose={() => setShowEditModal(false)}
                    title="Edit Language"
                    size="md"
                >
                    <LanguageForm
                        language={selectedLanguage}
                        onSubmit={(data) => handleUpdateLanguage(selectedLanguage.id, data)}
                        onCancel={() => setShowEditModal(false)}
                    />
                </Modal>
            )}
        </div>
    );
};

// Language Form Component
interface LanguageFormProps {
    language?: Language;
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

const LanguageForm: React.FC<LanguageFormProps> = ({
    language,
    onSubmit,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        code: language?.code || '',
        name: language?.name || '',
        nativeName: language?.nativeName || '',
        isActive: language?.isActive ?? true,
        isDefault: language?.code === 'en' ?? false,
        flag: '🌐',
        region: language?.code?.toUpperCase() || '',
        currency: language?.code === 'en' ? 'USD' : 'EUR',
        direction: language?.isRTL ? 'rtl' : 'ltr',
        dateFormat: 'MM/DD/YYYY',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.code.trim() || !formData.name.trim() || !formData.nativeName.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit({
                code: formData.code.toLowerCase(),
                name: formData.name,
                nativeName: formData.nativeName,
                isActive: formData.isActive,
                isDefault: formData.isDefault,
                metadata: {
                    flag: formData.flag,
                    region: formData.region,
                    currency: formData.currency,
                    direction: formData.direction,
                    dateFormat: formData.dateFormat,
                },
            });
        } catch (error) {
            // Error handling is done in parent component
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-4">
                {/* Language Code */}
                <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                        Language Code *
                    </label>
                    <input
                        type="text"
                        id="code"
                        value={formData.code}
                        onChange={(e) => handleChange('code', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., en, es, fr"
                        required
                    />
                </div>

                {/* Flag */}
                <div>
                    <label htmlFor="flag" className="block text-sm font-medium text-gray-700 mb-1">
                        Flag Emoji
                    </label>
                    <input
                        type="text"
                        id="flag"
                        value={formData.flag}
                        onChange={(e) => handleChange('flag', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="🇺🇸"
                    />
                </div>

                {/* Language Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Language Name *
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., English"
                        required
                    />
                </div>

                {/* Native Name */}
                <div>
                    <label htmlFor="nativeName" className="block text-sm font-medium text-gray-700 mb-1">
                        Native Name *
                    </label>
                    <input
                        type="text"
                        id="nativeName"
                        value={formData.nativeName}
                        onChange={(e) => handleChange('nativeName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., English"
                        required
                    />
                </div>

                {/* Region */}
                <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                        Region
                    </label>
                    <input
                        type="text"
                        id="region"
                        value={formData.region}
                        onChange={(e) => handleChange('region', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., US, ES, FR"
                    />
                </div>

                {/* Currency */}
                <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                    </label>
                    <input
                        type="text"
                        id="currency"
                        value={formData.currency}
                        onChange={(e) => handleChange('currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., USD, EUR"
                    />
                </div>

                {/* Direction */}
                <div>
                    <label htmlFor="direction" className="block text-sm font-medium text-gray-700 mb-1">
                        Text Direction
                    </label>
                    <select
                        id="direction"
                        value={formData.direction}
                        onChange={(e) => handleChange('direction', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="ltr">Left to Right (LTR)</option>
                        <option value="rtl">Right to Left (RTL)</option>
                    </select>
                </div>

                {/* Date Format */}
                <div>
                    <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 mb-1">
                        Date Format
                    </label>
                    <input
                        type="text"
                        id="dateFormat"
                        value={formData.dateFormat}
                        onChange={(e) => handleChange('dateFormat', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., MM/DD/YYYY"
                    />
                </div>
            </div>

            {/* Checkboxes */}
            <div className="flex space-x-6">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => handleChange('isActive', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={(e) => handleChange('isDefault', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Default Language</span>
                </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Saving...</span>
                        </>
                    ) : (
                        <span>{language ? 'Update Language' : 'Create Language'}</span>
                    )}
                </Button>
            </div>
        </form>
    );
};

export default LanguageManagement;
