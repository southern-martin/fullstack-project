import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, LanguageIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { useLanguageSelector } from '../hooks/useLanguageSelector';
import { Language } from '../services/translationService';

interface LanguageSelectorProps {
  /** Show flag emoji in dropdown */
  showFlags?: boolean;
  /** Show language code (e.g., "en", "fr") */
  showCode?: boolean;
  /** Minimal mode - compact display */
  minimal?: boolean;
  /** Custom onChange handler */
  onChange?: (language: Language) => void;
  /** Custom className */
  className?: string;
}

/**
 * Language Selector Component
 * 
 * Provides a dropdown to select the current language for translations.
 * Integrates with LanguageProvider for global state management.
 * 
 * Features:
 * - Fetches active languages from Translation Service
 * - Shows language flags (optional)
 * - Displays language codes (optional)
 * - Loading and error states
 * - Matches existing UI component style
 * 
 * @example
 * ```tsx
 * // Standard usage
 * <LanguageSelector />
 * 
 * // Minimal mode with flags
 * <LanguageSelector minimal showFlags />
 * 
 * // Custom onChange
 * <LanguageSelector onChange={(lang) => console.log(lang)} />
 * ```
 */
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  showFlags = true,
  showCode = false,
  minimal = false,
  onChange,
  className = '',
}) => {
  const {
    currentLanguage,
    languages,
    isLoading,
    error,
    changeLanguage,
  } = useLanguageSelector();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageSelect = (languageCode: string) => {
    changeLanguage(languageCode);
    setIsOpen(false);
    
    // Call custom onChange if provided
    if (onChange) {
      const selectedLang = languages.find((lang) => lang.code === languageCode);
      if (selectedLang) {
        onChange(selectedLang);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <GlobeAltIcon className="h-5 w-5 text-red-500" />
        <span className="text-sm text-red-500">Error loading languages</span>
      </div>
    );
  }

  // No languages available
  if (languages.length === 0) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <LanguageIcon className="h-5 w-5 text-gray-400" />
        <span className="text-sm text-gray-500">No languages</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 
          bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 
          focus:ring-blue-500 focus:border-blue-500 transition-colors
          ${minimal ? 'px-2 py-1' : 'px-3 py-2'}
        `}
      >
        {showFlags && currentLanguage?.flag && (
          <span className="text-lg">{currentLanguage.flag}</span>
        )}
        {!showFlags && <GlobeAltIcon className="h-5 w-5 text-gray-500" />}
        
        {!minimal && (
          <span className="text-sm font-medium text-gray-700">
            {currentLanguage?.name || 'Select Language'}
            {showCode && currentLanguage && ` (${currentLanguage.code.toUpperCase()})`}
          </span>
        )}
        
        {minimal && showCode && currentLanguage && (
          <span className="text-sm font-medium text-gray-700">
            {currentLanguage.code.toUpperCase()}
          </span>
        )}
        
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageSelect(lang.code)}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors
                  flex items-center justify-between gap-3
                  ${currentLanguage?.code === lang.code ? 'bg-blue-50' : ''}
                `}
              >
                <div className="flex items-center gap-3 flex-1">
                  {showFlags && lang.flag && (
                    <span className="text-2xl">{lang.flag}</span>
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {lang.name}
                      {lang.isDefault && (
                        <span className="ml-2 text-xs text-blue-600 font-normal">
                          (Default)
                        </span>
                      )}
                    </div>
                    {lang.localName && lang.localName !== lang.name && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {lang.localName}
                      </div>
                    )}
                  </div>
                </div>
                {showCode && (
                  <span className="text-xs font-mono text-gray-500 uppercase">
                    {lang.code}
                  </span>
                )}
                {currentLanguage?.code === lang.code && (
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;

