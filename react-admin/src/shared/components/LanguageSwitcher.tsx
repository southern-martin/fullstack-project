import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../app/providers/LanguageProvider';
import { Language, translationService } from '../../features/translations/services/translationService';
import { getLanguageFlag } from '../utils/languageFlags';

interface LanguageSwitcherProps {
    onLanguageChange?: (language: Language) => void;
    className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
    onLanguageChange,
    className = '',
}) => {
    const { currentLanguage, setCurrentLanguage } = useLanguage();
    const [languages, setLanguages] = useState<Language[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLanguages();
    }, []);

    const loadLanguages = async () => {
        try {
            setLoading(true);
            const response = await translationService.getActiveLanguages();
            setLanguages(response);
        } catch (error) {
            console.error('Error loading languages:', error);
            toast.error('Failed to load languages');
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageChange = async (language: Language) => {
        try {
            setCurrentLanguage(language);

            // Notify parent component
            if (onLanguageChange) {
                onLanguageChange(language);
            }

            // Show success message
            toast.success(`Language changed to ${language.name}`);

            setIsOpen(false);
        } catch (error) {
            console.error('Error changing language:', error);
            toast.error('Failed to change language');
        }
    };

    if (loading) {
        return (
            <div className={`flex items-center space-x-2 ${className}`}>
                <GlobeAltIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <span className="text-sm text-gray-400 dark:text-gray-500">Loading...</span>
            </div>
        );
    }

    if (!currentLanguage && languages.length > 0) {
        // If we have languages but no current language, set the first one as default
        const defaultLang = languages.find(lang => lang.code === 'en') || languages[0];
        setCurrentLanguage(defaultLang);
        return null; // Will re-render with the set language
    }

    if (!currentLanguage) {
        return (
            <div className={`flex items-center space-x-2 ${className}`}>
                <GlobeAltIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <span className="text-sm text-gray-400 dark:text-gray-500">No languages available</span>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md"
                aria-label="Select language"
                title={`Current language: ${currentLanguage.name}`}
            >
                <GlobeAltIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-lg leading-none">{getLanguageFlag(currentLanguage.code)}</span>
                <span className="hidden sm:inline text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
                <ChevronDownIcon className={`h-3.5 w-3.5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 z-20 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden">
                        {/* Header */}
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-2">
                                <GlobeAltIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                    Select Language
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {languages.length} languages available
                            </p>
                        </div>

                        {/* Language List with Scroll */}
                        <div className="max-h-80 overflow-y-auto overscroll-contain">
                            <div className="py-1">
                                {languages.map((language) => (
                                    <button
                                        key={language.code}
                                        onClick={() => handleLanguageChange(language)}
                                        className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                                            currentLanguage.code === language.code 
                                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-l-2 border-blue-500' 
                                                : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                        title={`Switch to ${language.name} (${language.localName})`}
                                    >
                                        <span className="text-xl leading-none">{getLanguageFlag(language.code)}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium truncate">{language.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{language.localName}</div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            {language.isDefault && (
                                                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded">
                                                    Default
                                                </span>
                                            )}
                                            {currentLanguage.code === language.code && (
                                                <span className="text-blue-600 dark:text-blue-400 font-bold">
                                                    ✓
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Saved locally
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default LanguageSwitcher;
