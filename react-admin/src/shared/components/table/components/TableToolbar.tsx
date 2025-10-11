import {
    AdjustmentsHorizontalIcon,
    ArrowDownTrayIcon,
    FunnelIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';


import { FilterOption } from '../hooks/useTableFilters';
import { AdvancedFilters } from './AdvancedFilters';
import { TableSettings } from './TableSettings';

interface TableToolbarProps {
    onExport?: (format: 'csv' | 'excel' | 'pdf') => void;
    filters?: FilterOption[];
    onFilterChange?: (filters: Record<string, any>) => void;
    onSearchChange?: (searchTerm: string) => void;
    searchTerm?: string;
    activeFilters?: string[];
    onClearAllFilters?: () => void;
    showSearch?: boolean;
    showFilters?: boolean;
    showExport?: boolean;
    showSettings?: boolean;
    customActions?: React.ReactNode;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
    onExport,
    filters = [],
    onFilterChange,
    onSearchChange,
    searchTerm = '',
    activeFilters = [],
    onClearAllFilters,
    showSearch = true,
    showFilters = true,
    showExport = true,
    showSettings = true,
    customActions,
}) => {
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [showTableSettings, setShowTableSettings] = useState(false);
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    // Handle search
    const handleSearch = (term: string) => {
        setLocalSearchTerm(term);
        onSearchChange?.(term);
    };

    // Handle export
    const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
        onExport?.(format);
    };

    // Handle filter change
    const handleFilterChange = (filters: Record<string, any>) => {
        onFilterChange?.(filters);
    };

    // Handle clear all filters
    const handleClearAllFilters = () => {
        setLocalSearchTerm('');
        onClearAllFilters?.();
    };

    return (
        <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
                {/* Left side - Search and Filters */}
                <div className="flex items-center space-x-4">
                    {/* Search */}
                    {showSearch && (
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={localSearchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder='Search users...'
                                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {localSearchTerm && (
                                <button
                                    onClick={() => handleSearch('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Advanced Filters Button */}
                    {showFilters && filters.length > 0 && (
                        <button
                            onClick={() => setShowAdvancedFilters(true)}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${activeFilters.length > 0 || localSearchTerm
                                ? 'border-blue-300 bg-blue-50 text-blue-700'
                                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <FunnelIcon className="h-4 w-4" />
                            <span>Filters</span>
                            {(activeFilters.length > 0 || localSearchTerm) && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {activeFilters.length + (localSearchTerm ? 1 : 0)}
                                </span>
                            )}
                        </button>
                    )}

                    {/* Clear Filters */}
                    {(activeFilters.length > 0 || localSearchTerm) && (
                        <button
                            onClick={handleClearAllFilters}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center space-x-2">
                    {/* Custom Actions */}
                    {customActions}

                    {/* Export */}
                    {showExport && onExport && (
                        <div className="relative group">
                            <button className="flex items-center space-x-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <ArrowDownTrayIcon className="h-4 w-4" />
                                <span>Export</span>
                            </button>

                            {/* Export Dropdown */}
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                <div className="py-1">
                                    <button
                                        onClick={() => handleExport('csv')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Export as CSV
                                    </button>
                                    <button
                                        onClick={() => handleExport('excel')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Export as Excel
                                    </button>
                                    <button
                                        onClick={() => handleExport('pdf')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Export as PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings */}
                    {showSettings && (
                        <button
                            onClick={() => setShowTableSettings(true)}
                            className="flex items-center space-x-2 px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <AdjustmentsHorizontalIcon className="h-4 w-4" />
                            <span>Settings</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Advanced Filters Modal */}
            {showAdvancedFilters && (
                <AdvancedFilters
                    isOpen={showAdvancedFilters}
                    onClose={() => setShowAdvancedFilters(false)}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onSearchChange={onSearchChange || (() => { })}
                    searchTerm={localSearchTerm}
                    activeFilters={activeFilters}
                    onClearAll={handleClearAllFilters}
                />
            )}

            {/* Table Settings Modal */}
            {showTableSettings && (
                <TableSettings
                    isOpen={showTableSettings}
                    onClose={() => setShowTableSettings(false)}
                    onExport={onExport}
                />
            )}
        </div>
    );
};
