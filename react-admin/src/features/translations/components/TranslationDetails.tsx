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
                        <h3 className="text-lg font-medium text-gray-900">
                            Translation Details
                        </h3>
                        <p className="text-sm text-gray-500">
                            ID: {translation.id}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${translation.isApproved
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {translation.isApproved ? 'Approved' : 'Pending'}
                        </span>
                    </div>
                </div>

                {/* Translation Key */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Translation Key
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        <code className="text-sm text-gray-900">{translation.key}</code>
                    </div>
                </div>

                {/* Language */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                    </label>
                    <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        <span className="text-lg mr-2">
                            {translation.language?.metadata?.flag || '🌐'}
                        </span>
                        <span className="text-sm text-gray-900">
                            {translation.language?.name} ({translation.language?.code})
                        </span>
                    </div>
                </div>

                {/* Original Text */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original Text
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">
                            {translation.originalText}
                        </p>
                    </div>
                </div>

                {/* Translated Text */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Translated Text
                    </label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">
                            {translation.translatedText}
                        </p>
                    </div>
                </div>

                {/* Context */}
                {translation.context && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Context
                        </label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                            <span className="text-sm text-gray-900">
                                {typeof translation.context === 'string'
                                    ? translation.context
                                    : JSON.stringify(translation.context)
                                }
                            </span>
                        </div>
                    </div>
                )}

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Created At
                        </label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                            <span className="text-sm text-gray-900">
                                {new Date(translation.createdAt).toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Updated At
                        </label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                            <span className="text-sm text-gray-900">
                                {new Date(translation.updatedAt).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Approval Info */}
                {translation.isApproved && translation.approvedBy && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Approved By
                        </label>
                        <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                            <span className="text-sm text-gray-900">{translation.approvedBy}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
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
