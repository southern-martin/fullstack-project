import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { translationService, Language } from '../services/translationService';
import { useLanguage } from '../../../app/providers/LanguageProvider';

/**
 * Hook to fetch and manage available languages for translation
 * 
 * Features:
 * - Fetches active languages from Translation Service
 * - Integrates with LanguageProvider for global language state
 * - Auto-selects default language if none is selected
 * - Provides language switching functionality
 * 
 * @returns {Object} Languages data and control functions
 */
export const useLanguageSelector = () => {
  const { currentLanguage, setCurrentLanguage, isLoading: isLanguageLoading } = useLanguage();

  // Fetch available languages from Translation Service
  const {
    data: languagesData,
    isLoading: isFetchingLanguages,
    error,
    refetch,
  } = useQuery({
    queryKey: ['languages', 'active'],
    queryFn: async () => {
      // Fetch active languages - returns Language[]
      const languages = await translationService.getActiveLanguages();
      return languages;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  // Memoize languages array to prevent unnecessary re-renders
  const languages = useMemo(() => languagesData || [], [languagesData]);
  const isLoading = isLanguageLoading || isFetchingLanguages;

  // Auto-select default language if none is selected
  useEffect(() => {
    if (!currentLanguage && languages.length > 0 && !isLoading) {
      // Find default language or use first active language
      const defaultLang = languages.find((lang: Language) => lang.isDefault) || languages[0];
      if (defaultLang) {
        setCurrentLanguage(defaultLang);
      }
    }
  }, [currentLanguage, languages, isLoading, setCurrentLanguage]);

  /**
   * Change the current language
   * @param languageCode - The language code to switch to
   */
  const changeLanguage = (languageCode: string) => {
    const selectedLanguage = languages.find((lang: Language) => lang.code === languageCode);
    if (selectedLanguage) {
      setCurrentLanguage(selectedLanguage);
      
      // Log language change for analytics/debugging
      console.log(`Language changed to: ${selectedLanguage.name} (${selectedLanguage.code})`);
    }
  };

  /**
   * Get language by code
   * @param code - Language code
   * @returns Language object or undefined
   */
  const getLanguageByCode = (code: string): Language | undefined => {
    return languages.find((lang: Language) => lang.code === code);
  };

  return {
    // Current state
    currentLanguage,
    languages,
    isLoading,
    error,
    
    // Actions
    changeLanguage,
    setCurrentLanguage,
    getLanguageByCode,
    refetchLanguages: refetch,
  };
};
