import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Language } from '../../features/translations/services/translationService';

interface LanguageContextType {
    currentLanguage: Language | null;
    setCurrentLanguage: (language: Language) => void;
    isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [currentLanguage, setCurrentLanguageState] = useState<Language | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load saved language from localStorage
        const savedLanguageCode = localStorage.getItem('current_language') || 'en';

        // Try to get language from localStorage or use default
        const savedLanguageData = localStorage.getItem('current_language_data');
        if (savedLanguageData) {
            try {
                const language = JSON.parse(savedLanguageData);
                setCurrentLanguageState(language);
            } catch (error) {
                console.error('Error parsing saved language data:', error);
            }
        }

        setIsLoading(false);
    }, []);

    const setCurrentLanguage = (language: Language) => {
        setCurrentLanguageState(language);
        localStorage.setItem('current_language', language.code);
        localStorage.setItem('current_language_data', JSON.stringify(language));

        // Update document language and direction
        document.documentElement.lang = language.code;
        if (language.metadata?.direction === 'rtl') {
            document.documentElement.dir = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
        }
    };

    const value: LanguageContextType = {
        currentLanguage,
        setCurrentLanguage,
        isLoading,
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};




