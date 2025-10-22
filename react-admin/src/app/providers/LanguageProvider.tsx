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
    // Default English language object
    const [defaultEnglishLanguage] = useState<Language>({
        code: 'en',
        name: 'English',
        localName: 'English',
        status: 'active',
        isDefault: true,
        isActive: true,
        isRTL: false,
        metadata: {
            direction: 'ltr',
        },
    });

    const [currentLanguage, setCurrentLanguageState] = useState<Language | null>(defaultEnglishLanguage);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Try to get language from localStorage or use default
        const savedLanguageData = localStorage.getItem('current_language_data');
        if (savedLanguageData) {
            try {
                const language = JSON.parse(savedLanguageData);
                setCurrentLanguageState(language);
            } catch (error) {
                console.error('Error parsing saved language data:', error);
                // Fall back to default English
                setCurrentLanguageState(defaultEnglishLanguage);
            }
        } else {
            // No saved language, use default English
            setCurrentLanguageState(defaultEnglishLanguage);
        }

        setIsLoading(false);
    }, [defaultEnglishLanguage]);

    const setCurrentLanguage = (language: Language) => {
        setCurrentLanguageState(language);
        localStorage.setItem('current_language', language.code);
        localStorage.setItem('current_language_data', JSON.stringify(language));

        // Update document language and direction
        document.documentElement.lang = language.code;
        if (language.isRTL) {
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







