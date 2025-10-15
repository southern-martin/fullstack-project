import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import React from 'react';

export interface SortOption {
    key: string;
    label: string;
    defaultOrder?: 'asc' | 'desc';
}

export interface ServerSortingProps {
    // Sorting state
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;

    // Configuration
    sortOptions: SortOption[];
    placeholder?: string;

    // Loading state
    loading?: boolean;

    // Styling
    className?: string;
    selectClassName?: string;
}

export const ServerSorting: React.FC<ServerSortingProps> = ({
    sortBy,
    sortOrder,
    onSortChange,
    sortOptions,
    placeholder = 'Sort by...',
    loading = false,
    className = '',
    selectClassName = '',
}) => {
    const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSortBy = e.target.value;
        if (newSortBy && newSortBy !== sortBy) {
            // Find the default order for this sort option
            const option = sortOptions.find(opt => opt.key === newSortBy);
            const defaultOrder = option?.defaultOrder || 'asc';
            onSortChange(newSortBy, defaultOrder);
        }
    };

    const handleSortOrderToggle = () => {
        if (sortBy) {
            const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            onSortChange(sortBy, newOrder);
        }
    };

    const getSortIcon = () => {
        if (!sortBy) return null;

        return sortOrder === 'asc' ? (
            <ChevronUpIcon className="h-4 w-4" />
        ) : (
            <ChevronDownIcon className="h-4 w-4" />
        );
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <label htmlFor="sort-by" className="text-sm text-gray-700 whitespace-nowrap">
                Sort by:
            </label>

            <div className="flex items-center gap-1">
                <select
                    id="sort-by"
                    value={sortBy}
                    onChange={handleSortByChange}
                    disabled={loading}
                    className={`rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${selectClassName}`}
                >
                    <option value="">{placeholder}</option>
                    {sortOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                            {option.label}
                        </option>
                    ))}
                </select>

                {sortBy && (
                    <button
                        type="button"
                        onClick={handleSortOrderToggle}
                        disabled={loading}
                        className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                    >
                        {getSortIcon()}
                    </button>
                )}
            </div>
        </div>
    );
};
