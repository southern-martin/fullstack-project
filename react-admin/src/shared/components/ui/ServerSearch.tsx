import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { useState, useEffect, useCallback } from 'react';

export interface ServerSearchProps {
  // Search state
  searchTerm: string;
  onSearchChange: (search: string) => void;
  
  // Loading state
  loading?: boolean;
  
  // Configuration
  placeholder?: string;
  debounceMs?: number;
  showClearButton?: boolean;
  autoFocus?: boolean;
  
  // Styling
  className?: string;
  inputClassName?: string;
}

export const ServerSearch: React.FC<ServerSearchProps> = ({
  searchTerm,
  onSearchChange,
  loading = false,
  placeholder = 'Search...',
  debounceMs = 300,
  showClearButton = true,
  autoFocus = false,
  className = '',
  inputClassName = '',
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        onSearchChange(localSearchTerm);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localSearchTerm, searchTerm, onSearchChange, debounceMs]);

  // Sync with external search term changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setLocalSearchTerm('');
    onSearchChange('');
  }, [onSearchChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  }, [handleClear]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon 
            className={`h-4 w-4 ${loading ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} 
          />
        </div>
        
        <input
          type="text"
          value={localSearchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={loading}
          className={`block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName}`}
        />
        
        {showClearButton && localSearchTerm && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Clear search"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
      {loading && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};
