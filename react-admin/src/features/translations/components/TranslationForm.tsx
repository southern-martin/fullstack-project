import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from '../../../shared/components/ui/Button';
import { getLanguageFlag } from '../../../shared/utils/languageFlags';
import { useTranslationLabels } from '../hooks';
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
    // Translation labels hook
    const { L } = useTranslationLabels();

    const [formData, setFormData] = useState({
        key: translation?.key || '',
        original: translation?.original || '',
        destination: translation?.destination || '',
        languageCode: translation?.languageCode || '',
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
        if (!currentFormData.key.trim() || !currentFormData.original.trim() || !currentFormData.destination.trim() || !currentFormData.languageCode) {
            toast.error(L.validation.originalRequired);
            return;
        }

        try {
            setIsSubmitting(true);
            await onSubmit({
                key: currentFormData.key,
                original: currentFormData.original,
                destination: currentFormData.destination,
                languageCode: currentFormData.languageCode,
            });
        } catch (error) {
            // Error handling is done in parent component
        } finally {
            setIsSubmitting(false);
        }
    }, [L, onSubmit]);

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
                {L.buttons.cancel}
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
                        <span>{L.messages.updateSuccess}...</span>
                    </>
                ) : (
                    <span>{translation ? L.buttons.save : L.buttons.create}</span>
                )}
            </Button>
        </div>
    ), [L, onCancel, isSubmitting, handleSubmit, translation]);

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
                    <label htmlFor="key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {L.form.key} *
                    </label>
                    <input
                        type="text"
                        id="key"
                        value={formData.key}
                        onChange={(e) => handleChange('key', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                        placeholder={L.placeholders.key}
                        required
                    />
                </div>

                {/* Language Selection */}
                <div>
                    <label htmlFor="languageCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {L.form.languageCode} *
                    </label>
                    <select
                        id="languageCode"
                        value={formData.languageCode}
                        onChange={(e) => handleChange('languageCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                        required
                    >
                        <option value="">{L.placeholders.selectLanguage}</option>
                        {languages.map((language) => (
                            <option key={language.code} value={language.code}>
                                {language.flag || getLanguageFlag(language.code)} {language.name} ({language.code})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Original Text */}
                <div>
                    <label htmlFor="original" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {L.form.original} *
                    </label>
                    <textarea
                        id="original"
                        value={formData.original}
                        onChange={(e) => handleChange('original', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                        placeholder={L.placeholders.original}
                        required
                    />
                </div>

                {/* Translated Text */}
                <div>
                    <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {L.form.destination} *
                    </label>
                    <textarea
                        id="destination"
                        value={formData.destination}
                        onChange={(e) => handleChange('destination', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
                        placeholder={L.placeholders.destination}
                        required
                    />
                </div>
            </div>

            {/* Form Actions - Footer will be rendered in Modal footer */}
        </form>
    );
};

export default TranslationForm;
