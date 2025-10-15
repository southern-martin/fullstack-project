import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../../../shared/components/ui/Button';
import { Language, Translation } from '../services/translationService';

interface TranslationFormProps {
    translation?: Translation;
    languages: Language[];
    onSubmit: (data: any) => void;
    onCancel: () => void;
    onFooterReady?: (footer: React.ReactNode) => void;
}

const TranslationForm: React.FC<TranslationFormProps> = ({
    translation,
    languages,
    onSubmit,
    onCancel,
    onFooterReady,
}) => {
    const [formData, setFormData] = useState({
        key: translation?.key || '',
        value: translation?.value || '',
        languageId: translation?.languageId?.toString() || '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use ref to access current form data without causing re-renders
    const formDataRef = useRef(formData);
    formDataRef.current = formData;

    // Use ref to track if footer has been passed to parent
    const footerPassedRef = useRef(false);

    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }

        const currentFormData = formDataRef.current;
        if (!currentFormData.key.trim() || !currentFormData.value.trim() || !currentFormData.languageId) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit({
                ...currentFormData,
                languageId: parseInt(currentFormData.languageId),
            });
        } catch (error) {
            // Error handling is done in parent component
        } finally {
            setIsSubmitting(false);
        }
    }, [onSubmit]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    // Memoize footer to prevent infinite re-renders
    const footer = useMemo(() => (
        <div className="flex justify-end space-x-3">
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
                onClick={handleSubmit}
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
    ), [onCancel, isSubmitting, handleSubmit, translation]);

    // Pass footer to parent component only once when component mounts
    useEffect(() => {
        if (onFooterReady && !footerPassedRef.current) {
            onFooterReady(footer);
            footerPassedRef.current = true;
        }
    }, [onFooterReady, footer]);

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
                                🌐 {language.name} ({language.code})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Translation Value */}
                <div>
                    <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-2">
                        Translation Value *
                    </label>
                    <textarea
                        id="value"
                        value={formData.value}
                        onChange={(e) => handleChange('value', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter the translation value..."
                        required
                    />
                </div>
            </div>

            {/* Form Actions - Footer will be rendered in Modal footer */}
        </form>
    );
};

export default TranslationForm;
