import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../../../shared/components/ui/Button';
import { Language, Translation } from '../services/translationService';

interface TranslationFormProps {
    translation?: Translation;
    languages: Language[];
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

const TranslationForm: React.FC<TranslationFormProps> = ({
    translation,
    languages,
    onSubmit,
    onCancel,
}) => {
    const [formData, setFormData] = useState({
        key: translation?.key || '',
        originalText: translation?.originalText || '',
        translatedText: translation?.translatedText || '',
        languageId: translation?.languageId?.toString() || '',
        context: typeof translation?.context === 'string' ? translation.context : '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.key.trim() || !formData.originalText.trim() || !formData.translatedText.trim() || !formData.languageId) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit({
                ...formData,
                languageId: parseInt(formData.languageId),
            });
        } catch (error) {
            // Error handling is done in parent component
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-6">
                {/* Translation Key */}
                <div>
                    <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-2">
                        Translation Key *
                    </label>
                    <input
                        type="text"
                        id="key"
                        value={formData.key}
                        onChange={(e) => handleChange('key', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., welcome.message"
                        required
                    />
                </div>

                {/* Language Selection */}
                <div>
                    <label htmlFor="languageId" className="block text-sm font-medium text-gray-700 mb-2">
                        Language *
                    </label>
                    <select
                        id="languageId"
                        value={formData.languageId}
                        onChange={(e) => handleChange('languageId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Select a language</option>
                        {languages.map((language) => (
                            <option key={language.id} value={language.id}>
                                {language.metadata?.flag} {language.name} ({language.code})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Original Text */}
                <div>
                    <label htmlFor="originalText" className="block text-sm font-medium text-gray-700 mb-2">
                        Original Text *
                    </label>
                    <textarea
                        id="originalText"
                        value={formData.originalText}
                        onChange={(e) => handleChange('originalText', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter the original text..."
                        required
                    />
                </div>

                {/* Translated Text */}
                <div>
                    <label htmlFor="translatedText" className="block text-sm font-medium text-gray-700 mb-2">
                        Translated Text *
                    </label>
                    <textarea
                        id="translatedText"
                        value={formData.translatedText}
                        onChange={(e) => handleChange('translatedText', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter the translated text..."
                        required
                    />
                </div>

                {/* Context */}
                <div>
                    <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
                        Context
                    </label>
                    <input
                        type="text"
                        id="context"
                        value={formData.context}
                        onChange={(e) => handleChange('context', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., ui, email, notification"
                    />
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
                        <span>{translation ? 'Update Translation' : 'Create Translation'}</span>
                    )}
                </Button>
            </div>
        </form>
    );
};

export default TranslationForm;
