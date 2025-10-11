import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../app/providers/LanguageProvider';
import { Language, translationService } from '../../features/translations/services/translationService';

const LanguageSwitcherDebug: React.FC = () => {
    const { currentLanguage, setCurrentLanguage, isLoading } = useLanguage();
    const [languages, setLanguages] = useState<Language[]>([]);
    const [debugInfo, setDebugInfo] = useState<string>('');

    useEffect(() => {
        const loadDebugInfo = async () => {
            try {
                const response = await translationService.getActiveLanguages();
                setLanguages(response);
                setDebugInfo(`
          Languages loaded: ${response.length}
          Current language: ${currentLanguage ? currentLanguage.name : 'null'}
          Is loading: ${isLoading}
          Languages: ${response.map(l => l.name).join(', ')}
        `);
            } catch (error) {
                setDebugInfo(`Error: ${error}`);
            }
        };

        loadDebugInfo();
    }, [currentLanguage, isLoading]);

    const handleSetLanguage = (language: Language) => {
        setCurrentLanguage(language);
    };

    return (
        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-md m-4">
            <h3 className="font-bold text-yellow-800 mb-2">Language Switcher Debug</h3>
            <pre className="text-xs text-yellow-700 mb-4">{debugInfo}</pre>

            <div className="space-y-2">
                <h4 className="font-semibold text-yellow-800">Available Languages:</h4>
                {languages.map((language) => (
                    <button
                        key={language.id}
                        onClick={() => handleSetLanguage(language)}
                        className={`block w-full text-left p-2 rounded ${currentLanguage?.id === language.id
                                ? 'bg-blue-200 text-blue-800'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        {language.metadata?.flag} {language.name} ({language.code})
                        {language.isDefault && ' - DEFAULT'}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LanguageSwitcherDebug;




