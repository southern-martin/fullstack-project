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
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                aria-label="Select language"
            >
                <span className="text-lg">{getLanguageFlag(currentLanguage.code)}</span>
                <span className="hidden sm:inline">{currentLanguage.name}</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 z-20 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                        <div className="py-1">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                                Select Language
                            </div>

                            {languages.map((language) => (
                                <button
                                    key={language.code}
                                    onClick={() => handleLanguageChange(language)}
                                    className={`w-full flex items-center space-x-3 px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${currentLanguage.code === language.code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    <span className="text-lg">{getLanguageFlag(language.code)}</span>
                                    <div className="flex-1">
                                        <div className="font-medium">{language.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{language.localName}</div>
                                    </div>
                                    {language.code === 'en' && (
                                        <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-2 py-0.5 rounded-full">
                                            Default
                                        </span>
                                    )}
                                    {currentLanguage.code === language.code && (
                                        <span className="text-blue-600 dark:text-blue-400">
                                            ✓
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
                            Language settings are saved locally
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default LanguageSwitcher;
