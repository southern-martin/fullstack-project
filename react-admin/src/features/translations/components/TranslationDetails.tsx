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
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${translation.isApproved
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                            }`}>
                            {translation.isApproved ? 'Approved' : 'Pending'}
                        </span>
                    </div>
                </div>

                {/* Translation Key */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Translation Key (MD5)
                    </label>
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                        <code className="text-sm text-gray-900 dark:text-gray-100 break-all">{translation.key}</code>
                    </div>
                </div>

                {/* Language */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                    </label>
                    <div className="flex items-center px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                        <span className="text-lg mr-2">
                            {translation.language?.flag || '🌐'}
                        </span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                            {translation.language?.name || translation.languageCode.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Original Text */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Original Text
                    </label>
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                        <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {translation.original}
                        </p>
                    </div>
                </div>

                {/* Translated Text */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Translated Text
                    </label>
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {translation.destination}
                        </p>
                    </div>
                </div>

                {/* Context (if exists) */}
                {translation.context && Object.keys(translation.context).length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Context
                        </label>
                        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                            <pre className="text-sm text-gray-900 dark:text-gray-100">
                                {JSON.stringify(translation.context, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}

                {/* Usage Stats */}
                {translation.usageCount !== undefined && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Usage Count
                            </label>
                            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                    {translation.usageCount} times
                                </span>
                            </div>
                        </div>
                        {translation.lastUsedAt && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Last Used
                                </label>
                                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                                    <span className="text-sm text-gray-900 dark:text-gray-100">
                                        {new Date(translation.lastUsedAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}


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
