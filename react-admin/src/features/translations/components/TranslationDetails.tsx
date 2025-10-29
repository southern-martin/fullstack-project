import React from 'react';
import Button from '../../../shared/components/ui/Button';
import { Translation } from '../services/translationService';
import { useTranslationLabels } from '../hooks';

interface TranslationDetailsProps {
    translation: Translation;
    onClose: () => void;
}

const TranslationDetails: React.FC<TranslationDetailsProps> = ({
    translation,
    onClose,
}) => {
    const { L } = useTranslationLabels();

    return (
        <div className="p-6">
            <div className="space-y-6">
                {/* Header */}
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            {L.details.translationInfo}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            ID: {translation.id}
                        </p>
                    </div>
                    <div>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                translation.isApproved
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}
                        >
                            {translation.isApproved ? L.status.approved : L.status.pending}
                        </span>
                    </div>
                </div>                {/* Translation Key */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {L.form.key}
                    </label>
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                        <code className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                            {translation.key}
                        </code>
                    </div>
                </div>

                {/* Language */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {L.form.languageCode}
                    </label>
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md flex items-center space-x-2">
                        <span className="text-2xl">{translation.languageCode === 'en' ? '🇬🇧' : translation.languageCode === 'fr' ? '🇫🇷' : translation.languageCode === 'es' ? '🇪🇸' : '🌐'}</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                            {translation.languageCode.toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* Original Text */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {L.form.original}
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
                        {L.form.destination}
                    </label>
                    <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                        <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {translation.destination}
                        </p>
                    </div>
                </div>

                {/* Context (if exists) */}
                {translation.context && Object.keys(translation.context).length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {L.form.context}
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
                                {L.details.usageCount}
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
                                    {L.details.lastUsed}
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
                            {L.details.createdAt}
                        </label>
                        <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                                {new Date(translation.createdAt).toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {L.details.updatedAt}
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
                    {L.buttons.cancel}
                </Button>
            </div>
        </div>
    );
};

export default TranslationDetails;
