import {
    FunnelIcon,
    MagnifyingGlassIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import React, { useCallback, useState } from 'react';

import { FilterOption } from '../hooks/useTableFilters';

interface AdvancedFiltersProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FilterOption[];
    onFilterChange: (filters: Record<string, any>) => void;
    onSearchChange: (searchTerm: string) => void;
    searchTerm: string;
    activeFilters: string[];
    onClearAll: () => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
    isOpen,
    onClose,
    filters,
    onFilterChange,
    onSearchChange,
    searchTerm,
    activeFilters,
    onClearAll,
}) => {
    const [localFilters, setLocalFilters] = useState<Record<string, any>>({});
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    // Apply filters
    const applyFilters = useCallback(() => {
        onFilterChange(localFilters);
        onSearchChange(localSearchTerm);
        onClose();
    }, [localFilters, localSearchTerm, onFilterChange, onSearchChange, onClose]);

    // Reset filters
    const resetFilters = useCallback(() => {
        setLocalFilters({});
        setLocalSearchTerm('');
        onClearAll();
        onClose();
    }, [onClearAll, onClose]);

    // Update local filter
    const updateLocalFilter = useCallback((key: string, value: any) => {
        setLocalFilters(prev => ({
            ...prev,
            [key]: value,
        }));
    }, []);

    // Render filter input based on type
    const renderFilterInput = (filter: FilterOption) => {
        const value = localFilters[filter.key] || '';

        switch (filter.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => updateLocalFilter(filter.key, e.target.value)}
                        placeholder={filter.placeholder || `Filter by ${filter.label.toLowerCase()}`}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                );

            case 'select':
                return (
                    <select
                        value={value}
                        onChange={(e) => updateLocalFilter(filter.key, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {filter.options?.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'multiselect':
                return (
                    <div className="space-y-2">
                        {filter.options?.map(option => {
                            const isSelected = Array.isArray(value) && value.includes(option.value);
                            return (
                                <label key={option.value} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={(e) => {
                                            const currentValues = Array.isArray(value) ? value : [];
                                            const newValues = e.target.checked
                                                ? [...currentValues, option.value]
                                                : currentValues.filter((v: any) => v !== option.value);
                                            updateLocalFilter(filter.key, newValues);
                                        }}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{option.label}</span>
                                </label>
                            );
                        })}
                    </div>
                );

            case 'date':
                return (
                    <input
                        type="date"
                        value={value}
                        onChange={(e) => updateLocalFilter(filter.key, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                );

            case 'number':
                return (
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => updateLocalFilter(filter.key, Number(e.target.value))}
                        min={filter.min}
                        max={filter.max}
                        step={filter.step}
                        placeholder={filter.placeholder || `Enter ${filter.label.toLowerCase()}`}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                );

            case 'boolean':
                return (
                    <select
                        value={value}
                        onChange={(e) => updateLocalFilter(filter.key, e.target.value === 'true')}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">All</option>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                    </select>
                );

            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <FunnelIcon className="h-6 w-6 text-gray-600" />
                        <h2 className="text-xl font-semibold text-gray-900">Advanced Filters</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {/* Global Search */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Global Search
                        </label>
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                value={localSearchTerm}
                                onChange={(e) => setLocalSearchTerm(e.target.value)}
                                placeholder="Search across all fields..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Active Filters */}
                    {activeFilters.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Active Filters</span>
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-red-600 hover:text-red-700"
                                >
                                    Clear All
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {activeFilters.map(filterKey => {
                                    const filter = filters.find(f => f.key === filterKey);
                                    if (!filter) return null;

                                    return (
                                        <span
                                            key={filterKey}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                        >
                                            {filter.label}
                                            <button
                                                onClick={() => updateLocalFilter(filterKey, '')}
                                                className="ml-1 hover:text-blue-600"
                                            >
                                                <XMarkIcon className="h-3 w-3" />
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Filter Fields */}
                    <div className="space-y-6">
                        {filters.map(filter => (
                            <div key={filter.key}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {filter.label}
                                </label>
                                {renderFilterInput(filter)}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200">
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Reset
                    </button>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={applyFilters}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

