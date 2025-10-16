import React from 'react';
import Button from '../../../shared/components/ui/Button';
import { Translation } from '../services/translationService';

interface TranslationDetailsProps {
    translation: Translation;
    onClose: () => void;
}

const TranslationDetails: React.FC<TranslationDetailsProps> = ({
    translation,
    onClose,
}) => {
    return (
        <div className="p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Translation Details
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {translation.id}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${translation.isActive
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                            }`}>
                            {translation.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>

                {/* Translation Key */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Translation Key
                    </label>
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                        <code className="text-sm text-gray-900 dark:text-gray-100">{translation.key}</code>
                    </div>
                </div>

                {/* Language */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                    </label>
                    <div className="flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                        <span className="text-lg mr-2">
                            🌐
                        </span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                            Language ID: {translation.languageId} ({translation.languageCode})
                        </span>
                    </div>
                </div>

                {/* Translation Value */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Translation Value
                    </label>
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                        <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {translation.value}
                        </p>
                    </div>
                </div>


                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Created At
                        </label>
                        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                                {new Date(translation.createdAt).toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Updated At
                        </label>
                        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                                {new Date(translation.updatedAt).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                <Button
                    variant="secondary"
                    onClick={onClose}
                >
                    Close
                </Button>
            </div>
        </div>
    );
};

export default TranslationDetails;
